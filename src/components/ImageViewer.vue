<template>
    <div
        class="image-viewer"
        :class="{
            'no-info': hideInfo,
            'no-toolbar': hideToolbar,
            'horizonal': innerHeight < innerWidth,
            'black-bg': isShowBg
        }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @click="onClick"
    >
        <!-- 图片区 -->
        <image-viewer-content
            ref="content"
            :store="store"
            :state="state"
            :is-leaving="isLeaving"
            :enter-position="enterPosition"
            :leave-position="leavePosition"
            :inner-width="innerWidth"
            :inner-height="innerHeight"
            :swipe-up-height="swipeUpHeight"
            :easy-swipe="easySwipe"
            :swipe-duration="swipeDuration"
            @enter-start="onEnterStart"
            @enter-end="onEnterEnd"
            @leave-start="onLeaveStart"
            @leave-end="onLeaveEnd"
            @tap="onTap"
            @hide-toast="onHideToast"
            @swipe-x="onSwipeX"
            @swipe-first="onSwipeFirst"
            @swipe-last="onSwipeLast"
            @swipe-down-start="onSwipeDownStart"
            @swipe-down-end="onSwipeDownEnd"
            @swipe-down-cancel="onSwipeDownCancel"
            @swipe-up-move="onSwipeUpMove"
            @swipe-up-end="onSwipeUpEnd"
            @swipe-up-down="onSwipeUpDown"
        >
            <template slot="anchor">
                <!-- 锚点 -->
                <slot name="anchor"></slot>
            </template>
            <template slot="secondScreen">
                <!-- 第二屏 -->
                <slot name="secondScreen"></slot>
            </template>
        </image-viewer-content>

        <!-- 顶部区 -->
        <div ref="top" class="image-viewer-top">
            <image-viewer-close
                :closeIconURL="closeIconURL"
                :closeIconSize="closeIconSize"
                ref="close"
                @click="onCloseClick"
            />
        </div>

        <!-- 底部区 -->
        <div ref="bottom" class="image-viewer-bottom">
            <!-- 信息区 -->
            <div
                v-if="!hideInfo"
                ref="info"
                class="image-viewer-info-wrapper"
            >
                <slot name="info">
                    <image-viewer-info
                        v-if="currentData"
                        :is-visible="!isImmersive"
                        :obj="currentData"
                        :count="count"
                        :inner-width="innerWidth"
                        :inner-height="innerHeight"
                    />
                </slot>
            </div>
            <!-- 功能区 -->
            <div
                v-if="!hideToolbar"
                ref="toolbar"
                class="image-viewer-toolbar-wrapper"
            >
                <div class="image-viewer-toolbar-bg"></div>
                <slot name="toolbar"></slot>
            </div>
        </div>

        <!-- 沉浸态的功能区 -->
        <div
            v-if="!hidePageNum"
            ref="immersiveToolbar"
            class="immersive-toolbar"
        >
            <div class="page-num">{{pn + 1}}/{{count}}</div>
        </div>

        <!-- 提示 -->
        <toast
            :state="toast.state"
            :content="toast.msg"
            :duration="1500"
            auto-close
            @change="onToastChange"
        />
    </div>
</template>

<script>
import fastclick from 'fastclick';
import ImageViewerContent from './ImageViewerContent';
import ImageViewerClose from './ImageViewerClose';
import ImageViewerInfo from './ImageViewerInfo';
import Toast from './Toast';
import AnimateConfig from '../common/animate-config.js';
import {cssAnimate} from '../common/animate.js';
import util from '../common/util.js';
import Store from '../common/store.js';
import Link from '../common/link.js';

