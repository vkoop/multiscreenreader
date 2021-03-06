import Vue from 'vue';
import Vuex from 'vuex';
import createMutationsSharer from 'vuex-shared-mutations';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        currentPage: 1,
        displays: 1,
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
        },
        setDisplayCount(state, displayCount) {
            state.displays = displayCount;
        }
    }
});

ipcRenderer.on('load-file-event', (event, { path }) => {
    store.commit('selectItem', path);
});

ipcRenderer.on('set-active-displays', (event, displaycount) => {
    store.commit('setDisplayCount', displaycount);
});
