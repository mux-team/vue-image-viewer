<template>
    <div id="index">
        <div class="main">
            <div class="example">
                <!-- <img src="./img/example.gif"> -->
            </div>
            <div class="desc">
                <h1>vue-image-viewer</h1>
                <h2>移动端图片浏览放大器</h2>
                <p>一款基于 Vue.js 的移动图片放大浏览器</p>
                <div class="opt-wrapper">
                    <router-link :to="{path: '/guide/'}" class="card-btn">开始</router-link>
                    <a href="https://github.com/mux-team/vue-image-viewer" class="card-btn white">github</a>
                </div>
            </div>
        </div>
        <footer>MIT Licensed | Copyright ©2018 MUX</footer>
    </div>
</template>

<style lang="stylus" scoped>
$accentColor = #38f
$borderColor = #eaecef

#index
    background-color #fafafa
    overflow hidden

    .main
        width 800px
        margin 40px auto
        display flex

    .example
        text-align center
        width 308px

    h1
        font-size 32px
        color #32495f
        margin 70px auto 20px
        text-align center

    h2
        font-size 20px
        color #6889a9
        border none
        margin 20px 0 0

    p
        font-size 12px
        color #6889a9
        margin 0

    .desc
        flex 1
        margin-left 30px
        padding-top 100px
        text-align center

        .opt-wrapper
            margin 40px 0

        .card-btn
            color #fff
            background linear-gradient(30deg,#3f5b77,#51779b)
            padding 16px 48px
            font-size 20px
            border none
            cursor pointer
            line-height 24px
            margin-right 10px

            &.white
                background #fff
                color #32495f

    footer
        margin 0 auto 40px
        text-align center
        color #999



</style>
