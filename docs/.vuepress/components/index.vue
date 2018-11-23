<template>
    <div id="index">
        <div class="main">
            <div class="example">
                <img src="./img/example1.gif">
            </div>
            <div class="desc">
                <h1>vue-image-viewer</h1>
                <h2>移动端图片浏览放大器</h2>
                <p>一款基于 Vue.js 的移动图片放大浏览器</p>
                <div class="opt-wrapper">
                    <router-link :to="{path: '/wiki/'}" class="card-btn">开始</router-link>
                    <a href="https://github.com/mux-team/mux-solution" class="card-btn white">github</a>
                </div>
                <div class="feature">
                    <ul>
                        <li>从目标区域展开，收起后回到目标区域</li>
                        <li>双击、多点触控进⾏行行放⼤缩小操作</li>
                        <li>支持下滑隐藏，随位置图⽚渐⼩，背景渐显</li>
                        <li>上拉可以拉出自定义区域，查看更多信息</li>
                    </ul>
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
    min-height 600px

    .main
        width 900px
        margin 40px auto
        display flex

    .example
        text-align center
        width 350px

    h1
        font-size 42px
        font-weight 400
        color #32495f
        margin 120px auto 30px
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
        margin-left 80px
        padding 100px 0
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
        
        .feature
            line-height 32px
            text-align left 
            margin-top 60px

    footer
        margin 0 auto 40px
        text-align center
        color #999



</style>
