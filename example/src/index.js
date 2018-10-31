/**
 * @file 首页
 * @author lixiaoqing(lixiaoqing01@baidu.com)
 * @date 2018-06-20
 */

import 'babel-polyfill';
import Vue from 'vue';
import App from './app';

Vue.config.productionTip = false;


new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
});
