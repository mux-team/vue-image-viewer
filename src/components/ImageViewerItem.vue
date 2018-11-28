<template>
    <div
        :class="{'grey-bg': isGreyBgShow}"
        class="image-viewer-item"
    >
        <image-viewer-zoom
            ref="zoom"
            :store="store"
            :is-ready="isTargetReady"
            :is-current="isCurrent"
            :inner-width="innerWidth"
            :inner-height="innerHeight"
            :target="zoomTarget"
            :has-second-screen="hasSecondScreen"
            @zoom-tap="onZoomTap"
            @zoom-change="onZoomChange"
            @zoom-target-update="onZoomTargetUpdate"
            @zoom-swipe-down-start="onZoomSwipeDownStart"
            @zoom-swipe-down-move="onZoomSwipeDownMove"
            @zoom-swipe-down-end="onZoomSwipeDownEnd"
            @zoom-swipe-down-cancel="onZoomSwipeDownCancel"
            @zoom-swipe-up-move="onZoomSwipeUpMove"
        >
            <image-viewer-img
                v-if="obj.isSet"
                ref="img"
                :class="{'black-bg': isGreyBgShow}"
                :item="obj.item"
                :is-current="isCurrent"
                :is-leaving="isLeaving"
                :is-swiping-down="isSwipingDown"
                :inner-width="innerWidth"
                :inner-height="innerHeight"
                :pos-y="posY"
                :enter-position="enterPosition"
                :leave-position="leavePosition"
                :is-zoomed="isZoomed"
                :swipe-up-height="swipeUpHeight"
                :swipe-up-y="swipeUpY"
                :has-second-screen="hasSecondScreen"
                :is-second-screen-show="isSecondScreenShow"
                :image-clip-type="imageClipType"
                @enter-start="onEnterStart"
                @enter-end="onEnterEnd"
                @leave-start="onLeaveStart"
                @leave-end="onLeaveEnd"
                @recover-end="onRecoverEnd"
                @img-ready="onImgReady"
                @position-change="onImgPositionChange"
            />
        </image-viewer-zoom>

        <div
            v-show="isCurrent && swipeUpY < 0 && !isLeaving"
            :style="{'min-height': innerHeight - 138 + 'px'}"
            class="image-viewer-item-second-screen"
        >
            <slot name="secondScreen"></slot>
        </div>

        <div
            v-show="isShowAnchor && !isZoomed"
            ref="animateWrapper"
            class="image-viewer-item-animate-wrapper"
        >
            <slot name="anchor"></slot>
        </div>
    </div>
</template>

<script>
import AnimateConfig from '../common/animate-config.js';
import {cssAnimate} from '../common/animate.js';
import ImageViewerZoom from './ImageViewerZoom';
import ImageViewerImg from './ImageViewerImg';
import util from '../common/util.js';
const MIN_SWIPE_UP_DISTANCE = 10;

