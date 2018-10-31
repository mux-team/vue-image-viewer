<template>
    <toast-popup
        :state="oState"
        :has-mask="false"
        @change="changeState"
    >
        <div class="toast-content">
            {{content}}
        </div>
    </toast-popup>
</template>

<script>
import ToastPopup from './ToastPopup';

export default {
    name: 'toast',
    props: {
        content: {
            type: String,
            default: ''
        },
        state: {
            type: Boolean,
            default: false
        },
        autoClose: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            oState: this.state,
            timer: null
        }
    },
    components: {
        ToastPopup
    },
    methods: {
        changeState(value) {
            this.$emit('change', value);
            this.oState = value;
            if (this.autoClose && value === true) {
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.changeState(false);
                }, this.duration);
            }
        }
    },
    watch: {
        state(value) {
            this.changeState(value);
        }
    }
};
</script>

<style lang="stylus" scoped>
.toast-content
    background rgba(0, 0, 0, 0.8)
    border-radius 4px
    color #fff
    text-align center
    white-space nowrap
    padding 17px
    line-height 36px
    font-size 16px
    box-sizing border-box
    max-width 80%
</style>
