<template>
    <div class="image-viewer-zoom">
        <slot></slot>
    </div>
</template>

<script>
import TouchHelper from '../common/touch-helper.js';
import AnimateConfig from '../common/animate-config.js';
import {scaleImage, cssAnimate} from '../common/animate.js';
import util from '../common/util.js';

const EventType = TouchHelper.EventType;
const SWIPE_DOWN_DISTANCE = 123;

export default {
    props: {
        isReady: {
            type: Boolean,
            default: false
        },
        isCurrent: {
            type: Boolean,
            default: false
        },
        innerWidth: {
            type: Number,
            required: true
        },
        innerHeight: {
            type: Number,
            required: true
        },
        target: {
            type: Object,
            required: true
        },
        store: {
            type: Object,
            default: {}
        },
        hasSecondScreen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isZoomed: false,
            isAnimating: false,
            isSwipingHorizonal: false,
            isSwipingDown: false,
            isSwipingUp: false,
            isLongImage: false,
            isNearBoundary: false,
            maxScale: 3,
            minScale: 0.5,
            fixedScale: 2,
            lastScale: 1,
            scale: 1,
            targetBounding: {},
            targetTransform: {}
        }
    },
    computed: {
        needCancelMove: function () {
            return this.isAnimating || this.isNearBoundary === false && this.isZoomed;
        }
    },
    mounted() {
        this.helper = TouchHelper.create(this.$el);

        // 单击
        this.helper.on(EventType.TAP, touchEvent => {
            this.onTap(touchEvent);
        });

        // 双击
        this.helper.on(EventType.DOUBLE_TAP, touchEvent => {
            this.onDoubleTap(touchEvent);
        });

        // 滑动
        this.helper.on(EventType.MOVE, touchEvent => {
            if (touchEvent.isFinished) {
                this.onMoveEnd(touchEvent);
            }
            else {
                this.onMove(touchEvent);
            }
        });

        // pinch手势
        this.helper.on(EventType.PINCH, touchEvent => {
            if (touchEvent.isFinished) {
                this.onPinchEnd(touchEvent);
            }
            else {
                this.onPinch(touchEvent);
            }
        });
    },
    beforeDestroy() {
        this.helper.destroy();
    },
    watch: {
        isZoomed(newval) {
            this.store.set('zoom.isZoomed', this.isZoomed);
            this.$emit('zoom-change', newval);
        },
        isAnimating(newval) {
            if (newval) {
                // 动画过程中暂停事件响应
                this.helper.pause();
            }
            else {
                // 动画之后恢复事件响应
                this.helper.resume();
            }
        },
        isSwipingDown(newval) {
            if (newval) {
                this.$emit('zoom-swipe-down-start');
            }
        },
        isCurrent(newval) {
            if (newval) {
                this.store.set('zoom.isZoomed', this.isZoomed);
                this.store.set('zoom.needCancelMove', this.needCancelMove);
                this.updateBoundaryStatus();
            }
        },
        target(newval) {
            const {left, top, width, height} = newval.position;

            this.scale = 1;
            this.lastScale = 1;
            this.isZoomed = false;
            this.isLongImage = !!newval.isLongImage;

            // 更新scale参数
            if (width < height) {
                this.maxScale = this.innerWidth * 6 / width;
                this.fixedScale = this.innerWidth * 3.5 / width;
            }
            else {
                this.maxScale = this.innerHeight * 3.5 / height;
                this.fixedScale = this.innerHeight * 2 / height;
            }

            // 记录target位置
            this.targetBounding = {
                left,
                top,
                width,
                height,
                right: left + width,
                bottom: top + height
            };

            // 记录target transform状态
            this.targetTransform = {
                origin: false,
                translate: {
                    x: 0,
                    y: 0
                }
            };
        },
        targetBounding(newval) {
            if (this.isCurrent) {
                this.updateBoundaryStatus();
            }
        },
        needCancelMove(newval) {
            if (this.isCurrent) {
                this.store.set('zoom.needCancelMove', newval);
            }
        }
    },
    methods: {
        onMove(touchEvent) {
            if (!this.isZoomed && !this.isLongImage) {
                return;
            }

            let {x, y} = touchEvent.delta;
            let {x: firstX, y: firstY} = touchEvent.delta.first;
            let {left, right, top, bottom, width, height} = this.targetBounding;

            // 翻页
            if ((left > -2 && firstX > 0 || right < this.innerWidth + 2 && firstX < 0)
                && this.isHorizonalSwipe(firstX, firstY)) {
                this.isSwipingHorizonal = true;

                // 禁止反向滑动
                if (firstX * x < 0) {
                    touchEvent.cancel();
                }
                return;
            }

            // 上拉
            if (this.hasSecondScreen && bottom < window.innerHeight + 2 && firstY < 0
                && this.isVerticalSwipe(firstX, firstY)) {
                touchEvent.cancel();
                this.$emit('zoom-swipe-up-move', y);
                this.isSwipingUp = true;
                return;
            }

            // 下拉
            if (top > -2 && firstY > 0 && (this.isVerticalSwipe(firstX, firstY)
                || this.target.isLongImage && !this.isZoomed)) {
                touchEvent.cancel();

                this.swipeDownTarget(touchEvent);
                this.isSwipingDown = true;
                return;
            }

            // 拖拽当前图片
            // 取消事件冒泡
            touchEvent.cancel();

            // 对 放大宽度=屏幕宽 或 放大高度=屏幕高 做特殊处理
            if (Math.abs(width - this.innerWidth) < 2 && Math.abs(firstY) > Math.abs(firstX)) {
                x = 0;
            }
            else if (Math.abs(height - this.innerHeight) < 2 && Math.abs(firstX) > Math.abs(firstY)) {
                y = 0;
            }

            // 离开边缘加阻力
            if (x > 0 && left < 1 && left + x > 0) {
                x = -left + 0.3 * (left + x);
            }
            else if (x < 0 && right > this.innerWidth - 1 && right + x < this.innerWidth) {
                x = (this.innerWidth - right) + 0.3 * (right + x - this.innerWidth);
            }

            if (y > 0 && top < 1 && top + y > 0) {
                y = -top + 0.3 * (top + y);
            }
            else if (y < 0 && bottom > this.innerHeight - 1 && bottom + y < this.innerHeight) {
                y = (this.innerHeight - bottom) + 0.3 * (bottom + y - this.innerHeight);
            }

            // 记录偏移量
            this.targetTransform.translate = {
                x,
                y
            };

            util.setCss(this.target.el, {
                transform: `translate3d(${x}px, ${y}px, 0)`
            });
        },
        onMoveEnd(touchEvent) {
            if (!this.isZoomed && !this.isLongImage) {
                return;
            }

            // 翻页
            if (this.isSwipingHorizonal) {
                this.isSwipingHorizonal = false;
                return;
            }

            // 上拉
            if (this.isSwipingUp) {
                touchEvent.cancel();
                this.isSwipingUp = false;
                return;
            }

            // 下拉
            if (this.isSwipingDown) {
                touchEvent.cancel();

                // 退场
                if (touchEvent.delta.y > SWIPE_DOWN_DISTANCE
                    || !this.isZoomed && this.target.isLongImage && touchEvent.delta.y > 10) {
                    // TODO 看一下能不能优化
                    this.updateTargetStyle();
                    this.$emit('zoom-swipe-down-end');
                }
                // 恢复原来位置
                else {
                    cssAnimate(this.target.el, {
                        transform: 'none'
                    }, {
                        duration: AnimateConfig.duration.swipeDownCancel,
                        ease: AnimateConfig.transition['ease-in-out']
                    }).then(() => {
                        this.isAnimating = false;
                    });

                    this.isAnimating = true;
                    this.$emit('zoom-swipe-down-cancel');
                }

                this.isSwipingDown = false;
                return;
            }

            // 拖拽当前图片
            // 取消事件冒泡
            touchEvent.cancel();

            // 更新位置信息
            let {x, y} = this.targetTransform.translate;
            this.targetBounding.left += x;
            this.targetBounding.right += x;
            this.targetBounding.top += y;
            this.targetBounding.bottom += y;

            // 回弹
            let needKickBack = this.autoKickBack({
                duration: AnimateConfig.duration.dragKickBack
            });
            if (needKickBack) {
                return;
            }

            // 调整位置
            if (this.adjustTargetPosition(true)) {
                return;
            }

            // 惯性滑动降级
            if (util.animationDowngrade) {
                this.updateTargetStyle();
            }
            else {
                this.autoMove(touchEvent);
            }
        },
        onTap(touchEvent) {
            touchEvent.cancel();
            this.$emit('zoom-tap');
        },
        onDoubleTap(touchEvent) {
            touchEvent.cancel();
            if (!this.isReady) {
                return;
            }

            // 恢复
            if (this.lastScale !== 1) {
                // 缩小到原位
                scaleImage(this.target.el, this.target.position, () => {
                    this.recoverTargetStyle();
                    this.$nextTick(() => {
                        this.isAnimating = false;
                    });
                }, {
                    duration: AnimateConfig.duration.zoomOut,
                    ease: AnimateConfig.transition['ease-in-out2']
                });

                this.isAnimating = true;
                this.scale = 1;
            }
            // 放大
            else {
                let scale = 2.5;
                let origin = touchEvent.points.center;

                // 计算放大倍数和中心
                const {left, top, width, height} = this.targetBounding;
                if (width * 2 <= this.innerWidth) {
                    scale = this.innerWidth / width;
                    origin = {
                        x: this.innerWidth / 2,
                        y: origin.y
                    };
                }
                else if (height * 2 <= this.innerHeight) {
                    scale = this.innerHeight / height;
                    origin = {
                        x: origin.x,
                        y: this.innerHeight / 2
                    };
                }

                let {x, y} = origin;
                x = 100 * (x - left) / width;
                y = 100 * (y - top) / height;

                // 如果在图片外部点击，默认改为中心点放大
                // 如果是小图，默认改为中心点放大
                if (x < 0 || x > 100 || y < 0 || y > 100 || this.target.isSmallImage) {
                    x = 50;
                    y = 50;
                }

                util.setCss(this.target.el, {
                    'transform-origin': `${x}% ${y}%`
                });

                cssAnimate(this.target.el, {
                    transform: `scale3d(${scale}, ${scale}, 1)`
                }, {
                    duration: AnimateConfig.duration.zoomIn,
                    ease: AnimateConfig.transition['ease-in-out2']
                }).then(() => {
                    this.updateTargetStyle();
                    this.$nextTick(() => {
                        this.isAnimating = false;
                    });
                });

                this.isAnimating = true;
                this.scale = scale;
            }

            this.lastScale = this.scale;
            this.isZoomed = this.scale !== 1;
        },
        onPinch(touchEvent) {
            touchEvent.cancel();

            if (!this.isReady) {
                return;
            }

            let {x, y} = touchEvent.points.center;
            let {left, top, width, height} = this.targetBounding;
            let scale = touchEvent.delta.zoom * this.lastScale;
            let beforeMaxScale = this.fixedScale;
            let beforeMinScale = 1;

            // 接近最大时增加阻力，降级情况
            if (scale > beforeMaxScale && util.animationDowngrade) {
                scale = beforeMaxScale;
            }
            // 接近最大时增加阻力，不降级情况
            else if (scale > beforeMaxScale) {
                scale = beforeMaxScale + 0.1 * (beforeMaxScale / this.lastScale) * (scale - beforeMaxScale);
            }
            // 接近最小时增加阻力
            else if (scale < beforeMinScale) {
                scale = beforeMinScale - 0.56 * (1 - scale / beforeMinScale);
            }

            // scale限制
            this.scale = Math.max(this.minScale, Math.min(this.maxScale, scale));
            scale = this.scale / this.lastScale;

            // 设置origin
            x = 100 * (x - left) / width;
            y = 100 * (y - top) / height;

            // 设置transform属性
            let props = {
                transform: `scale3d(${scale}, ${scale}, 1)`
            };

            if (!this.targetTransform.origin) {
                this.targetTransform.origin = true;
                props['transform-origin'] = `${x}% ${y}%`;
            }

            util.setCss(this.target.el, props);

            this.isZoomed = true;
        },
        onPinchEnd(touchEvent) {
            if (!this.isReady) {
                return;
            }

            let needReset = false;
            let needAnimation = false;
            if (this.scale <= 1) {
                this.scale = 1;
                needReset = true;
                needAnimation = true;
            }
            else if (this.scale > this.fixedScale) {
                this.scale = this.fixedScale;
                needAnimation = true;
            }

            if (needAnimation) {
                if (needReset) {
                    this.updateTargetStyle();

                    this.$nextTick(() => {
                        scaleImage(this.target.el, this.target.position, () => {
                            this.recoverTargetStyle();
                            this.$nextTick(() => {
                                this.isAnimating = false;
                            });
                        }, {
                            ease: AnimateConfig.transition['ease-in-out2'],
                            duration: AnimateConfig.duration.pinchKickBack
                        });
                    });
                }
                else {
                    let scale = this.scale / this.lastScale;

                    cssAnimate(this.target.el, {
                        transform: `scale3d(${scale}, ${scale}, 1)`
                    }, {
                        duration: AnimateConfig.duration.pinchKickBack,
                        ease: AnimateConfig.transition['ease-in-out2']
                    }).then(() => {
                        this.updateTargetStyle();
                        this.$nextTick(() => {
                            this.isAnimating = false;
                        });
                    });
                }
                this.isAnimating = true;
            }
            else {
                this.updateTargetStyle();
                this.adjustTargetPosition();
            }

            this.lastScale = this.scale;
            this.isZoomed = this.scale !== 1;
        },

        // 拖拽
        isHorizonalSwipe(x, y) {
            // tan20度 = 0.364
            return Math.abs(y) <= Math.abs(x) * 0.364;
        },
        isVerticalSwipe(x, y) {
            // tan20度 = 0.364
            return Math.abs(x) <= Math.abs(y) * 0.364;
        },
        // 回弹
        autoKickBack({duration = 100, delta = null}) {
            // 计算元素位置
            const {left, right, top, bottom, width, height} = this.targetBounding;
            let moveX = 0;
            let moveY = 0;
            let offsetX = 0;
            let offsetY = 0;

            // 边界检查
            let needKickBack = false;
            let needKickBackForX = false;
            let needKickBackForY = false;
            if (width + 1 >= this.innerWidth) {
                if (left > 1) {
                    this.targetTransform.translate.x += -left;
                    needKickBack = true;
                    needKickBackForX = true;
                    offsetX = left;
                }
                else if (right + 1 < this.innerWidth) {
                    this.targetTransform.translate.x += (this.innerWidth - right);
                    needKickBack = true;
                    needKickBackForX = true;
                    offsetX = this.innerWidth - right;
                }

                if (height + 1 < this.innerHeight) {
                    // 调整高度居中
                    moveY = this.innerHeight / 2 - (top + height / 2);
                }
            }

            if (height + 1 >= this.innerHeight) {
                if (bottom + 1 < this.innerHeight) {
                    this.targetTransform.translate.y += (this.innerHeight - bottom);
                    needKickBack = true;
                    needKickBackForY = true;
                    offsetY = this.innerHeight - bottom;
                }
                else if (top > 1) {
                    this.targetTransform.translate.y += -top;
                    needKickBack = true;
                    needKickBackForY = true;
                    offsetY = top;
                }

                if (width + 1 < this.innerWidth) {
                    // 调整宽度居中
                    moveX = this.innerWidth / 2 - (left + width / 2);
                }
            }

            // 回弹
            if (needKickBack) {
                if (Math.abs(moveX) + Math.abs(moveY) > 0) {
                    this.targetTransform.translate.x += moveX;
                    this.targetTransform.translate.y += moveY;
                }

                if (delta) {
                    this.adjustKickBack({
                        delta,
                        needKickBackForX,
                        needKickBackForY
                    });
                }

                // 计算时长
                if (typeof duration === 'function') {
                    duration = duration.call(this, offsetX, offsetY);
                }

                let {x, y} = this.targetTransform.translate;
                cssAnimate(this.target.el, {
                    transform: `translate3d(${x}px, ${y}px, 0)`
                }, {
                    duration,
                    ease: AnimateConfig.transition['ease-in-out5']
                }).then(() => {
                    this.updateTargetStyle();
                    this.$nextTick(() => {
                        this.isAnimating = false;
                    });
                });

                this.isAnimating = true;
            }

            return needKickBack;
        },
        // 回弹优化
        adjustKickBack({delta, needKickBackForX, needKickBackForY}) {
            const {left, right, top, bottom} = this.targetBounding;
            let {deltaX, deltaY} = delta;

            if (!needKickBackForX && Math.abs(deltaX) > 1) {
                // 不滑出窗口
                if (deltaX > 0 && left + deltaX > 0) {
                    deltaX = Math.max(0, -left);
                }
                else if (deltaX < 0 && right + deltaX < this.innerWidth) {
                    deltaX = Math.min(0, this.innerWidth - right);
                }

                this.targetTransform.translate.x += deltaX;
            }

            if (!needKickBackForY && Math.abs(deltaY) > 1) {
                // 不滑出窗口
                if (deltaY > 0 && top + deltaY > 0) {
                    deltaY = Math.max(0, -top);
                }
                else if (deltaY < 0 && bottom + deltaY < this.innerHeight) {
                    deltaY = Math.min(0, this.innerHeight - bottom);
                }

                this.targetTransform.translate.y += deltaY;
            }
        },
        // 调整居中或贴边
        adjustTargetPosition(needUpdateTarget) {
            // 判断target宽高和位移
            let {left, right, top, bottom, width, height} = this.targetBounding;
            let moveX = 0;
            let moveY = 0;
            let needAnimation = false;

            if (height + 2 < this.innerHeight && width + 2 < this.innerWidth) {
                // 调整高度居中
                moveY = this.innerHeight / 2 - (top + height / 2);
                // 调整宽度居中
                moveX = this.innerWidth / 2 - (left + width / 2);
            }
            else if (height + 2 < this.innerHeight) {
                // 调整高度居中
                moveY = this.innerHeight / 2 - (top + height / 2);

                if (left > 1) {
                    moveX = -left;
                }
                else if (right + 1 < this.innerWidth) {
                    moveX = this.innerWidth - right;
                }
            }
            else if (width + 2 < this.innerWidth) {
                // 调整宽度居中
                moveX = this.innerWidth / 2 - (left + width / 2);

                if (top > 1) {
                    moveY = -top;
                }
                else if (bottom + 1 < this.innerHeight) {
                    moveY = this.innerHeight - bottom;
                }
            }
            else {
                // 保持贴边
                if (left > 1) {
                    moveX = -left;
                }
                else if (right + 1 < this.innerWidth) {
                    moveX = this.innerWidth - right;
                }

                if (top > 1) {
                    moveY = -top;
                }
                else if (bottom + 1 < this.innerHeight) {
                    moveY = this.innerHeight - bottom;
                }
            }

            if (Math.abs(moveX) + Math.abs(moveY) > 2) {
                needAnimation = true;
            }

            if (needAnimation) {
                this.targetBounding.left = left + moveX;
                this.targetBounding.right = right + moveX;
                this.targetBounding.top = top + moveY;
                this.targetBounding.bottom = bottom + moveY;

                if (needUpdateTarget) {
                    this.updateTargetStyle();
                }

                this.$nextTick(() => {
                    cssAnimate(this.target.el, {
                        transform: `translate3d(${moveX}px, ${moveY}px, 0)`
                    }, {
                        duration: AnimateConfig.duration.dragKickBack,
                        ease: AnimateConfig.transition['ease-in-out5']
                    }).then(() => {
                        this.updateTargetStyle();
                        this.$nextTick(() => {
                            this.isAnimating = false;
                        });
                    });
                });

                this.isAnimating = true;
            }

            return needAnimation;
        },
        // 惯性滑动
        autoMove(touchEvent) {
            let {x, y} = this.targetTransform.translate;
            let {x: firstX, y: firstY} = touchEvent.delta.first;
            let {x: lastX, y: lastY, distance} = touchEvent.delta.last;

            // 对 放大宽度=屏幕宽 或 放大高度=屏幕高 做特殊处理
            let {width, height} = this.targetBounding;
            if (Math.abs(width - this.innerWidth) < 2 && Math.abs(firstY) > Math.abs(firstX)) {
                lastX = 0;
                distance = Math.abs(lastY);
            }
            else if (Math.abs(height - this.innerHeight) < 2 && Math.abs(firstX) > Math.abs(firstY)) {
                lastY = 0;
                distance = Math.abs(lastX);
            }

            // 基于最后一次滑动计算惯性
            let duration = Math.min(1000, AnimateConfig.duration.dragAutoMove * distance);
            let timeRatio = 64;
            let moveTimes = duration / timeRatio;
            let moveX = lastX * moveTimes;
            let moveY = lastY * moveTimes;

            // 限制离开边界的距离
            const boundaryDistance = 33;
            const ret = this.adjustAutoMoveWithBoundary({
                boundaryDistance,
                timeRatio,
                moveX,
                moveY,
                lastX,
                lastY
            });

            // 计算回弹动画中不回弹方向的delta
            let deltaX = 0;
            let deltaY = 0;

            if (ret.isUpdated) {
                // 更新delta
                deltaX = moveX - ret.moveX;
                deltaY = moveY - ret.moveY;

                // 更新位移和时长
                duration = ret.duration;
                moveX = ret.moveX;
                moveY = ret.moveY;
            }

            // 限制delta最大值
            const maxDelta = boundaryDistance * 3;
            if (Math.abs(deltaX) > maxDelta) {
                deltaX = deltaX > 0 ? maxDelta : -maxDelta;
            }
            if (Math.abs(deltaY) > maxDelta) {
                deltaY = deltaY > 0 ? maxDelta : -maxDelta;
            }

            // 更新位置信息
            this.targetBounding.left += moveX;
            this.targetBounding.right += moveX;
            this.targetBounding.top += moveY;
            this.targetBounding.bottom += moveY;

            x += moveX;
            y += moveY;

            this.targetTransform.translate = {
                x,
                y
            };

            cssAnimate(this.target.el, {
                transform: `translate3d(${x}px, ${y}px, 0)`
            }, {
                duration,
                ease: AnimateConfig.transition['ease-out2']
            }).then(() => {
                // 检测是否回弹
                let needKickBack = this.autoKickBack({
                    duration(x = 0, y = 0) {
                        x = Math.max(x, y);
                        return AnimateConfig.duration.autoMoveKickBack - 100 * x / boundaryDistance;
                    },
                    delta: {
                        deltaX,
                        deltaY
                    }
                });
                if (!needKickBack) {
                    this.updateTargetStyle();
                    this.$nextTick(() => {
                        this.isAnimating = false;
                    });
                }
            });

            this.isAnimating = true;
        },
        // 惯性滑动考虑边界距离
        adjustAutoMoveWithBoundary({moveX, moveY, lastX, lastY, boundaryDistance, timeRatio}) {
            const {left, right, top, bottom} = this.targetBounding;
            let xTimes = 0;
            let yTimes = 0;

            if (moveX > 0 && left + moveX > boundaryDistance) {
                moveX = boundaryDistance - left;
                xTimes = moveX / lastX;
            }
            else if (moveX < 0 && right + moveX < this.innerWidth - boundaryDistance) {
                moveX = this.innerWidth - boundaryDistance - right;
                xTimes = moveX / lastX;
            }

            if (moveY > 0 && top + moveY > boundaryDistance) {
                moveY = boundaryDistance - top;
                yTimes = moveY / lastY;
            }
            else if (moveY < 0 && bottom + moveY < this.innerHeight - boundaryDistance) {
                moveY = this.innerHeight - boundaryDistance - bottom;
                yTimes = moveY / lastY;
            }

            const ret = {
                isUpdated: false,
                duration: 0,
                moveX: 0,
                moveY: 0
            };

            // 调整滑动距离
            if (xTimes || yTimes) {
                let moveTimes = 0;

                if (xTimes && yTimes) {
                    moveTimes = Math.min(xTimes, yTimes);
                }
                else if (xTimes) {
                    moveTimes = xTimes;
                }
                else {
                    moveTimes = yTimes;
                }

                ret.duration = Math.round(timeRatio * moveTimes);
                ret.moveX = lastX * moveTimes;
                ret.moveY = lastY * moveTimes;
                ret.isUpdated = true;
            }

            return ret;
        },

        // target相关
        // 下拉操作
        swipeDownTarget(touchEvent) {
            let {x: x1, y: y1} = touchEvent.points.start;
            let {x: x2, y: y2} = touchEvent.points.move;
            let y = touchEvent.delta.y;
            let scale = 1;
            if (y > 0) {
                let distance = y;
                let minScale = 2;

                // 长图默认状态时下拉
                if (this.isLongImage && this.scale === 1) {
                    minScale = 0.3;
                }

                // 计算方法: 418 / (this.scale - minScale) = distance / (this.scale - scale)
                scale = Math.min(this.scale,
                    Math.max(minScale, this.scale - distance * (this.scale - minScale) / 418));
                scale /= this.scale;
            }

            // 计算公式
            // (x1 - x0) / width = (x2 - (x0 + moveX)) / (width * scale)
            // (y1 - y0) / height = (y2 - (y0 + moveY)) / (height * scale)
            // moveX =  (x2 - x0) - scale * (x1 - x0)
            // moveY =  (y2 - y0) - scale * (y1 - y0)
            let moveX = (x2 - this.targetBounding.left) - scale * (x1 - this.targetBounding.left);
            let moveY = (y2 - this.targetBounding.top) - scale * (y1 - this.targetBounding.top);

            util.setCss(this.target.el, {
                transform: `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale}, ${scale})`
            });

            this.$emit('zoom-swipe-down-move', {
                y
            });
        },
        // 更新target样式
        updateTargetStyle() {
            let {left, top, width, height, right, bottom} = this.target.el.getBoundingClientRect();
            let props = {
                left: left + 'px',
                top: top + 'px',
                width: width + 'px',
                height: height + 'px'
            };

            util.setCss(this.target.el, Object.assign({}, props, {
                'transform': '',
                'transform-origin': ''
            }));

            this.targetBounding = {
                left,
                top,
                width,
                height,
                right,
                bottom
            };

            this.targetTransform.origin = false;
            this.targetTransform.translate = {
                x: 0,
                y: 0
            };

            this.$emit('zoom-target-update', {
                props
            });
        },
        // 恢复target原来样式
        recoverTargetStyle() {
            let {left, top, width, height} = this.target.position;
            let props = {
                left: left + 'px',
                top: top + 'px',
                width: width + 'px',
                height: height + 'px'
            };

            util.setCss(this.target.el, {
                'transform': '',
                'transform-origin': ''
            });

            this.targetBounding = {
                left,
                top,
                width,
                height,
                right: left + width,
                bottom: top + height
            };

            this.$emit('zoom-target-update', {
                props
            });
        },
        // 更新临近边缘状态
        updateBoundaryStatus() {
            if (!this.isZoomed) {
                this.store.set('zoom.nearLeftBoundary', true);
                this.store.set('zoom.nearRightBoundary', true);
                this.store.set('zoom.nearBottomBoundary', true);
                this.isNearBoundary = true;
            }
            else {
                let nearLeftBoundary = this.targetBounding.left > -2;
                let nearRightBoundary = this.targetBounding.right < this.innerWidth + 2;
                let nearBottomBoundary = this.targetBounding.bottom < this.innerHeight + 2;
                this.store.set('zoom.nearLeftBoundary', nearLeftBoundary);
                this.store.set('zoom.nearRightBoundary', nearRightBoundary);
                this.store.set('zoom.nearBottomBoundary', nearBottomBoundary);
                this.isNearBoundary = nearLeftBoundary || nearRightBoundary || nearBottomBoundary;
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
.image-viewer-zoom
    position relative
    width 100%
    height 100%
    overflow hidden
    user-select none
</style>

