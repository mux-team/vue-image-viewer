<template>
    <!-- htmlcs-disable attr-lowercase -->
    <div class="image-viewer-img-wrapper">
        <!-- loading 状态 -->
        <div
            v-show="isLoading && !isSecondScreenShow"
            ref="loading"
            :style="{
                width: innerWidth + 'px',
                height: innerHeight + 'px'
            }"
            class="image-viewer-img-loading"
        >
            <image-viewer-loading
                type="2"
                text-logo-style="dark"
                class="image-viewer-img-loading-content"
            />
        </div>
        <!-- 加载失败状态 -->
        <div
            v-show="isError && !isSecondScreenShow"
            ref="error"
            :style="{
                width: innerWidth + 'px',
                height: innerHeight + 'px'
            }"
            class="image-viewer-img-error"
        >
            <div class="image-viewer-img-error-content">
                <div class="image-viewer-img-error-icon">
                    <svg viewBox="0 0 235 180" xmlns="http://www.w3.org/2000/svg">
                        <g
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                            opacity="0.2"
                        >
                            <g transform="translate(-504.000000, -966.000000)" fill="#DCDCDC">
                                <g transform="translate(383.000000, 966.000000)">
                                    <g transform="translate(121.000000, 0.000000)">
                                        <path
                                            id="Fill-1"
                                            d="M184.235319,73.9520958 C196.521,73.9520958 206.480583,
                                            64.0191605 206.480583,51.7665844 C206.480583,39.5140083 196.521,
                                            29.5808383 184.235319,29.5808383 C171.949873,29.5808383 161.990291,
                                            39.5140083 161.990291,51.7665844 C161.990291,64.0191605 171.949873,
                                            73.9520958 184.235319,73.9520958 L184.235319,73.9520958 Z M0,14.5937428 C0,
                                            6.53311318 6.5142981,0 14.7312313,0 L51.4065268,0 L40.3907925,
                                            47.500288 L88.1254079,76.7311453 L66.0939394,113.269775 L117.500466,
                                            147.115249 L88.1254079,113.269775 L121.171445,73.0772592 L80.781585,
                                            36.5386296 L106.484732,0 L220.261543,0 C228.391072,0 235,6.54030313 235,
                                            14.5937428 L235,165.40625 C235,173.466879 228.463793,179.999992 220.297903,
                                            179.999992 L14.7020965,179.999992 C6.59354463,180.00811 0.01188698,
                                            173.475925 0,165.40625 L0,14.5937428 Z"
                                        >
                                        </path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <p>图片找不到啦~</p>
            </div>
        </div>
        <!-- 正常状态 -->
        <transition
            :css="false"
            appear
            mode="in-out"
            @before-leave="beforeLeave"
            @leave="leave"
            @after-leave="afterLeave"
        >
            <div
                v-show="animationEnd && !isLeaving"
                ref="img"
                :style="imgStyle"
                :class="{hidden: !isReady}"
                class="image-viewer-img"
            >
                <img
                    v-if="imgSrc"
                    :src="imgSrc"
                    @error="onLoadError(imgSrc)"
                    @load="onLoadSuccess(imgSrc)"
                >
            </div>
        </transition>
        <!-- 进场动画使用 -->
        <transition
            :css="false"
            appear
            mode="in-out"
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
        >
            <div
                v-if="!animationEnd"
                class="image-viewer-img"
            >
                <img
                    v-if="imgSrc"
                    :src="imgSrc"
                >
            </div>
        </transition>
    </div>
</template>

<script>
import AnimateConfig from '../common/animate-config.js';
import {scaleImage, layoutImage, cssAnimate, flip} from '../common/animate.js';
import util from '../common/util.js';
import ImageViewerLoading from './ImageViewerLoading';

