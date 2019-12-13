<template>
    <MainViewSecond />
</template>

<script>
import MainViewSecond from './MainViewSecond';

const myApp = {
    name: 'AppSecond',
    components: { MainViewSecond },
    data() {
        return {
            title: 'Vuetify.js'
        };
    }
};

export default myApp;
</script>
