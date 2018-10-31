/**
 * @file 封装touch操作
 * @author rongweiwei@baidu.com
 */

import util from './util.js';

class Point {
    constructor(x, y) {
        if (typeof x === 'object') {
            this.x = x.clientX;
            this.y = x.clientY;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }

    clone() {
        return new Point(this.x, this.y);
    }

    getDelta(point) {
        let x = point.x - this.x;
        let y = point.y - this.y;
        return {
            x,
            y,
            distance: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        };
    }

    getCenter(point) {
        return new Point((this.x + point.x) / 2, (this.y + point.y) / 2);
    }

    near(point, threshold) {
        let d = threshold || 10;
        return this.getDelta(point).distance <= d;
    }
}

class MultiPoint {
    constructor(point1, point2) {
        if (typeof point1 === 'object' && point1.length >= 2) {
            this.point1 = new Point(point1[0]);
            this.point2 = point1[1] ? new Point(point1[1]) : this.point1.clone();
        }
        else {
            this.point1 = point1;
            this.point2 = point2;
        }
        this.distance = this.point1.getDelta(this.point2).distance;
    }

    clone() {
        return new MultiPoint(this.point1.clone(), this.point2.clone());
    }

    getDelta(point) {
        let distance = point.point1.getDelta(point.point2).distance;
        let scale = 1;
        if (this.distance !== 0) {
            scale = distance / this.distance;
        }
        return {
            zoom: scale
        };
    }

    getCenter() {
        return this.point1.getCenter(this.point2);
    }
}

const EventType = {
    NONE: 'none',
    TAP: 'tap',
    DOUBLE_TAP: 'double tap',
    MOVE: 'move',
    PINCH: 'pinch'
};

const TAP_DURATION = 300;
const TAP_TIMEOUT = 200;
const DOUBLE_TAP_TIME = 300;
const IS_BAIDU_APP = util.browser.isBaidu;

class TouchEvent {
    constructor({type = EventType.NONE, event, delta, points, duration, isFinished}) {
        this.type = type;
        this.originalEvent = event;
        this.delta = delta;
        this.points = points;
        this.duration = duration;
        this.isFinished = isFinished;
    }

    cancel() {
        if (this.originalEvent) {
            this.originalEvent.preventDefault();
            this.originalEvent.stopPropagation();
        }
    }
}

class TouchHelper {
    constructor(el, options) {
        this.resetData();
        this.lastTouch = {
            type: EventType.NONE
        };
        this.listeners = {};
        Object.keys(EventType).forEach(t => {
            this.listeners[EventType[t]] = [];
        });

        this.el = el;
        this.needListenEvent = true;
        this.needStopEvent = false;
        this.touchstartHanlder = event => {
            this.tryStopEvent(event);
            if (this.needListenEvent) {
                this.onTouchStart(event);
            }
        };
        this.touchmoveHanlder = event => {
            this.tryStopEvent(event);
            if (this.needListenEvent) {
                this.onTouchMove(event);
            }
        };
        this.touchendHanlder = event => {
            this.tryStopEvent(event);
            if (this.needListenEvent) {
                this.onTouchEnd(event);
            }
        };
        this.el.addEventListener('touchstart', this.touchstartHanlder, false);
        this.el.addEventListener('touchmove', this.touchmoveHanlder, false);
        this.el.addEventListener('touchend', this.touchendHanlder, false);
        this.el.addEventListener('touchcancel', this.touchendHanlder, false);
    }

    destroy() {
        this.resetData();
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }
        this.lastTouch = null;
        this.listeners = null;

        this.el.removeEventListener('touchstart', this.touchstartHanlder, false);
        this.el.removeEventListener('touchmove', this.touchmoveHanlder, false);
        this.el.removeEventListener('touchend', this.touchendHanlder, false);
        this.el.removeEventListener('touchcancel', this.touchendHanlder, false);
        this.touchstartHanlder = null;
        this.touchmoveHanlder = null;
        this.touchendHanlder = null;
        this.needListenEvent = false;
        this.needStopEvent = false;
        this.el = null;

