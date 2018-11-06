module.exports = {
    base: '/imageviewer/',
    title: '移动图片放大浏览器',
    description: '移动图片放大浏览器',
    head: [
        ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
        ['meta', {name: 'viewport', content: 'initial-scale=1,maximum-scale=1,user-scalable=no'}]
    ],
    foot: false,
    themeConfig: {
        nav: [
            {text: '首页', link: '/'},
            {text: '指导', link: '/guide/'},
            {text: 'API', link: '/api/'},
            {text: 'Github', link: 'https://github.com/mux-team/mux-solution'}
        ],
        sidebar: 'auto',
        sidebarDepth: 0
    }
};
