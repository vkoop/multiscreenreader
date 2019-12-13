import Vue from 'vue';
import Vuex from 'vuex';

import createMutationsSharer from 'vuex-shared-mutations';

Vue.use(Vuex);

import { ipcRenderer } from 'electron';

export const store = new Vuex.Store({
    state: {
        currentPage: 1,
        displays: 2,
        selectedItem: ''
    },
    plugins: [createMutationsSharer({ predicate: () => true })],
    mutations: {
        incrementPage(state) {
            if (state.currentPage + state.displays <= state.pageCount) {
                state.currentPage = state.currentPage + state.displays;
            }
        },
        decrementPage(state) {
            if (state.currentPage - state.displays > 0) {
                state.currentPage = state.currentPage - state.displays;
            }
        },
        selectItem(state, item) {
            state.selectedItem = item;
            state.currentPage = 1;
        },
        setPageCount(state, pageCount) {
            state.pageCount = pageCount;
        }
    }
});

ipcRenderer.on('load-file-event', (event, { path }) => {
    console.log("load event")
    store.commit('selectItem', path);
});
