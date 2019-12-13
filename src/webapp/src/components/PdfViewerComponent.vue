<template>
    <div class="pdf-viewer full-vw-height">
        <v-layout align-center justify-center row fill-height v-show="loading">
            <v-progress-circular :size="50" color="red" indeterminate class="loading-spinner" />
        </v-layout>

        <canvas id="pdf-view-pane" width="100px;" v-show="!loading" @click="nextPage()" @contextmenu="previousPage()" />
    </div>
</template>

<script>
import pdfjs from 'pdfjs-dist';

import worker from 'pdfjs-dist/build/pdf.worker';

import { remote } from 'electron';
const fs = remote.require('fs');

pdfjs.GlobalWorkerOptions.workerSrc = worker;

export default {
    name: 'PdfViewer',
    data: () => ({
        loading: true
    }),
    props: {
        filePath: String,
        wrapperSelector: String,
        offset: {
            type: Number,
            default: 0
        }
    },
    computed: {
        currentPage() {
            let page = this.$store.state.currentPage;

            if (this.offset) {
                page = page + this.offset;
            }
            return page;
        }
    },
    methods: {
        nextPage: function() {
            this.$store.commit('incrementPage');
        },
        previousPage: function() {
            this.$store.commit('decrementPage');
        },
        loadCurrentPage: function() {
            this.loading = true;

            if (this.filePath === '') return;

            const self = this;

            fs.readFile(this.filePath, function(err, data) {
                if (err) {
                    alert('An error ocurred reading the file :' + err.message);
                    return;
                }

                const typedarray = new Uint8Array(data);

                pdfjs
                    .getDocument(typedarray)
                    .promise.then(pdf => {
                        self.$store.commit('setPageCount', pdf.numPages);
                        return pdf.getPage(self.currentPage);
                    })
                    .then(page => {
                        self.loading = false;

                        let desiredWidth = document.querySelector(self.wrapperSelector).clientWidth;
                        let viewport = page.getViewport({ scale: 1 });
                        let scale = desiredWidth / viewport.width;
                        let scaledViewport = page.getViewport({ scale: scale });

                        let canvas = document.getElementById('pdf-view-pane');
                        let context = canvas.getContext('2d');
                        canvas.height = scaledViewport.height;
                        canvas.width = scaledViewport.width;

                        let renderContext = {
                            canvasContext: context,
                            viewport: scaledViewport
                        };
                        page.render(renderContext);
                    });
            });
        }
    },
    mounted() {
        this.loadCurrentPage();
    },
    watch: {
        filePath: {
            handler: function() {
                this.loadCurrentPage();
            }
        },
        currentPage: {
            handler: function() {
                this.loadCurrentPage();
            }
        }
    }
};
</script>
