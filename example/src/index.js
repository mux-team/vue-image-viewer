import 'babel-polyfill';
import Vue from 'vue';
import App from './app';

Vue.config.productionTip = false;


new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
});