export default {
    components: {
        ImageViewerLoading
    },
    props: {
        isCurrent: {
            type: Boolean,
            required: true
        },
        item: {
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
        isZoomed: {
            type: Boolean,
            default: false
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
        }
    },
    data() {
        return {
            isLoading: !this.isCurrent,
            isError: false,
            isLongImage: false, // 是否展示为长图
            isSmallImage: false, // 是否展示为小图
            imgPosition: {},
            imgStyle: {},
            animationEnd: !(this.isCurrent && this.enterPosition.width > 0)
        }
    },
    computed: {
        imgSrc: function() {return this.item.src},
        isReady: function() {return !this.isLoading && !this.isError}
    },
    beforeMount() {
        if (this.isCurrent && this.animationEnd) {
            this.$emit('enter-start');
        }
    },
    mounted() {
        this.resetImgPosition();
        if (this.isCurrent && this.animationEnd) {
            this.$emit('enter-end');
        }
    },
    watch: {
        item(newVal) {
            this.isLoading = true;
            this.isError = false;
            this.resetImgPosition();
        },
        innerHeight(newVal) {
            this.resetImgPosition();
        },
        imgPosition(newVal) {
            this.imgStyle = this.getImgStyle();
            this.emitPositionChangeEvent();
        },
        posY(newVal) {
            if (!this.isCurrent || !this.isSwipingDown) {
                return;
            }

            this.swipeDown();
        },
        isSwipingDown(newVal) {
            // true到false 恢复大图
            if (!newVal) {
                this.$emit('recover-start');

                // 图片没有显示
                if (!this.isReady) {
                    this.$refs.loading.style.opacity = 1;
                    this.$refs.error.style.opacity = 1;
                    return;
                }

                cssAnimate(this.$refs.img, {
                    transform: 'none'
                }, {
                    duration: AnimateConfig.duration.swipeDownCancel,
                    ease: AnimateConfig.transition['ease-out']
                }).then(() => {
                    this.$emit('recover-end');
                    this.$emit('img-ready', this.isReady);
                });
            }
            else {
                // 下拉过程中防止其他操作
                this.$emit('img-ready', false);
            }
        },
        isReady(newVal) {
            this.$emit('img-ready', newVal);
        },
        isCurrent(newVal) {
            if (!newVal) {
                // 没有放大时恢复默认样式
                if (!this.isZoomed) {
                    util.setCss(this.$refs.img, {
                        top: this.imgPosition.top + 'px',
                        bottom: ''
                    });
                }
            }
        },
        swipeUpY(newVal) {
            if (this.isCurrent) {
                if (newVal === 0) {
                    if (!this.isZoomed) {
                        util.setCss(this.$refs.img, {
                            top: this.imgPosition.top + 'px',
                            bottom: ''
                        });
                    }
                }
                else {
                    util.setCss(this.$refs.img, {
                        top: '',
                        bottom: Math.max(0, this.imgPosition.top + newVal) + 'px'
                    });
                }
            }
        },
        isSecondScreenShow(newVal) {
            if (this.isCurrent) {
                const config = {
                    ease: AnimateConfig.transition['ease-in-out6'],
                    duration: AnimateConfig.duration.swipeUp
                };

                const targetPosition = Object.assign({}, this.imgPosition);

                // 显示第二屏
                if (newVal) {
                    // transform 动画
                    // 图片放大时
                    if (this.isZoomed) {
                        util.setCss(this.$refs.img, {
                            position: 'fixed',
                            bottom: '',
                            top: this.$refs.img.getBoundingClientRect().top + 'px'
                        });

                        const targetPosition = Object.assign({}, this.imgPosition);
                        if (this.imgPosition.height > this.swipeUpHeight) {
                            targetPosition.top = this.swipeUpHeight - this.imgPosition.height;
                        }
                        else {
                            targetPosition.top = (this.swipeUpHeight - this.imgPosition.height) / 2;
                        }

                        scaleImage(this.$refs.img, targetPosition, () => {
                            util.setCss(this.$refs.img, {
                                position: '',
                                top: '',
                                bottom: Math.max(0, (this.swipeUpHeight - this.imgPosition.height) / 2) + 'px'
                            });
                            this.emitPositionChangeEvent();
                        }, config);
                    }
                    // bottom 动画
                    else {
                        cssAnimate(this.$refs.img, {
                            bottom: Math.max(0, (this.swipeUpHeight - this.imgPosition.height) / 2) + 'px'
                        }, config).then(() => {
                            this.emitPositionChangeEvent();
                        });
                    }
                }
                // 隐藏第二屏
                else if (this.swipeUpY !== 0) {
                    // transform 动画性能优化
                    util.setCss(this.$refs.img, {
                        position: 'fixed',
                        bottom: '',
                        top: this.$refs.img.getBoundingClientRect().top + 'px'
                    });

                    scaleImage(this.$refs.img, targetPosition, () => {
                        util.setCss(this.$refs.img, {
                            position: ''
                        });
                        this.emitPositionChangeEvent();
                    }, config);
                }
            }
        }
    },
    methods: {
        // 图片位置相关
        resetImgPosition() {
            if (this.item.width && this.item.height) {
                this.updateImgPosition();
            }
            // 不传图片宽高时，需要获取图片真实宽高
            else {
                let item = this.item;
                util.loadImg(item).then(imgEl => {
                    if (item === this.item && imgEl) {
                        item.width = imgEl.naturalWidth;
                        item.height = imgEl.naturalHeight;
                        this.updateImgPosition();
                    }
                });
            }
        },
        updateImgPosition() {
            let options = {
                innerWidth: this.innerWidth,
                innerHeight: this.innerHeight,
                width: this.item.width,
                height: this.item.height,
                isOneScreen: this.hasSecondScreen
            };
            let pos = layoutImage(options);

            this.imgPosition = {
                width: pos.width,
                height: pos.height,
                left: pos.left,
                top: pos.top
            };

            this.isLongImage = pos.isLongImage;
            this.isSmallImage = pos.isSmallImage;
        },
        getImgStyle() {
            let style = {};
            Object.keys(this.imgPosition).forEach(prop => {
                style[prop] = this.imgPosition[prop] + 'px';
            });
            return style;
        },
        emitPositionChangeEvent() {
            this.$emit('position-change', {
                el: this.$refs.img,
                position: this.imgPosition,
                isLongImage: this.isLongImage,
                isSmallImage: this.isSmallImage
            });
        },

        // 进场动画
        beforeEnter(el) {
            if (!this.isCurrent) {
                return;
            }

            // 有动画
            if (this.enterPosition.width) {
                const {left, top, width, height} = this.enterPosition;
                el.style.left = left + 'px';
                el.style.top = top + 'px';
                el.style.width = width + 'px';
                el.style.height = height + 'px';

                // 动画降级时不用fixed定位
                if (!util.animationDowngrade) {
                    el.style.position = 'fixed';
                }
            }
            // 没有动画，图片渐显
            else {
                el.style.opacity = 0;
            }
        },
        enter(el, done) {
            if (!this.isCurrent) {
                done();
                return;
            }

            // 有动画
            if (this.enterPosition.width) {
                // 对进场动画图片特殊处理
                if (!this.item.width || !this.item.height) {
                    let defaultWidth = this.enterPosition.width;
                    let defaultHeight = this.enterPosition.height;
                    // 宽图
                    if (defaultWidth / defaultHeight >= this.innerWidth / this.innerHeight) {
                        defaultHeight = this.innerWidth * defaultHeight / defaultWidth;
                        defaultWidth = this.innerWidth;
                    }
                    // 高图
                    else {
                        defaultWidth = this.innerHeight * defaultWidth / defaultHeight;
                        defaultHeight = this.innerHeight;
                    }
                    this.item.width = defaultWidth;
                    this.item.height = defaultHeight;
                }

                // 放大
                let options = {
                    innerWidth: this.innerWidth,
                    innerHeight: this.innerHeight,
                    width: this.item.width,
                    height: this.item.height,
                    isOneScreen: this.hasSecondScreen
                };
                const {left, top, width, height} = layoutImage(options);
                // flip 动画
                flip(el, {left, top, width, height}, {
                    easing: 'ease-in-out',
                    duration: AnimateConfig.duration.enter
                }).then(() => {
                    done();
                });
            }
            // 没有动画，图片渐显
            else {
                cssAnimate(el, {
                    opacity: 1
                }, {
                    duration: AnimateConfig.duration.enter,
                    ease: 'linear'
                }).then(() => {
                    done();
                });
            }

            this.$emit('enter-start');
        },
        afterEnter(el) {
            if (!this.isCurrent) {
                return;
            }

            this.animationEnd = true;
            this.$emit('enter-end');
        },

        // 退场动画
        beforeLeave(el) {
            if (!this.isCurrent) {
                return;
            }

            // 记录当前位置
            const {left, top, width, height} = el.getBoundingClientRect();

            // 发送事件
            this.$emit('leave-start');

            // 有动画
            if (this.leavePosition.width && this.isReady) {
                util.setCss(el, {
                    position: 'fixed',
                    left: left + 'px',
                    top: top + 'px',
                    width: width + 'px',
                    height: height + 'px',
                    transform: 'none'
                });
            }
        },
        leave(el, done) {
            if (!this.isCurrent) {
                done();
                return;
            }

            // 有动画
            if (this.leavePosition.width && this.isReady) {
                const {left, top, width, height} = this.leavePosition;
                // flip 动画
                flip(el, {left, top, width, height}, {
                    duration: AnimateConfig.duration.leave,
                    easing: 'ease-in-out'
                }).then(() => {
                    done();
                });
            }
            // 没有动画，图片渐隐
            else if (this.isReady) {
                cssAnimate(el, {
                    opacity: 0
                }, {
                    duration: AnimateConfig.duration.leave,
                    ease: 'linear'
                }).then(() => {
                    done();
                });
            }
            // 没有动画，直接关闭
            else {
                done();
            }
        },
        afterLeave(el) {
            if (!this.isCurrent) {
                return;
            }

            this.$emit('leave-end');
        },

        // 下拉退场
        swipeDown() {
            // 图片没有显示
            if (!this.isReady) {
                this.$refs.error.style.opacity = 0;
                this.$refs.loading.style.opacity = 0;
                return;
            }

            const {deltaY: y, startX: x1, startY: y1, endX: x2, endY: y2} = this.posY;

            let scale = 1;
            if (y > 0) {
                let distance = y;
                // 计算方法: 418 / (1 - 0.3) = distance / (1 - scale)
                scale = Math.max(0.3, 1 - distance * 0.7 / 418);
            }

            // 计算公式
            // (x1 - x0) / width = (x2 - (x0 + moveX)) / (width * scale)
            // (y1 - y0) / height = (y2 - (y0 + moveY)) / (height * scale)
            // moveX =  (x2 - x0) - scale * (x1 - x0)
            // moveY =  (y2 - y0) - scale * (y1 - y0)
            let moveX = (x2 - this.imgPosition.left) - scale * (x1 - this.imgPosition.left);
            let moveY = (y2 - this.imgPosition.top) - scale * (y1 - this.imgPosition.top);

            util.setCss(this.$refs.img, {
                transform: `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale}, ${scale})`
            });
        },

        // 图片加载状态
        onLoadError(imgSrc) {
            if (this.imgSrc !== imgSrc) {
                return;
            }
            this.isError = true;
            this.isLoading = false;
        },
        onLoadSuccess(imgSrc) {
            if (this.imgSrc !== imgSrc) {
                return;
            }
            this.isError = false;
            this.isLoading = false;
        },

        // 更新样式接口
        updateStyle({props}) {
            if (props) {
                this.imgStyle = Object.assign({}, this.imgStyle, props);
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
.image-viewer-img-wrapper
    position relative
    width 100%
    height 100%


.image-viewer-img
    position absolute
    -webkit-transform-origin left top
    transform-origin left top

    img
        border 0
        width 100%
        height 100%
        -webkit-user-drag none
        -webkit-user-select none
        user-select none

.hidden
    visibility hidden


.image-viewer-img-loading,
.image-viewer-img-error
    position relative
    background-color #000
    color #fff


.image-viewer-img-loading-content
    position absolute
    top 50%
    left 50%
    -webkit-transform translate(-50%, -50%)
    transform translate(-50%, -50%)


.image-viewer-img-error-content
    position absolute
    top 50%
    left 50%
    text-align center
    -webkit-transform translate(-50%, -50%)
    transform translate(-50%, -50%)

    .image-viewer-img-error-icon
        position relative
        left 50%
        width 78px
        height 60px
        -webkit-transform translate(-50%, 0)
        transform translate(-50%, 0)

    p
        margin-top 16px
        line-height 16px
        font-size 16px
        color #fff
</style>