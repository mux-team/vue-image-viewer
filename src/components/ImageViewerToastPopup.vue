<template>
    <div>
        <div v-if="oState" class="toast-popup-wrapper">
            <transition :name="transition" appear>
                <div class="toast-popup-content">
                    <slot></slot>
                </div>
            </transition>
        </div>
        <div
            v-if="hasMask"
            :class="{'toast-popup-mask': true, 'WA_LOG_OTHER': dismissible}"
            @touchmove.prevent
            @click="maskClick"
        >
        </div>
    </div>
</template>
<script>
export default {
    props:{
        // 点击组件内容外部可关闭组件
        dismissible: {
            type: Boolean,
            default: true
        },
        transition: {
            type: String,
            default: 'zoom-in-from-big'
        },
        // popup 状态 true 为打开， false 关闭
        state: {
            type: Boolean,
            default: false
        },
        hasMask: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            oState: this.state
        }
    },
    watch: {
        state(value, old) {
            this.change(value);
        }
    },
    methods: {
        maskClick() {
            if (!this.dismissible) {
                return;
            }
            this.change(false);
        },
        change(value) {
            this.$emit('change', value);
            this.oState = value;
        }
    }
};
</script>
<style lang="stylus" scoped>
.toast-popup-wrapper
    position fixed
    top 50%
    left 0
    transform translate(0, -50%)
    z-index 910
    right 0
    display flex
    align-items center
    justify-content center


.toast-popup-content
    width 100%
    display flex
    justify-content center

.toast-popup-mask
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 900
    background rgba(0, 0, 0, 0.65)

.zoom-in-from-big-enter-active
    animation-name zoom-in-from-big
    animation-duration .2s

@keyframes zoom-in-from-big
    0%
        opacity 0
        transform scale3d(1.3, 1.3, 1.3)

    100%
        opacity 1

</style>
