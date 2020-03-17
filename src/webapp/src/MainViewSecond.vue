<template>
    <v-app>
        <v-content>
            <pdf-viewer wrapper-selector=".v-content" :file-path="fileUrl" v-bind:offset="1"/>
        </v-content>
    </v-app>
</template>
<script>
import * as VApp from 'vuetify/es5/components/VApp';
import * as VFlex from 'vuetify/es5/components/VGrid';
import * as VLayout from 'vuetify/es5/components/VGrid';
import * as VContent from 'vuetify/es5/components/VGrid';
import PdfViewer from '@/components/PdfViewerComponent';

export default {
    name: 'MainView',
    components: {
        ...VApp,
        ...VFlex,
        ...VLayout,
        ...VContent,
        PdfViewer
    },
    computed: {
        fileUrl: function() {
            return this.$store.state.selectedItem;
        }
    }
};
</script>