export default {
    components: {
        ImageViewerContent,
        ImageViewerClose,
        ImageViewerInfo,
        Toast
    },
    props: {
        list: {
            type: Array,
            required: true
        },
        total: {
            type: Number,
            default: 0
        },
        startIndex: {
            type: Number,
            default: 0
        },
        setIndex: {
            type: Number,
            default: 0
        },
        hideInfo: {
            type: Boolean,
            default: false
        },
        hideToolbar: {
            type: Boolean,
            default: false
        },
        hidePageNum: {
            type: Boolean,
            default: false
        },
        isSwipeFirstLeave: {
            type: Boolean,
            default: false
        },
        easySwipe: {
            type: Boolean,
            default: false
        },
        swipeDuration: {
            type: Number,
            default: 0
        },
        closeIconURL: {
            type: String
        },
        closeIconSize: {
            type: Number
        }
    },
    data() {
        return {
            pn: this.startIndex,
            spn: this.setIndex,
            count: this.total,
            state: {},
            currentData: null,
            prevData: null,
            nextData: null,
            itemMap: null,
            isLeaving: false,
            isImmersive: false, // 沉浸态
            isEventStart: false,
            enterPosition: {},
            leavePosition: {},
            toast: {
                state: false,
                msg: ''
            },
            store: {},
            link: {},
            innerWidth: 0,
            innerHeight: 0,
            resizeTimer: 0,
            bottomTimer: 0,
            leaveType: '',
            isShowBg: true
        }
    },
    computed: {
        swipeUpHeight: function () {
            return this.innerHeight > this.innerWidth ? 138 : 200;
        }
    },
    beforeMount() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.store = Store.create();
        this.link = Link.create(this.list);
        this.state = this.getInitialState();
        this.emitEnterStartEvent();
    },
    mounted() {
        fastclick.attach(document.body);
        this.initEvent();
    },
    activated() {
        this.initEvent();
    },
    deactivated() {
        this.dispose();
    },
    beforeDestroy() {
        this.store.destroy();
        this.link.destroy();
        this.dispose();
    },
    watch: {
        // 沉浸态切换
        isImmersive(newVal) {
            if (newVal) {
                this.enterImmersive();
            }
            else {
                this.exitImmersive();
            }

            this.$emit('imgclick', {
                status: newVal,
                index: this.pn,
                setIndex: this.spn,
                data: this.currentData
            });
        }
    },

    methods: {
        // 对外接口
        showSecondScreen() {
            return this.$refs.content.showSecondScreen();
        },
        updateSetInfo(index, setInfo) {
            if (typeof index !== 'number' || !setInfo) {
                return false;
            }

            const ret = this.link.updateSetInfo(index, setInfo);

            // 更新当前index的图集
            if (ret && this.pn === index && this.spn === 0) {
                this.nextData = this.link.getNext(this.currentData);
                this.state[this.itemMap.next] = {
                    isSet: !!this.nextData,
                    item: this.nextData
                };
            }
            // 更新前一个index的图集
            else if (ret && this.pn - 1 === index && this.spn === 0) {
                this.prevData = this.link.getPrev(this.currentData);
                this.state[this.itemMap.prev] = {
                    isSet: !!this.prevData,
                    item: this.prevData
                };
            }

            return ret;
        },
        append(list) {
            const ret = this.link.append(list);

            if (ret) {
                if (!this.state[this.itemMap.next].isSet) {
                    this.nextData = this.link.getNext(this.currentData);
                    this.state[this.itemMap.next] = {
                        isSet: !!this.nextData,
                        item: this.nextData
                    };
                }

                this.count = Math.max(this.count, this.link.count());
            }

            return ret;
        },
        updateList(startIndex, list) {
            if (typeof startIndex !== 'number' || startIndex >= this.count || !list || !list.length) {
                return false;
            }

            if (startIndex + list.length > this.pn) {
                list = list.slice(0, this.pn - startIndex);
            }

            const ret = this.link.updateList(startIndex, list);

            if (ret && startIndex + list.length === this.pn && this.prevData === null) {
                this.prevData = this.link.getPrev(this.currentData);
                this.state[this.itemMap.prev] = {
                    isSet: !!this.prevData,
                    item: this.prevData
                };
            }

            return ret;
        },
        updateItem(index, setIndex, data) {
            return this.link.updateItem(index, setIndex, data);
        },
        close() {
            if (this.isLeaving) {
                return false;
            }

            this.emitLeaveStartEvent({
                type: 'close'
            });
            return true;
        },

        initEvent() {
            if (this.isEventStart) {
                return;
            }
            this.isEventStart = true;
            window.addEventListener('resize', this.onResize, false);
            window.addEventListener('orientationchange', this.onResize, false);
        },
        onResize() {
            if (this.innerHeight === window.innerHeight) {
                return;
            }
            this.resizeTimer && clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.innerWidth = window.innerWidth;
                this.innerHeight = window.innerHeight;
                this.resizeTimer = 0;
            }, 50);
        },
        dispose() {
            this.resizeTimer && clearTimeout(this.resizeTimer);
            this.bottomTimer && clearTimeout(this.bottomTimer);
            this.isEventStart = false;
            window.removeEventListener('resize', this.onResize, false);
            window.removeEventListener('orientationchange', this.onResize, false);
        },

        // 数据相关
        getInitialState() {
            let current = this.link.get(this.pn, this.spn);
            let prev = this.link.getPrev(current);
            let next = this.link.getNext(current);
            let state = {
                item1: {
                    isSet: !!prev,
                    item: prev
                },
                item2: {
                    isSet: !!current,
                    item: current
                },
                item3: {
                    isSet: !!next,
                    item: next
                }
            };

            this.prevData = prev;
            this.currentData = current;
            this.nextData = next;
            this.itemMap = {
                prev: 'item1',
                current: 'item2',
                next: 'item3'
            };
            this.count = Math.max(this.count, this.link.count());

            return state;
        },
        updateState(data) {
            let itemName = data.name;
            let itemData;
            if (data.dir > 0) {
                itemData = this.link.getNext(this.nextData);
            }
            else {
                itemData = this.link.getPrev(this.prevData);
            }

            // 更新其中一个item
            this.state[itemName] = {
                isSet: !!itemData,
                item: itemData
            };

            this.prevData = this.state[data.itemMap.prev].item;
            this.currentData = this.state[data.itemMap.current].item;
            this.nextData = this.state[data.itemMap.next].item;
            this.itemMap = data.itemMap;

            this.onSwitch(data.dir);
        },

        // 翻页相关
        onSwipeX(data) {
            // 更新state
            this.updateState(data);
        },
        onSwipeFirst(obj) {
            // 退场
            if (this.isSwipeFirstLeave) {
                this.emitLeaveStartEvent({
                    type: 'swipe-first'
                });
            }
            // 恢复位置
            else {
                this.$refs.content.resetPosition();
                this.$emit('swipefirst');
            }
        },
        onSwipeLast() {
            this.toast = {
                state: true,
                msg: '已是最后一张'
            };
        },
        onSwitch(dir) {
            // 更新pn
            this.pn = this.currentData.index;
            this.spn = this.currentData.setIndex;
            this.emitSwitchEvent(dir);

            if (this.isImmersive) {
                this.$nextTick(() => {
                    // 先显示才能计算高度
                    util.setCss(this.$refs.bottom, {
                        display: ''
                    });

                    this.bottomTimer = setTimeout(() => {
                        // 重新计算bottom高度
                        let bottomHeight = 0;
                        if (!this.hideInfo) {
                            bottomHeight += this.$refs.info.getBoundingClientRect().height;
                        }
                        if (!this.hideToolbar) {
                            bottomHeight += this.$refs.toolbar.getBoundingClientRect().height;
                        }

                        util.setCss(this.$refs.bottom, {
                            display: 'none',
                            transform: `translate3d(0, ${bottomHeight}px, 0)`
                        });
                    }, 10);
                });
            }
        },
        emitSwitchEvent(dir = 0) {
            // 翻页事件，传递当前图片信息
            // TODO data考虑复制一份
            this.$emit('switch', {
                dir,
                index: this.pn,
                setIndex: this.spn,
                data: this.currentData,
                prevData: this.prevData,
                nextData: this.nextData
            });
        },

        // 进场相关
        onEnterStart(data) {
            // 当前还没有mount
            this.$nextTick(() => {
                this.changeOpacity(1, {
                    duration: AnimateConfig.duration.enter
                });
            });
        },
        onEnterEnd(data) {
            this.$emit('enter', {
                index: this.pn,
                setIndex: this.spn,
                data: this.currentData,
                prevData: this.prevData,
                nextData: this.nextData
            });
        },
        emitEnterStartEvent() {
            // 通过钩子获取进场动画参数
            this.$emit('enterstart', {
                index: this.pn,
                setIndex: this.spn
            }, el => {
                if (el && el.getBoundingClientRect) {
                    const {left, top, width, height} = el.getBoundingClientRect();
                    this.enterPosition = {
                        left,
                        top,
                        width,
                        height
                    };
                }
            });
        },

        // 退场相关
        onCloseClick(event) {
            event.stopPropagation();
            this.hideToast();
            this.emitLeaveStartEvent({
                type: 'close-button'
            });
        },
        onLeaveStart(data) {
            this.changeOpacity(0, {
                duration: AnimateConfig.duration.leave
            });
        },
        onLeaveEnd(data) {
            this.$emit('leave', {
                index: this.pn,
                setIndex: this.spn,
                type: this.leaveType
            });
        },
        emitLeaveStartEvent(opt) {
            opt = Object.assign({
                index: this.pn,
                setIndex: this.spn
            }, opt);

            // 通过钩子获取退场动画参数
            this.$emit('leavestart', opt, elOrRect => {
                let rect = null;

                if (elOrRect && elOrRect.getBoundingClientRect) {
                    rect = elOrRect.getBoundingClientRect();
                }
                else if (elOrRect && elOrRect.width) {
                    rect = elOrRect;
                }

                if (rect) {
                    const {left = 0, top = 0, width, height} = rect;

                    this.leavePosition = {
                        left,
                        top,
                        width,
                        height
                    };
                }
            });

            this.isShowBg = false;
            this.isLeaving = true;
            this.leaveType = opt.type || 'close';
        },

        // 滑动相关
        onTouchStart(event) {
            this.$refs.content.onTouchStart(event);
            this.hideToast();
        },
        onTouchMove(event) {
            this.$refs.content.onTouchMove(event);
        },
        onTouchEnd(event) {
            this.$refs.content.onTouchEnd(event);
        },

        // toast相关
        onHideToast() {
            // 清除toast
            this.hideToast();
        },
        onClick() {
            // 清除toast
            this.hideToast();
        },
        onToastChange(val) {
            if (val !== this.toast.state) {
                this.toast.state = val;
            }
        },
        hideToast() {
            this.toast.state = false;
        },

        // 下拉退场相关
        onSwipeDownStart() {
            this.isShowBg = false;

            // 动画降级
            this.changeOpacity(0, {
                duration: util.animationDowngrade ? 0 : AnimateConfig.duration.swipeDownStart
            });
        },
        onSwipeDownEnd() {
            this.emitLeaveStartEvent({
                type: 'swipe-down'
            });
        },
        onSwipeDownCancel() {
            this.isShowBg = true;

            // 动画降级
            this.changeOpacity(1, {
                duration: util.animationDowngrade ? 0 : AnimateConfig.duration.swipeDownCancel
            });
        },
        changeOpacity(opacity, options = {}) {
            let elements = [
                this.$refs.top,
                this.$refs.bottom
            ];

            if (!options.duration) {
                elements.forEach(el => {
                    util.setCss(el, {
                        opacity
                    });
                });
            }
            else {
                elements.forEach(el => {
                    cssAnimate(el, {
                        opacity
                    }, {
                        duration: options.duration,
                        ease: 'linear'
                    });
                });
            }
        },

        // 上拉
        onSwipeUpMove(moveY) {
            // 非沉浸态
            if (!this.isImmersive) {
                util.setCss(this.$refs.bottom, {
                    bottom: moveY + 'px',
                    opacity: moveY > 20 ? 0.001 : 1
                });
            }

            // 沉浸态页码
            else if (!this.hidePageNum) {
                util.setCss(this.$refs.immersiveToolbar, {
                    bottom: moveY + 'px',
                    opacity: moveY > 20 ? 0.001 : 1
                });
            }
        },
        onSwipeUpEnd() {
            // 非沉浸态
            if (!this.isImmersive) {
                util.setCss(this.$refs.bottom, {
                    opacity: 1,
                    display: 'none',
                    bottom: window.innerHeight - this.swipeUpHeight + 'px'
                });
            }

            // 沉浸态页码
            else if (!this.hidePageNum) {
                util.setCss(this.$refs.immersiveToolbar, {
                    opacity: 1,
                    display: 'none',
                    bottom: window.innerHeight - this.swipeUpHeight + 'px'
                });
            }

            // 发送第二屏显示事件
            this.$emit('secondscreenshow', {
                index: this.pn,
                setIndex: this.spn,
                data: this.currentData
            });
        },
        onSwipeUpDown() {
            // 非沉浸态
            if (!this.isImmersive) {
                util.setCss(this.$refs.bottom, {
                    display: '',
                    bottom: ''
                });
            }

            // 沉浸态页码
            else if (!this.hidePageNum) {
                util.setCss(this.$refs.immersiveToolbar, {
                    display: '',
                    bottom: ''
                });
            }

            // 发送第二屏隐藏事件
            this.$emit('secondscreenhide', {
                index: this.pn,
                setIndex: this.spn,
                data: this.currentData
            });
        },

        // 沉浸态
        enterImmersive() {
            let topHeight = this.$refs.close.getHeight();
            let bottomHeight = 0;
            if (!this.hideInfo) {
                bottomHeight += this.$refs.info.getBoundingClientRect().height;
            }
            if (!this.hideToolbar) {
                bottomHeight += this.$refs.toolbar.getBoundingClientRect().height;
            }

            // top上移隐藏
            cssAnimate(this.$refs.top, {
                transform: `translate3d(0, ${-topHeight}px, 0)`
            }, {
                duration: AnimateConfig.duration.hideTop,
                ease: AnimateConfig.transition['ease-in-out3']
            }).then(() => {
                // 防止翻页时露出
                this.$nextTick(() => {
                    util.setCss(this.$refs.top, {
                        opacity: 0,
                        display: 'none'
                    });
                });
            });

            // bottom下移隐藏
            cssAnimate(this.$refs.bottom, {
                transform: `translate3d(0, ${bottomHeight}px, 0)`
            }, {
                duration: AnimateConfig.duration.hideBottom,
                ease: AnimateConfig.transition['ease-in-out4']
            }).then(() => {
                // 防止翻页时露出
                this.$nextTick(() => {
                    util.setCss(this.$refs.bottom, {
                        opacity: 0,
                        display: 'none'
                    });
                });
            });

            // 沉浸态页码
            if (!this.hidePageNum) {
                cssAnimate(this.$refs.immersiveToolbar, {
                    opacity: 1
                }, {
                    duration: 200,
                    ease: 'linear',
                    delay: AnimateConfig.duration.hideBottom
                });
                util.setCss(this.$refs.immersiveToolbar, {
                    display: '',
                    bottom: ''
                });
            }
        },
        exitImmersive() {
            // 先恢复显示
            util.setCss(this.$refs.top, {
                opacity: 1,
                display: ''
            });
            util.setCss(this.$refs.bottom, {
                opacity: 1,
                display: ''
            });

            // top下移显示
            cssAnimate(this.$refs.top, {
                transform: 'none'
            }, {
                duration: AnimateConfig.duration.showTop,
                ease: AnimateConfig.transition['ease-in-out3']
            });

            // bottom上移显示
            cssAnimate(this.$refs.bottom, {
                transform: 'none'
            }, {
                duration: AnimateConfig.duration.showBottom,
                ease: AnimateConfig.transition['ease-in-out4']
            });

            // 沉浸态页码
            if (!this.hidePageNum) {
                cssAnimate(this.$refs.immersiveToolbar, {
                    opacity: 0
                }, {
                    duration: 200,
                    ease: 'linear'
                });
                util.setCss(this.$refs.immersiveToolbar, {
                    display: '',
                    bottom: ''
                });
            }
        },
        onTap(data) {
            this.isImmersive = !this.isImmersive;
        }
    }
};
</script>

