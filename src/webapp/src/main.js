import Vue from 'vue';
import App from './App.vue';

import VApp from 'vuetify/es5/components/VApp';

import vuetify from '@/plugins/vuetify';

import VToolbar from 'vuetify/es5/components/VToolbar';
import VTextField from 'vuetify/es5/components/VTextField';
import VDataTable from 'vuetify/es5/components/VDataTable';
import VFlex from 'vuetify/es5/components/VGrid';
import VBtn from 'vuetify/es5/components/VBtn';
import VIcon from 'vuetify/es5/components/VIcon';
import VProgressCircular from 'vuetify/es5/components/VProgressCircular';
import VCard from 'vuetify/es5/components/VCard';
import VDivider from 'vuetify/es5/components/VDivider';
import VList from 'vuetify/es5/components/VList';
import VPagination from 'vuetify/es5/components/VPagination';

import transitions from 'vuetify/es5/components/transitions';

import global from './less/global.less'; //eslint-disable-line no-unused-vars

import { store } from './store/appStore';

Vue.config.productionTip = false;

Vue.use({
    components: {
        VApp,
        VToolbar,
        VTextField,
        VDataTable,
        VFlex,
        VBtn,
        VIcon,
        VProgressCircular,
        VCard,
        VDivider,
        VList,
        VPagination,
        transitions,
    },
});

new Vue({
    vuetify,
    store,
    render: h => h(App),
}).$mount('#app');
