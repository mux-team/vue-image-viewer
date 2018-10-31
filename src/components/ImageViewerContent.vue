<template>
    <div
        :style="{
            height: innerHeight ? innerHeight + 'px' : '100%'
        }"
        class="image-viewer-content-wrapper"
        @touchstart="onTouchStart($event, true)"
        @touchmove="onTouchMove($event, true)"
        @touchend="onTouchEnd($event, true)"
        @touchcancel="onTouchEnd($event, true)"
    >
        <div ref="bg" class="image-viewer-content-bg"></div>
        <div
            ref="content"
            :style="{
                transform: contentTransform,
                webkitTransform: contentTransform
            }"
            class="image-viewer-content"
        >
            <div
                v-for="(item, name) in state"
                :key="name"
                :data-name="name"
                :class="[classNames[name]]"
                class="image-viewer-item-wrapper"
            >
                <image-viewer-item
                    :store="store"
                    :obj="item"
                    :is-current="classNames[name] === 'image-viewer-item-current'"
                    :is-leaving="isLeaving"
                    :is-swiping-down="isSwipingDown"
                    :inner-width="innerWidth"
                    :inner-height="innerHeight"
                    :pos-y="posY"
                    :enter-position="enterPosition"
                    :leave-position="leavePosition"
                    :swipe-up-height="swipeUpHeight"
                    :swipe-up-y="swipeUpY"
                    :has-second-screen="hasSecondScreen"
                    :is-second-screen-show="isSecondScreenShow"
                    @enter-start="onEnterStart"
                    @enter-end="onEnterEnd"
                    @leave-start="onLeaveStart"
                    @leave-end="onLeaveEnd"
                    @zoom-tap="onZoomTap"
                    @zoom-swipe-down-start="onZoomSwipeDownStart"
                    @zoom-swipe-down-move="onZoomSwipeDownMove"
                    @zoom-swipe-down-end="onZoomSwipeDownEnd"
                    @zoom-swipe-down-cancel="onZoomSwipeDownCancel"
                    @swipe-up-end="onSwipeUpEnd"
                    @swipe-up-down="onSwipeUpDown"
                    @zoom-swipe-up-end="onZoomSwipeUpEnd"
                >
                    <template v-if="classNames[name] === 'image-viewer-item-current'" slot="anchor">
                        <slot name="anchor"></slot>
                    </template>
                    <template v-if="classNames[name] === 'image-viewer-item-current'" slot="secondScreen">
                        <slot name="secondScreen"></slot>
                    </template>
                </image-viewer-item>
            </div>
        </div>
    </div>
</template>

<script>
import util from '../common/util.js';
import AnimateConfig from '../common/animate-config.js';
import ImageViewerItem from './ImageViewerItem';
import {cssAnimate} from '../common/animate.js';

const ITEM_CLASS_PREFIX = 'image-viewer-item-';
const ITEM_BORDER_WIDTH = 20;
const LEFT_SAFE_DISTANCE = 20;
const RIGHT_SAFE_DISTANCE = 10;
const MIN_SWIPE_DISTANCE = 30;
const MIN_HORIZONAL_DISTANCE = 30;
const MIN_VERTICAL_DISTANCE = 10;
const MIN_VERTICAL_DISTANCE2 = 123;
const MIN_SWIPE_UP_DISTANCE = 10;

const IS_BAIDU_APP = util.browser.isBaidu;