<style lang="stylus" scoped>
.image-viewer
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 9999
    -webkit-tap-highlight-color rgba(0, 0, 0, 0)
    outline 0

.image-viewer-top
    position absolute
    top 0
    left 0
    width 100%
    height 0
    opacity 0
    z-index 2


.image-viewer-bottom
    position absolute
    bottom 0
    left 0
    width 100%
    height 0
    opacity 0
    z-index 2


.image-viewer-toolbar-wrapper
    position absolute
    bottom 0
    left 0
    width 100%
    height 40px
    color #fff
    z-index 6
    border-top 1px solid rgba(255, 255, 255, .2)
    overflow hidden


.image-viewer-toolbar-bg
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .6)


.image-viewer-info-wrapper
    position absolute
    bottom 40px
    left 0
    width 100%
    color #fff
    z-index 6
    background-color rgba(0, 0, 0, .6)


.no-info
    .image-viewer-toolbar-wrapper
        border-top none
        height 70px


    .image-viewer-toolbar-bg
        background -webkit-gradient(linear, center top, center bottom,
            color-stop(0%, rgba(0, 0, 0, 0)), color-stop(100%, rgba(0, 0, 0, .25)))



.no-toolbar
    .image-viewer-info-wrapper
        bottom 0



.horizonal
    .image-viewer-info-wrapper
        bottom 41px

    &.no-toolbar
        .image-viewer-info-wrapper
            bottom 0


.black-bg
    background-color #000


.immersive-toolbar
    position absolute
    bottom 0
    left 0
    width 100%
    height 70px
    background -webkit-gradient(linear, center top, center bottom,
        color-stop(0%, rgba(0, 0, 0, 0)), color-stop(100%, rgba(0, 0, 0, .25)))
    opacity 0

    .page-num
        position absolute
        left 17px
        bottom 15px
        font-size 14px
        line-height 24px
        color #fff
</style>