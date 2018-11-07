module.exports = {
    base: '/vue-image-viewer/',
    title: 'vue-image-viewer',
    description: '一款基于vuejs的移动图片放大浏览器',
    head: [
        ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
        ['meta', {name: 'viewport', content: 'initial-scale=1,maximum-scale=1,user-scalable=no'}]
    ],
    foot: false,
    themeConfig: {
        repo: '/mux-team/vue-image-viewer',
        nav: [
            {text: '首页', link: '/'},
            {text: '指导', link: '/guide/'},
            {text: '示例', link: '/example/'},
            {text: 'API', link: '/api/'}
        ],
        sidebar: {
            '/guide/': [
                ''
            ],
            '/example/': [
                {
                    title: '示例',
                    collapsable: false,
                    children: [
                        '/example/',
                        '/example/demo1',
                        '/example/demo2',
                        '/example/demo3',
                        '/example/demo4'
                    ]
                }
            ],
            '/api/': [
                ''
            ],
            '/demo/': [
                '',
                'demo1'
            ]
        },
        sidebarDepth: 1
    }
};
