/**
 * @file 工具函数
 * @author rongweiwei@baidu.com
 */


// 浏览器类型检查
const isIos = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);
const isBaidu = /baiduboxapp/i.test(navigator.userAgent);
const isSearchCraft = /searchcraft/i.test(navigator.userAgent);

// 需要前缀的属性集合
/* eslint-disable fecs-valid-map-set */
const prefixPropertySet = {
    'transform': 1,
    'transform-origin': 1
};
/* eslint-enable fecs-valid-map-set */

// 是否禁用transform 3d
const disableTransform3d = !isIos && (isBaidu || isSearchCraft);

export default {

    /**
     * 浏览器
     *
     * @type {Object}
     */
    browser: {
        isIos,
        isBaidu,
        isSearchCraft
    },

    /**
     * 动画降级
     *
     * 部分安卓浏览器有兼容性问题
     *
     * @type {boolean}
     */
    animationDowngrade: !isIos && (isBaidu || isSearchCraft),

    /**
     * 空函数
     */
    noop() {},

    /**
     * 下载图片
     *
     * @param {Object} imgObj 图片对象
     * @return {Promise} promise
     */
    loadImg(imgObj) {
        return new Promise(resolve => {
            let img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = imgObj.src;
        });
    },

    /**
     * 设置样式
     *
     * @param {Element} el DOM元素
     * @param {Object} props CSS属性对象
     */
    setCss(el, props) {
        // transform特殊处理
        this.modifyTransformProperty(props);

        // 遍历属性
        Object.keys(props).forEach(p => {
            let val = props[p];
            let prefixProperty = prefixPropertySet[p] ? '-webkit-' + p : '';

            // 移除属性
            if (!val && val !== 0) {
                el.style.removeProperty(p);
                if (prefixProperty) {
                    el.style.removeProperty(prefixProperty);
                }
            }
            // 需要添加前缀的属性
            else if (prefixProperty) {
                el.style[p] = val;
                el.style[prefixProperty] = val;
            }
            // 其他属性
            else {
                el.style[p] = val;
            }
        });
    },

    /**
     * 修改transform属性
     *
     * @param {Object} props CSS属性对象
     */
    modifyTransformProperty(props) {
        // translate3d(0, 0, 0) => translate(0, 0)
        // scale3d(1, 1, 1) => scale(1, 1)
        if (disableTransform3d && props.transform && props.transform.indexOf('3d') > 0) {
            props.transform = props.transform.replace(/3d\(([^)]+)\)/, (all, str) => {
                str = str.slice(0, str.lastIndexOf(','));
                return `(${str})`;
            });
        }
    }
};
