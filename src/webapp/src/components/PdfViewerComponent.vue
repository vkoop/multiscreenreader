<template>
    <div class="pdf-viewer">
        <v-container style="padding: 0px;">
            <v-row align="center" justify="center" v-show="loading" class="full-vw-height">
                <v-progress-circular :size="50" color="red" indeterminate class="loading-spinner" />
            </v-row>
        </v-container>

        <canvas id="pdf-view-pane" :width="width" :height="height" v-show="!loading" @click="nextPage()" @contextmenu="previousPage()" />
    </div>
</template>

<script>
import pdfjs from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker';
import { remote } from 'electron';

import Hammer from 'hammerjs';

const fs = remote.require('fs');

pdfjs.GlobalWorkerOptions.workerSrc = worker;

export default {
    name: 'PdfViewer',
    data: () => ({
        loading: true,
        width: 0,
        height: 0,
        wrapper: null,
        canvas: null
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
        loadCurrentDocument: function() {
            this.loading = true;

            if (this.filePath === '') return;

            fs.readFile(this.filePath, (err, data) => {
                if (err) {
                    alert('An error ocurred reading the file :' + err.message);
                    return;
                }

                const typedarray = new Uint8Array(data);

                pdfjs.getDocument(typedarray).promise.then(pdf => {
                    this.pdf = pdf;
                    this.$store.commit('setPageCount', pdf.numPages);

                    this.loadCurrentPage();
                });
            });
        },
        loadCurrentPage: function() {
            if (this.pdf === undefined) return;

            this.pdf.getPage(this.currentPage).then(page => {
                this.loading = false;

                let desiredWidth = this.wrapper.clientWidth;
                let viewport = page.getViewport({ scale: 1 });
                let scale = desiredWidth / viewport.width;
                let scaledViewport = page.getViewport({ scale: scale });

                this.height = scaledViewport.height;
                this.width = scaledViewport.width;

                let renderContext = {
                    canvasContext: this.canvas.getContext('2d'),
                    viewport: scaledViewport
                };
                page.render(renderContext);
            });
        }
    },
    mounted() {
        this.wrapper = document.querySelector(this.wrapperSelector);
        this.canvas = document.getElementById('pdf-view-pane');

        this.loadCurrentDocument();

        window.addEventListener('resize', () => {
            this.loadCurrentPage();
        });

        const mc = new Hammer(this.wrapper);
        mc.on('swipeleft', () => {
            this.nextPage();
        });
        mc.on('swiperight', () => {
            this.previousPage();
        });
    },
    watch: {
        filePath: {
            handler: function() {
                this.loadCurrentDocument();
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
