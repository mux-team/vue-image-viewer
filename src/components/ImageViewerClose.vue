<template>
    <div class="image-viewer-close">
        <div class="image-viewer-close-bg"></div>
        <div class="image-viewer-close-content" @click="onClick($event)">
            <div class="image-viewer-close-icon-user-set" v-if="closeIconURL" :style="{
                width: (closeIconSize || width) + 'px',
                height: (closeIconSize || height) + 'px'
            }">
                <img :src="closeIconURL" alt="">
            </div>
            <div v-else class="image-viewer-close-icon"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            closeIconURL: {
                type: String
            },
            closeIconSize: {
                type: Number
            }
        },
        data() {
            return {
                width: 22,
                height: 22
            }
        },
        methods: {
            onClick(event) {
                this.$emit('click', event);
            },
            getHeight() {
                return this.$el.getBoundingClientRect().height;
            }
        }
    };
</script>

<style lang="stylus" scoped>
.image-viewer-close
    -webkit-tap-highlight-color rgba(0, 0, 0, 0)
    position absolute
    left 0
    top 0
    box-sizing border-box
    width 100%
    height 70px
    z-index 10


.image-viewer-close-bg
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background -webkit-gradient(linear, center top, center bottom,
        color-stop(0%, rgba(0, 0, 0, .25)), color-stop(100%, rgba(0, 0, 0, 0)))


.image-viewer-close-content
    position absolute
    top 20px
    right 17px
    margin -5px
    padding 5px

.image-viewer-close-icon-user-set
    img
        width 100%

.image-viewer-close-icon
    width 22px
    height 22px
    line-height 22px
    text-align center
    text-shadow 0 0 5px rgba(0, 0, 0, 0.6)
    color #fff
    font-size 22px
    background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB7UlEQVRoQ+2ZbVHEMBCG31UADgAHSAAH4OAs4AAHWMABOAAJOOBQACgIszcpE3pNmo93E46hv+76MX2eTZrudgUHvsmB8+NvCTjnNgDuAHwAuBaRl98wQs65cwAPAI4B3IjI/cT1YwScc+/+JD2uEpejJTz8U8C1FZGzmMAWwEkQ9aESC/CK9iYipzEBHapnAEejJSLwnwAuwlmx9xD7C4dK5MJrkBdXoZESJfBRAT0wQqIUPinQW6IGflWgl0QtfJaAtUQLfLaAlUQrfJEAW4IBXyzAkmDBVwm0SjDhqwVqJdjwTQKlEhbwzQK5ElbwFIE1CZ/Vhvm87trLKoPst+gnraRM5E4KpJXUtNHgaSMwkUUkwohS4ekCielEnTZhRGhTaDYK8zmvh03KU6pAZLUJA0aXoAkklkoVMKuxKQKpdd6H36zGbhbIeUlZlqdNAjnwK0ts8zNRLVACbylRJVADbyVRLNACbyFRJMCAZ0tkCzDhmRJZAhbwLIlVAUt4hkRSoAd8q0RUoCd8i0Tq87pZGZiqGUvTjliDYwh8zUjMm3zaYhoKXyoxF3gF8N1AY349KPrU4E+OTKdkl1Kzw6n4oBfgJIlkl1Ib3bf+Rleje8Sz6fTo/29ERAuk3bb6IquJWs9r/gV6RnvpXl+fFMdAaib4NwAAAABJRU5ErkJggg==")
    background-size cover

</style>