        this.clearAutoTouchendTimer();
    }

    resetData() {
        this.startTime = 0;
        this.startPoint = null;
        this.movePoint = null;
        this.firstDelta = null;
        this.lastDelta = null;
        this.isMultiTouch = false;
        this.isMultiMove = false;
        this.isSingleMove = false;
    }

    on(eventName, handler) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].push(handler);
        }
    }

    off(eventName, handler) {
        // 取消所有事件
        if (!eventName) {
            Object.keys(this.listeners).forEach(name => {
                this.listeners[name] = [];
            });
        }
        // 取消单个事件
        else if (this.listeners[eventName] && !handler) {
            this.listeners[eventName] = [];
        }
        // 取消单个处理函数
        else if (this.listeners[eventName]) {
            let handlers = this.listeners[eventName];
            for (let i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i] === handler) {
                    handlers[i] = null;
                    break;
                }
            }
        }
    }

    trigger(eventName, touchEvent) {
        let handlers = this.listeners[eventName];
        if (handlers && handlers.length) {
            handlers.forEach(handler => {
                typeof handler === 'function' && handler(touchEvent);
            });
        }
    }

    tryStopEvent(event) {
        if (this.needStopEvent) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    pause() {
        this.needListenEvent = false;
        this.needStopEvent = true;
    }

    resume() {
        this.needListenEvent = true;
        this.needStopEvent = false;
    }

    onTouchStart(event) {
        // 取消tap事件
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
        }

        // 不影响单指滑动
        if (this.isMoving()) {
            return;
        }

        let touches = event.touches;
        this.startTime = (new Date()).getTime();

        switch (touches.length) {
            case 1: {
                this.startPoint = new Point(touches[0]);
                this.movePoint = this.startPoint.clone();
                break;
            }
            case 2: {
                this.isMultiTouch = true;
                this.startPoint = new MultiPoint(touches);
                this.movePoint = this.startPoint.clone();
                break;
            }
            default: {
                // 什么也不做
            }
        }
    }

    onTouchMove(event) {
        if (this.startTime <= 0) {
            return;
        }

        let touches = event.touches;
        let type = EventType.NONE;
        let delta;
        let center;

        switch (touches.length) {
            case 1: {
                // 不影响双指操作
                if (this.isMultiTouch) {
                    return;
                }

                let point = new Point(touches[0]);
                delta = this.startPoint.getDelta(point);
                if (!this.firstDelta) {
                    this.firstDelta = this.startPoint.getDelta(point);
                }
                this.lastDelta = this.movePoint.getDelta(point);
                this.movePoint = point;
                this.isSingleMove = true;

                type = EventType.MOVE;
                this.trigger(type, new TouchEvent({
                    event,
                    type,
                    delta: Object.assign({}, delta, {
                        first: this.firstDelta,
                        last: this.lastDelta
                    }),
                    points: {
                        start: this.startPoint,
                        move: this.movePoint
                    }
                }));
                break;
            }
            case 2: {
                // 不影响单指滑动
                if (this.isMoving()) {
                    return;
                }

                this.isSingleMove = false;
                this.isMultiMove = true;
                this.movePoint = new MultiPoint(touches);
                delta = this.startPoint.getDelta(this.movePoint);
                center = this.startPoint.getCenter();

                type = EventType.PINCH;
                this.trigger(type, new TouchEvent({
                    event,
                    type,
                    delta,
                    points: {
                        center
                    }
                }));
                break;
            }
            default: {
                // 什么也不做
            }
        }

        // 解决手百划出窗口touchend不触发问题
        this.updateAutoTouchendTimer();
    }

    onTouchEnd(event) {
        this.clearAutoTouchendTimer();

        if (this.startTime <= 0
            // 处理单指滑动时多指操作
            || event.touches.length > 0 && this.isSingleMove) {
            return;
        }

        let type = EventType.NONE;
        let delta;
        let center;

        // 手指离开当前元素
        if (event.targetTouches.length === 0) {
            let time = (new Date()).getTime();
            let duration = time - this.startTime;
            delta = this.startPoint.getDelta(this.movePoint);

            if (!this.isMultiTouch) {
                if (this.isSingleMove) {
                    type = EventType.MOVE;
                }
                else if (duration < TAP_DURATION) {
                    type = EventType.TAP;

                    // 与上一次touch结合
                    if (this.lastTouch.type === EventType.TAP
                        && time - this.lastTouch.time <= DOUBLE_TAP_TIME) {
                        type = EventType.DOUBLE_TAP;
                        center = this.lastTouch.startPoint;
                    }
                }
            }
            else if (this.isMultiMove) {
                type = EventType.PINCH;
                center = this.startPoint.getCenter();
            }

            // tap事件需要延迟
            if (type === EventType.TAP) {
                this.tapTimeout = setTimeout(() => {
                    this.tapTimeout = null;
                    this.trigger(type, new TouchEvent({
                        event,
                        type,
                        delta,
                        points: {
                            center
                        },
                        duration,
                        isFinished: true
                    }));
                }, TAP_TIMEOUT);
            }
            else {
                this.trigger(type, new TouchEvent({
                    event,
                    type,
                    delta: Object.assign({}, delta, {
                        first: this.firstDelta,
                        last: this.lastDelta
                    }),
                    points: {
                        center
                    },
                    duration,
                    isFinished: true
                }));
            }

            this.lastTouch = {
                type,
                time,
                duration,
                startPoint: this.startPoint,
                stopPoint: this.movePoint
            };
            this.resetData();
        }
    }

    updateAutoTouchendTimer() {
        if (!IS_BAIDU_APP || !(this.isSingleMove || this.isMultiMove)) {
            return;
        }

        this.clearAutoTouchendTimer();

        if (this.isSingleMove) {
            let {x, y} = this.movePoint;
            // 从上方划出窗口
            if (y < 10) {
                this.touchEndTimeout = setTimeout(() => {
                    this.onTouchEnd(createEmptyEvent('touchend'));
                }, 80);
            }
            // 从其他方向划出窗口
            else if (isNearWindowBoundary(x, y, 10)) {
                this.touchEndTimeout = setTimeout(() => {
                    this.onTouchEnd(createEmptyEvent('touchend'));
                }, 180);
            }
        }
        else if (this.isMultiMove) {
            let {point1: {x: x1, y: y1}, point2: {x: x2, y: y2}} = this.movePoint;
            // 其中一个手指划出窗口
            if (isNearWindowBoundary(x1, y1, 20) || isNearWindowBoundary(x2, y2, 20)) {
                this.touchEndTimeout = setTimeout(() => {
                    this.onTouchEnd(createEmptyEvent('touchend'));
                }, 180);
            }
        }
    }

    clearAutoTouchendTimer() {
        if (!IS_BAIDU_APP || !this.touchEndTimeout) {
            return;
        }

        clearTimeout(this.touchEndTimeout);
        this.touchEndTimeout = null;
    }

    isMoving() {
        if (this.isSingleMove) {
            let {x, y} = this.firstDelta;
            let delta = this.startPoint.getDelta(this.movePoint);

            if (Math.abs(x) > Math.abs(y) && Math.abs(delta.x) > 20
                || Math.abs(x) <= Math.abs(y) && Math.abs(delta.y) > 10) {
                return true;
            }
        }

        return false;
    }
}

function createEmptyEvent(type) {
    let event = {
        type,
        touches: [],
        targetTouches: [],
        changedTouches: [],
        preventDefault: util.noop,
        stopPropagation: util.noop
    };
    return event;
}

function isNearWindowBoundary(x, y, threshold = 5) {
    return x < threshold || x > window.innerWidth - threshold
        || y < threshold || y > window.innerHeight - threshold;
}

export default {
    create(el, options) {
        const helper = new TouchHelper(el, options);
        return {
            on(eventName, handler) {
                helper.on(eventName, handler);
            },
            off(eventName, handler) {
                helper.on(eventName, handler);
            },
            pause() {
                helper.pause();
            },
            resume() {
                helper.resume();
            },
            destroy() {
                helper.destroy();
            }
        };
    },
    EventType: EventType
};
