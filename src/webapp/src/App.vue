<template>
    <MainView />
</template>

<script>
import MainView from './MainView';

const myApp = {
    name: 'App',
    components: { MainView },
    data() {
        return {
            title: 'Vuetify.js'
        };
    }
};

export default myApp;
</script>