export default {
    components: {
        ImageViewerItem
    },
    props: {
        state: {
            type: Object,
            default: {}
        },
        innerWidth: {
            type: Number,
            required: true
        },
        innerHeight: {
            type: Number,
            required: true
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
        store: {
            type: Object,
            default: {}
        },
        swipeUpHeight: {
            type: Number,
            default: 0
        },
        easySwipe: {
            type: Boolean,
            default: false
        },
        swipeDuration: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            startT: 0,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0,
            dir: 0,
            posY: {},
            isMoving: false,
            isAnimating: false,
            isSwipingX: null,
            isSwipingY: null,
            isSwipingUp: false,
            isSwipingDown: false,
            isSwipeFirst: false,
            isSwipeLast: false,
            isMultiTouch: false,
            classNames: {
                item1: 'image-viewer-item-prev',
                item2: 'image-viewer-item-current',
                item3: 'image-viewer-item-next'
            },
            swipeUpY: 0,
            isSecondScreenShow: false,
            scrollTop: 0,
            maxScrollTop: 0,
            contentTransform: 'none'
        }
    },
    computed: {
        maxSwipeDistance: function() {
            return this.innerWidth / 3;
        },
        hasSecondScreen: function() {
            return !!this.$slots.secondScreen;
        }
    },
    watch: {
        isSwipingDown(newVal) {
            if (newVal) {
                this.emitSwipeDownStartEvent();
            }
        },
        isSecondScreenShow(newVal) {
            if (newVal) {
                this.$emit('swipe-up-end');
            }
        },
        innerHeight(newVal) {
            // 转屏恢复到第一屏
            if (this.isSecondScreenShow) {
                this.$nextTick(() => {
                    let scrollEl = this.getItemElement('current').firstChild;
                    scrollEl.scrollTop = 0;
                    this.swipeUpY = (this.swipeUpHeight - this.innerHeight) / 2;
                });
            }
        }
    },

    methods: {
        // 对外接口：恢复位置
        resetPosition() {
            this.dir = 0;
            this.doSwitchAnimation();
        },

        // 对外接口：显示第二屏
        showSecondScreen() {
            if (!this.hasSecondScreen || this.isSecondScreenShow) {
                return false;
            }

            this.isSecondScreenShow = true;
            this.swipeUpY = -MIN_SWIPE_UP_DISTANCE;
            return true;
        },

        onTouchStart(event, fromSelf) {
            // 停止冒泡
            event.stopPropagation();

            // 防止多指操作
            if (this.isMoving) {
                event.preventDefault();
                return;
            }

            this.isSwipingX = null;
            this.isSwipingY = null;
            this.isMultiTouch = event.touches.length >= 2;

            let touch = event.touches[0];
            this.startX = touch.clientX;
            this.startY = touch.clientY;

            this.startT = (new Date()).getTime();

            let scrollEl = this.getItemElement('current').firstChild;
            this.scrollTop = scrollEl.scrollTop;
            this.maxScrollTop = scrollEl.scrollHeight - scrollEl.clientHeight;
        },
        onTouchMove(event, fromSelf) {
            // 停止冒泡
            event.stopPropagation();

            if (this.isAnimating || this.isMultiTouch) {
                event.preventDefault();
                return;
            }

            let touch = event.touches[0];
            let moveX = touch.clientX - this.startX;
            let moveY = touch.clientY - this.startY;

            // 左右滑
            if (this.isSwipingX === null) {
                this.isSwipingX = Math.abs(moveX) >= Math.abs(moveY);
            }

            // 判断zoom状态
            if (!fromSelf && !this.checkZoomStatus(moveX, moveY)) {
                event.preventDefault();
                return;
            }

            // 上下滑动
            if (this.isSwipingY === null) {
                this.isSwipingY = !this.isSwipingX;
                this.isSwipingUp = this.isSwipingY && moveY < 0;
                if (this.isSecondScreenShow) {
                    this.isSwipingUpDown = this.isSwipingY && moveY > 0;
                }
                else {
                    this.isSwipingDown = this.isSwipingY && moveY > 0;
                }
            }

            // 第二屏底部禁止上拉
            if (this.isSwipingUp && this.isSecondScreenShow
                && this.scrollTop && this.scrollTop + 1 >= this.maxScrollTop) {
                event.preventDefault();
                return;
            }

            // 解决手百划出窗口问题
            this.updateAutoTouchendTimeout(touch);
            if (IS_BAIDU_APP && this.isSwipingDown && (this.startY < 0 || this.startY > this.innerHeight)) {
                event.preventDefault();
                return;
            }

            // 左右翻页
            if (this.isSwipingX) {
                let isNearBoundary = this.startX < LEFT_SAFE_DISTANCE
                    || this.startX > window.innerWidth - RIGHT_SAFE_DISTANCE;

                // 屏幕边缘滑动问题
                if (isNearBoundary) {
                    moveX = 0;
                }
                else {
                    moveX = this.swipingX(moveX);
                }
                event.preventDefault();
            }
            // 上划
            else if (this.isSwipingUp) {
                this.maxScrollTop === 0 && event.preventDefault();
                this.swipingUp(moveY, event);
            }
            // 第二屏下划
            else if (this.isSwipingUpDown && this.scrollTop === 0) {
                // 回到第一屏
                this.swipingToFirstScreen(moveY);
                // 触发滚动后不能取消
                event.cancelable && event.preventDefault();
            }
            // 下划
            else if (this.isSwipingDown) {
                this.swipingDown(moveX, moveY, touch);
                event.preventDefault();
            }

            this.moveX = moveX;
            this.moveY = moveY;
            this.isMoving = true;
        },
        onTouchEnd(event, fromSelf) {
            // 停止冒泡
            event.stopPropagation();

            if (this.isAnimating || event.touches.length > 0) {
                event.preventDefault();
                return;
            }

            // 解决手百划出窗口问题
            this.clearAutoTouchendTimeout();
            if (IS_BAIDU_APP && this.isSwipingDown && (this.startY < 0 || this.startY > this.innerHeight)) {
                event.preventDefault();
                return;
            }

            // 左右滑动
            if (this.isSwipingX) {
                this.isAnimating = true;
                this.animateAfterSwipeX();
            }
            // 上划
            else if (this.isSwipingUp) {
                this.isAnimating = true;
                this.animateAfterSwipeUp();
            }
            // 第二屏下划
            else if (this.isSwipingUpDown && this.scrollTop === 0) {
                this.isAnimating = true;
                this.animateToFirstScreen();
            }
            // 下划
            else if (this.isSwipingDown) {
                this.isAnimating = true;
                this.animateAfterSwipeDown();
            }
            // 默认处理
            else {
                this.resetMoveData();
            }

            this.isMoving = false;
        },
        resetMoveData() {
            this.moveX = 0;
            this.moveY = 0;
            // 左右滑动
            this.dir = 0;
            this.isSwipeFirst = false;
            this.isSwipeLast = false;
            // 上下滑动
            this.posY = {};
            this.isSwipingUp = false;
            this.isSwipingUpDown = false;
            this.isSwipingDown = false;
        },
        // 左右滑动
        swipingX(moveX) {
            let prev = this.getData('prev');
            let next = this.getData('next');

            // 左翻第一张图
            if (moveX > 0 && (!prev || !prev.isSet)) {
                if (moveX > MIN_SWIPE_DISTANCE) {
                    this.isSwipeFirst = true;
                }
                moveX = Math.min(this.maxSwipeDistance, moveX * 0.3);
            }

            // 右翻最后一张图
            else if (moveX < 0 && (!next || !next.isSet)) {
                if (-moveX >= MIN_SWIPE_DISTANCE) {
                    this.isSwipeLast = true;
                    this.emitSwipeLastEvent();
                }
                moveX = -Math.min(this.maxSwipeDistance, -moveX * 0.3);
            }

            if (moveX < 0) {
                this.dir = 1;
            }
            else if (moveX > 0) {
                this.dir = -1;
            }

            // 左翻
            if (moveX > 0) {
                this.emitHideToastEvent();
            }

            // 直接改样式快一点
            let props = {
                transform: `translate3d(${moveX}px, 0, 0)`
            };
            util.modifyTransformProperty(props);
            this.contentTransform = props.transform;

            return moveX;
        },
        animateAfterSwipeX() {
            if (this.isSwipeFirst) {
                this.emitSwipeFirstEvent();
                return;
            }

            let timeDiff = (new Date()).getTime() - this.startT;
            let distance = Math.abs(this.moveX);

            if (this.isSwipeLast) {
                this.dir = 0;
            }
            else if ((timeDiff <= 380 || this.easySwipe) && distance > MIN_HORIZONAL_DISTANCE) {
                if (this.moveX > 0) {
                    this.dir = -1;
                }
                else {
                    this.dir = 1;
                }
            }
            else if (timeDiff > 380 && distance > (this.innerWidth + ITEM_BORDER_WIDTH) / 2) {
                if (this.moveX > 0) {
                    this.dir = -1;
                }
                else {
                    this.dir = 1;
                }
            }
            else {
                this.dir = 0;
            }

            this.doSwitchAnimation();
        },
        doSwitchAnimation() {
            let endPos = -this.dir * (window.innerWidth + ITEM_BORDER_WIDTH);
            let animateDuration = this.swipeDuration > 0 ? this.swipeDuration : AnimateConfig.duration.swipe;
            cssAnimate(this.$refs.content, {
                transform: 'translate3d(' + endPos + 'px, 0, 0)'
            }, {
                duration: animateDuration,
                ease: AnimateConfig.transition['ease-out']
            }).then(() => {
                this.updateItemStyle();
                this.resetMoveData();
                this.isAnimating = false;
            });
        },
        updateItemStyle() {
            if (this.dir === 0) {
                return;
            }

            let dir = this.dir;
            let prev    = this.getItemName('prev');
            let current = this.getItemName('current');
            let next    = this.getItemName('next');
            let itemMap = {};

            // 翻到下一张
            if (this.dir === 1) {
                this.classNames[prev] = `${ITEM_CLASS_PREFIX}next`;
                this.classNames[current] = `${ITEM_CLASS_PREFIX}prev`;
                this.classNames[next] = `${ITEM_CLASS_PREFIX}current`;
                itemMap.prev = current;
                itemMap.current = next;
                itemMap.next = prev;
            }

            // 翻到上一张
            else {
                this.classNames[prev] = `${ITEM_CLASS_PREFIX}current`;
                this.classNames[current] = `${ITEM_CLASS_PREFIX}next`;
                this.classNames[next] = `${ITEM_CLASS_PREFIX}prev`;
                itemMap.prev = next;
                itemMap.current = prev;
                itemMap.next = current;
            }

            // 翻页后重置第二屏
            this.swipeUpY = 0;
            this.isSecondScreenShow = false;

            // 需要先恢复样式
            this.contentTransform = 'none';

            // 发出翻页事件
            this.$emit('swipe-x', {
                dir: dir,
                name: dir === 1 ? prev : next,
                itemMap
            });
        },
        getItemName(key) {
            let el = this.getItemElement(key);
            return el.getAttribute('data-name');
        },
        getData(key) {
            let name = this.getItemName(key);
            return name ? this.state[name] : null;
        },
        getItemElement(key) {
            let el = this.$el.querySelector('.' + ITEM_CLASS_PREFIX + key);
            return el;
        },
        // 下划操作
        swipingDown(disX, disY, touch) {
            this.posY = {
                startX: this.startX,
                startY: this.startY,
                endX: touch.clientX,
                endY: touch.clientY,
                deltaX: disX || 0,
                deltaY: disY || 0
            };

            if (Math.abs(disY) > 0) {
                this.emitHideToastEvent();
            }

            // 更新背景透明度
            let opacity = 1;
            if (disY > 0) {
                // 计算方法: 418 / (100% - 1%) = distance / (1 - opacity)
                opacity = Math.max(0.01, (100 - disY * 99 / 418) / 100);
            }
            this.$refs.bg.style.opacity = opacity;
        },
        animateAfterSwipeDown() {
            let timeDiff = (new Date()).getTime() - this.startT;

            // 退场
            if (timeDiff <= 380 && this.moveY >= MIN_VERTICAL_DISTANCE
                || timeDiff > 380 && this.moveY >= MIN_VERTICAL_DISTANCE2) {
                this.$emit('swipe-down-end');
            }
            // 恢复大图
            else {
                this.isSwipingDown = false;

                // 背景色渐显
                cssAnimate(this.$refs.bg, {
                    opacity: 1
                }, {
                    duration: AnimateConfig.duration.swipeDownCancel,
                    ease: 'linear'
                }).then(() => {
                    this.resetMoveData();
                    this.isAnimating = false;
                });

                this.$emit('swipe-down-cancel');
            }
        },
        // 上划第二屏
        swipingUp(moveY, event) {
            if (!this.hasSecondScreen) {
                event.preventDefault();
                return;
            }

            if (!this.isSecondScreenShow) {
                if (this.store.get('zoom.isZoomed') && moveY < -MIN_SWIPE_UP_DISTANCE) {
                    this.onZoomSwipeUpEnd();
                    return;
                }

                if (moveY < -MIN_SWIPE_UP_DISTANCE) {
                    const maxDelta = (this.innerHeight - this.swipeUpHeight) / 2;
                    this.swipeUpY = Math.max(-maxDelta, moveY);
                }
                else {
                    this.swipeUpY = 0;
                }
                this.$emit('swipe-up-move', -this.swipeUpY * 2);
                event.preventDefault();
            }
            else if (moveY >= -5) {
                this.swipingToFirstScreen(moveY);
            }
        },
        animateAfterSwipeUp() {
            if (!this.hasSecondScreen) {
                this.resetMoveData();
                this.isAnimating = false;
                return;
            }

            if (!this.isSecondScreenShow) {
                if (this.moveY < -MIN_SWIPE_UP_DISTANCE) {
                    this.isSecondScreenShow = true;
                }
                else {
                    this.swipeUpY = 0;
                    this.resetMoveData();
                    this.isAnimating = false;
                }
            }
            else if (this.moveY >= this.scrollTop + MIN_SWIPE_UP_DISTANCE) {
                this.animateToFirstScreen();
            }
            else {
                this.resetMoveData();
                this.isAnimating = false;
            }
        },
        // 下划回到第一屏
        swipingToFirstScreen(moveY) {
            moveY = moveY > MIN_SWIPE_UP_DISTANCE ? moveY : 0;
            this.swipeUpY = (this.swipeUpHeight + moveY - this.innerHeight) / 2;
        },
        animateToFirstScreen() {
            if (this.moveY > MIN_SWIPE_UP_DISTANCE) {
                this.swipingUpDown();
            }
            else {
                this.resetMoveData();
                this.isAnimating = false;
            }
        },
        swipingUpDown() {
            this.isSecondScreenShow = false;
        },
        onSwipeUpDown() {
            this.resetMoveData();
            this.isAnimating = false;
            this.swipeUpY = 0;
            this.$emit('swipe-up-down');
        },
        onSwipeUpEnd() {
            this.resetMoveData();
            this.isAnimating = false;
        },

        // 自动触发touchend
        updateAutoTouchendTimeout(touch) {
            if (!IS_BAIDU_APP) {
                return;
            }

            this.clearAutoTouchendTimeout();

            const {clientX: x, clientY: y} = touch;
            // 划出窗口
            if (this.isSwipingDown && (y < 5 || y > this.innerHeight - 5)
                || this.isSwipingX && (x >= this.innerWidth - 10 || x < 10)) {
                this.touchEndTimeout = setTimeout(() => {
                    let fakeEvent = {
                        touches: [],
                        targetTouches: [],
                        changedTouches: [],
                        preventDefault: util.noop,
                        stopPropagation: util.noop
                    };
                    this.onTouchEnd(fakeEvent);
                    // 手百还在touchmove阶段
                    this.startX = x;
                    this.startY = y;
                }, 380);
            }
        },
        clearAutoTouchendTimeout() {
            if (!IS_BAIDU_APP || !this.touchEndTimeout) {
                return;
            }

            clearTimeout(this.touchEndTimeout);
            this.touchEndTimeout = null;
        },

        // 进场
        onEnterStart(data) {
            this.$emit('enter-start', data);

            // 当前还没有mount
            this.$nextTick(() => {
                this.$refs.bg.style.opacity = 1;
            });
        },
        onEnterEnd(data) {
            this.$emit('enter-end', data);
        },
        // 退场
        onLeaveStart(data) {
            // 直接更新样式
            util.setCss(this.$refs.content, {
                transform: 'none'
            });

            // 背景色渐隐
            cssAnimate(this.$refs.bg, {
                opacity: 0
            }, {
                duration: AnimateConfig.duration.leave,
                ease: 'linear',
                delay: AnimateConfig.delay.leave
            });

            this.$emit('leave-start', data);
        },
        onLeaveEnd(data) {
            this.$emit('leave-end', data);
            this.resetMoveData();
            this.isAnimating = false;
        },
        // 事件传递
        emitSwipeFirstEvent() {
            this.$emit('swipe-first');
        },
        emitSwipeLastEvent() {
            if (this.swipeLastTimeout) {
                return;
            }

            this.$emit('swipe-last');
            this.swipeLastTimeout = setTimeout(() => {
                this.swipeLastTimeout = null;
            }, 200);
        },
        emitHideToastEvent(msg) {
            if (this.hideToastTimeout) {
                return;
            }

            this.$emit('hide-toast', msg);
            this.hideToastTimeout = setTimeout(() => {
                this.hideToastTimeout = null;
            }, 200);
        },
        emitSwipeDownStartEvent() {
            this.$emit('swipe-down-start');
        },
        // zoom
        onZoomTap(data) {
            if (this.isSecondScreenShow) {
                this.swipingUpDown();
            }
            else {
                this.$emit('tap');
            }
        },
        onZoomSwipeDownStart() {
            this.$emit('swipe-down-start');
        },
        onZoomSwipeDownMove({y}) {
            // 更新背景透明度
            let opacity = 1;
            if (y > 0) {
                // 计算方法: 418 / (100% - 1%) = distance / (1 - opacity)
                opacity = Math.max(0.01, (100 - y * 99 / 418) / 100);
            }
            this.$refs.bg.style.opacity = opacity;
        },
        onZoomSwipeDownEnd() {
            this.$emit('swipe-down-end');
        },
        onZoomSwipeDownCancel() {
            // 背景色渐显
            cssAnimate(this.$refs.bg, {
                opacity: 1
            }, {
                duration: AnimateConfig.duration.swipeDownCancel,
                ease: 'linear'
            });

            this.$emit('swipe-down-cancel');
        },
        onZoomSwipeUpEnd() {
            if (!this.hasSecondScreen) {
                return;
            }

            this.isSecondScreenShow = true;
            this.swipeUpY = -MIN_SWIPE_UP_DISTANCE;
        },
        checkZoomStatus(moveX, moveY) {
            if (this.store.get('zoom.needCancelMove')
                // 右滑
                || this.isSwipingX && moveX > 0 && !this.store.get('zoom.nearLeftBoundary')
                // 左滑
                || this.isSwipingX && moveX < 0 && !this.store.get('zoom.nearRightBoundary')
                // 下滑
                || !this.isSwipingX && moveY > 0
                // 上滑
                || !this.isSwipingX && moveY < 0 && !this.store.get('zoom.nearBottomBoundary')) {
                return false;
            }

            return true;
        }
    }
};
</script>


<style lang="stylus" scoped>
.image-viewer-content-wrapper
    position relative
    width 100%
    height 100%


    .image-viewer-content
        position relative
        height 100%


    .image-viewer-content-bg
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        background-color #000
        opacity 0


.image-viewer-item-wrapper
    position absolute
    width 100%
    height 100%

    &.image-viewer-item-prev
        right 100%
        border-right 20px solid rgba(0, 0, 0, 0)


    &.image-viewer-item-next
        left 100%
        border-left 20px solid rgba(0, 0, 0, 0)
</style>