export default {
    components: {
        ImageViewerZoom,
        ImageViewerImg
    },
    props: {
        isCurrent: {
            type: Boolean,
            required: true
        },
        obj: {
            type: Object,
            required: true
        },
        innerWidth: {
            type: Number,
            required: true
        },
        innerHeight: {
            type: Number,
            required: true
        },
        posY: {
            type: Object,
            default: {}
        },
        enterPosition: {
            type: Object,
            default: {}
        },
        leavePosition: {
            type: Object,
            default: {}
        },
        isLeaving: {
            type: Boolean,
            default: false
        },
        isSwipingDown: {
            type: Boolean,
            default: false
        },
        store: {
            type: Object,
            default: {}
        },
        swipeUpHeight: {
            type: Number,
            default: 0
        },
        swipeUpY: {
            type: Number,
            default: 0
        },
        hasSecondScreen: {
            type: Boolean,
            default: false
        },
        isSecondScreenShow: {
            type: Boolean,
            default: false
        },
        imageClipType: {
            type: String,
            default: 'none'
        }
    },
    data() {
        return {
            isReady: this.isCurrent,
            isShowAnchor: true,
            // 放大态
            isZoomed: false,
            zoomTarget: {},
            zoomHeight: 0,
            isSecondScreenFixed: false
        }
    },
    computed: {
        isTargetReady: function() {
            return this.isReady && !this.isSecondScreenShow;
        },
        isGreyBgShow: function() {
            return this.isSecondScreenFixed && !this.isLeaving && this.isCurrent;
        }
    },
    mounted() {
        this.zoomHeight = this.innerHeight;
    },

    watch: {
        isSwipingDown(newVal) {
            // false到true 下拉开始
            if (newVal) {
                this.showAnchor(false);
            }
        },
        isCurrent(newVal) {
            // 第二屏显示状态下翻页
            if (!newVal && this.zoomHeight !== this.innerHeight) {
                this.showAnchor(true);

                this.zoomHeight = this.innerHeight;
                util.setCss(this.$refs.zoom.$el, {
                    height: ''
                });

                this.$emit('swipe-up-down');
            }
        },
        swipeUpY(newVal) {
            if (this.isCurrent) {
                if (newVal === 0) {
                    this.showAnchor(true);

                    this.zoomHeight = this.innerHeight;
                    util.setCss(this.$refs.zoom.$el, {
                        height: ''
                    });
                }
                else {
                    this.showAnchor(false);

                    this.zoomHeight = this.innerHeight + 2 * newVal;
                    util.setCss(this.$refs.zoom.$el, {
                        height: this.zoomHeight + 'px'
                    });
                }
            }
        },
        isSecondScreenShow(newVal) {
            if (this.isCurrent) {
                // 显示第二屏
                if (newVal) {
                    this.zoomHeight = this.swipeUpHeight;
                    cssAnimate(this.$refs.zoom.$el, {
                        height: this.zoomHeight + 'px'
                    }, {
                        ease: AnimateConfig.transition['ease-in-out6'],
                        duration: AnimateConfig.duration.swipeUp
                    }).then(() => {
                        this.isSecondScreenFixed = true;
                        this.$emit('swipe-up-end');
                    });
                }
                // 隐藏第二屏
                else if (this.swipeUpY !== 0) {
                    this.zoomHeight = this.innerHeight;
                    cssAnimate(this.$refs.zoom.$el, {
                        height: this.zoomHeight + 'px'
                    }, {
                        ease: AnimateConfig.transition['ease-in-out6'],
                        duration: AnimateConfig.duration.swipeUp
                    }).then(() => {
                        util.setCss(this.$refs.zoom.$el, {
                            height: ''
                        });
                        this.$emit('swipe-up-down');
                    });
                }
            }

            if (!newVal) {
                this.isSecondScreenFixed = false;
            }
        }
    },
    methods: {
        onEnterStart(data) {
            this.$emit('enter-start', data);

            if (this.enterPosition.width) {
                this.$nextTick(() => {
                    this.showAnchor(false);
                });
            }
        },
        onEnterEnd(data) {
            this.$emit('enter-end', data);

            this.showAnchor(true);
        },
        onLeaveStart(data) {
            this.$emit('leave-start', data);

            this.showAnchor(false);
        },
        onLeaveEnd(data) {
            this.$emit('leave-end', data);
        },
        onRecoverEnd() {
            this.showAnchor(true);
        },
        // 图片状态变化
        onImgReady(data) {
            this.isReady = data;
        },
        onImgPositionChange(target) {
            if (target.el && target.position) {
                this.zoomTarget = target;
            }
        },
        // zoom相关
        onZoomTap() {
            this.$emit('zoom-tap');
        },
        onZoomChange(data) {
            this.isZoomed = data;
        },
        onZoomSwipeDownStart() {
            this.$emit('zoom-swipe-down-start');
        },
        onZoomSwipeDownMove(data) {
            this.$emit('zoom-swipe-down-move', data);
        },
        onZoomSwipeDownEnd() {
            this.$emit('zoom-swipe-down-end');
        },
        onZoomSwipeDownCancel() {
            this.$emit('zoom-swipe-down-cancel');
        },
        onZoomTargetUpdate(data) {
            this.$refs.img.updateStyle(data);
        },
        onZoomSwipeUpMove(moveY) {
            if (moveY < -MIN_SWIPE_UP_DISTANCE) {
                this.$emit('zoom-swipe-up-end');
            }
        },

        showAnchor(isShow) {
            this.isShowAnchor = isShow;
        }
    }
};
</script>


<style lang="stylus" scoped>
.image-viewer-item
    position relative
    overflow-x hidden
    overflow-y auto
    -webkit-overflow-scrolling touch
    width 100%
    height 100%


.image-viewer-item-second-screen
    position relative
    width 100%
    background-color #f1f1f1


.grey-bg
    background-color #f1f1f1


.black-bg
    background-color #000

</style>