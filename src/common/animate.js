// 部分代码参考图搜

import Spark from './spark';
import util from './util.js';
import AnimateConfig from './animate-config.js';
import 'web-animations-js';

/**
 * 执行CSS动画
 *
 * @param {Element} el 动画元素
 * @param {Object} props css属性值
 * @param {Object=} options 动画参数
 * @return {Object} promise
 */
export function cssAnimate(el, props, options) {
    const {duration = 300, ease = 'ease', delay = 0} = options || {};

    // transform特殊处理
    util.modifyTransformProperty(props);

    if (props.transform) {
        props['-webkit-transform'] = props.transform;
    }

    return new Promise(resolve => {
        Spark.css3(el, props, duration, ease, delay, () => {
            resolve();
        });
    });
}

/**
 * 执行 web animation 动画
 *
 * @param {Element} el 动画元素
 * @param {Array} frames 动画frames
 * @param {Object=} options 动画参数
 * @return {Object} promise
 */
export function jsAnimate(el, frames, options) {
    const {duration = 300, easing = 'ease', delay = 0, fill = 'none'} = options || {};

    frames.forEach(props => {
        // transform特殊处理
        util.modifyTransformProperty(props);
    });

    const animation = el.animate(frames, {
        easing,
        duration,
        delay,
        fill
    });

    return new Promise((resolve, reject) => {
        animation.onfinish = () => {
            resolve(animation);
        };
        animation.oncancel = () => {
            reject(animation);
        };
    });
}

/**
 * 执行位移动画
 *
 * @param {Element} el 动画元素
 * @param {Object} position 目标位置
 * @param {Object=} options 动画参数
 * @return {Object} promise
 */
export function flip(el, position, options) {
    const {left, top, width, height} = el.getBoundingClientRect();
    const {left: newLeft, top: newTop, width: newWidth, height: newHeight} = position;
    let x = newLeft - left;
    let y = newTop - top;
    let scaleX = newWidth / width;
    let scaleY = newHeight / height;
    let transformStr = `translate3d(${-x}px, ${-y}px, 0) scale(${1 / scaleX}, ${1 / scaleY})`;

    // 设置为最终样式，然后transform
    util.setCss(el, {
        'left': newLeft + 'px',
        'top': newTop + 'px',
        'width': newWidth + 'px',
        'height': newHeight + 'px',
        'transform-origin': 'left top',
        'transform': 'none'
    });

    const frames = [
        {
            transform: transformStr
        },
        {
            transform: 'none'
        }
    ];
    options.easing = AnimateConfig.getEasingName(options.easing);

    return jsAnimate(el, frames, options);
}

/**
 * 图片放大缩小
 *
 * @param {Element} el 动画元素
 * @param {Object} position 目标位置
 * @param {Function=} done 完成函数
 * @param {Object=} options 动画参数
 */
export function scaleImage(el, position, done, options) {
    const {left, top, width, height} = el.getBoundingClientRect();
    const {left: newLeft, top: newTop, width: newWidth, height: newHeight} = position;
    let x = newLeft - left;
    let y = newTop - top;
    let scaleX = newWidth / width;
    let scaleY = newHeight / height;

    // 设置为最终样式，然后transform
    util.setCss(el, {
        'left': newLeft + 'px',
        'top': newTop + 'px',
        'width': newWidth + 'px',
        'height': newHeight + 'px',
        'transform-origin': 'left top',
        'transform': `translate3d(${-x}px, ${-y}px, 0) scale(${1 / scaleX}, ${1 / scaleY})`
    });

    cssAnimate(el, {transform: 'none'}, options).then(done || util.noop);
}

/**
 * 计算图片展示位置
 *
 * @param {Object} options 数据
 * @param {number} options.innerWidth 容器宽
 * @param {number} options.innerHeight 容器高
 * @param {number} options.width 图片宽
 * @param {number} options.height 图片高
 * @param {boolean} options.isOneScreen 是否一屏内展示
 *
 * @return {Object}     {width: 图片宽, height: 图片高, left: 左偏移, top: 上偏移, isLongImage: 是否展示为长图}
 */
export function layoutImage({innerWidth, innerHeight, width, height, isOneScreen = true}) {
    const ret = {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        isLongImage: false,
        isSmallImage: false
    };

    // 一屏内展示，高或高撑满容器
    if (isOneScreen) {
        const threshold = 0.8;

        // 宽图
        if (width / height >= innerWidth / innerHeight && width >= innerWidth * threshold) {
            ret.width = innerWidth;
            ret.height = height * ret.width / width;
            ret.left = 0;
            ret.top = (innerHeight - ret.height) / 2;
        }
        // 长图
        else if (width / height < innerWidth / innerHeight && height > innerHeight * threshold) {
            ret.height = innerHeight;
            ret.width = width * ret.height / height;
            ret.left = (innerWidth - ret.width) / 2;
            ret.top = 0;
        }
        // 小图
        else {
            ret.width = width;
            ret.height = height;
            ret.left = (innerWidth - ret.width) / 2;
            ret.top = (innerHeight - ret.height) / 2;
            ret.isSmallImage = true;
        }
    }
    // 非一屏内展示，是超长图
    else if (height / width >= 2.2) {
        if (width > innerWidth / 3) {
            ret.width = innerWidth;
            ret.height = height * ret.width / width;
            ret.left = 0;
            ret.top = 0;
            ret.isLongImage = true;
        }
        else if (height > innerHeight / 3) {
            ret.height = innerHeight;
            ret.width = width * ret.height / height;
            ret.left = (innerWidth - ret.width) / 2;
            ret.top = 0;
        }
        // 小图
        else {
            ret.width = width;
            ret.height = height;
            ret.left = (innerWidth - ret.width) / 2;
            ret.top = (innerHeight - ret.height) / 2;
            ret.isSmallImage = true;
        }
    }
    // 非一屏内展示，不是超长图
    // 宽图
    else if (width / height >= innerWidth / innerHeight && width > innerWidth / 3) {
        ret.width = innerWidth;
        ret.height = height * ret.width / width;
        ret.left = 0;
        ret.top = (innerHeight - ret.height) / 2;
    }
    // 高图
    else if (width / height < innerWidth / innerHeight && height > innerHeight / 3) {
        ret.height = innerHeight;
        ret.width = width * ret.height / height;
        ret.left = (innerWidth - ret.width) / 2;
        ret.top = 0;
    }
    // 小图
    else {
        ret.width = width;
        ret.height = height;
        ret.left = (innerWidth - ret.width) / 2;
        ret.top = (innerHeight - ret.height) / 2;
        ret.isSmallImage = true;
    }

    return ret;
}
