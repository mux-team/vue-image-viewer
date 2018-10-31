<template>
    <div class="loading-wrapper">
        <!-- 图标 -->
        <div
            class="loading-icon-wrapper"
        >
            <span class="loading-icon-wrapper2">
                <!-- 旋转动效；这里使用 before 伪元素会有在华为 p10 上动画不动的问题，所以使用实体元素 -->
                <div class="loading-icon-before"/>
                <!-- 图标 -->
                <!-- <icon
                    class="loading-icon"
                    type="baidu"
                /> -->
            </span>
            <p class="loading-icon-text">{{text}}</p>
        </div>
    </div>
</template>

<script type="config">
export default {
    props: {
        text: {
            type: String,
            default: '加载中...'
        }
    }
}
</script>

<style lang="stylus" scoped>
.loading-wrapper
    text-align center
    // 图标 loading
    .loading-icon-wrapper
        text-align center
        .loading-icon-wrapper2
            display inline-block
            position relative

        .loading-icon-text
            margin 8px 0 0
            text-indent .5em
            color #999

        // 圆形动效
        .loading-icon-before
            position absolute
            display block
            width 5px
            height 5px
            margin auto
            border 2px solid #f3f3f3
            box-sizing content-box
            border-top-color #ddd
            border-radius 50%
            -webkit-transform-origin 50% 50%
            transform-origin 50% 50%
            -webkit-transform rotate(90deg)
            transform rotate(90deg)
            -webkit-animation loading-rotation 1s ease 0s infinite normal
            animation loading-rotation 1s ease 0s infinite normal

        .loading-icon
            position relative
            display block
            width 54px
            height 54px
            margin auto
            font-size 30px
            line-height 52px
            color #f3f3f3


    @keyframes loading-rotation
        from
            -webkit-transform rotate(1deg)
            transform rotate(1deg)

        to
            -webkit-transform rotate(360deg)
            transform rotate(360deg)


    @-webkit-keyframes loading-rotation
        from
            -webkit-transform rotate(1deg)
            transform rotate(1deg)

        to
            -webkit-transform rotate(360deg)
            transform rotate(360deg)
</style>

