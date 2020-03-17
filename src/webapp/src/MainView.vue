import { dialog } from "electron";
<template>
    <v-app>
        <v-content>
            <pdf-viewer wrapper-selector=".v-content" :file-path="fileUrl" v-bind:offset="0" v-if="fileUrl"/>
            <v-container  v-if="!fileUrl" fill-height fluid>
                <v-row justify="center" align="center" style="height: 100%;">
                    <v-btn  @click="openfile()">Select file</v-btn>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
import * as VApp from 'vuetify/es5/components/VApp';
import * as VFlex from 'vuetify/es5/components/VGrid';
import * as VLayout from 'vuetify/es5/components/VGrid';
import * as VContent from 'vuetify/es5/components/VGrid';

import PdfViewer from '@/components/PdfViewerComponent';

import {  remote } from 'electron';

export default {
    name: 'MainView',
    components: {
        ...VApp,
        ...VFlex,
        ...VLayout,
        ...VContent,
        PdfViewer
    },

    methods: {
        openfile() {
            remote.dialog
                .showOpenDialog({
                    filters: [{ name: 'PDF', extensions: ['pdf'] }],

                    properties: ['openFile']
                })
                .then(({ filePaths }) => {
                    remote.getCurrentWindow().webContents.send('load-file-event', { path: filePaths[0] });
                });
        }
    },

    computed: {
        fileUrl: function() {
            return this.$store.state.selectedItem;
        }
    }
};
</script>
