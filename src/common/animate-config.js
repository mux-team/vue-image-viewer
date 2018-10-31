/**
 * @file 动画参数配置
 * @author rongweiwei@baidu.com
 */
import Spark from './spark';

// transition 时间曲线
const transitionTimingFunction = {
    'ease-out': 'ease-out',
    'ease-out2': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'ease-in-out2': 'ease-in-out',
    'ease-in-out3': 'ease-in-out',
    'ease-in-out4': 'ease-in-out',
    'ease-in-out5': 'ease-in-out',
    'ease-in-out6': 'ease-in-out'
};

// web animation 时间曲线
const easing = {
    'ease-out': 'cubic-bezier(0.0, 0.0, 0.4, 1)',
    'ease-out2': 'cubic-bezier(0.0, 0.0, 0.5, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0.2, 0.6, 1)',
    'ease-in-out2': 'cubic-bezier(0.3, 0.0, 0.65, 1)',
    'ease-in-out3': 'cubic-bezier(0.27, 0.0, 0.6, 1)',
    'ease-in-out4': 'cubic-bezier(0.42, 0.0, 0.52, 1)',
    'ease-in-out5': 'cubic-bezier(0.12, 0.0, 0.0, 1)',
    'ease-in-out6': 'cubic-bezier(0.2, 0.0, 0.2, 1)'
};

const easePrefix = 'search-ui-image-viewer-';

// 自定义动画时间曲线
if (typeof Spark.addTimeType === 'function') {
    Object.keys(easing).forEach(key => {
        let type = easePrefix + key;
        Spark.addTimeType(type, easing[key]);
        transitionTimingFunction[key] = type;
    });
}

export default {
    transition: transitionTimingFunction,
    duration: {
        enter: 200,
        leave: 260,
        swipe: 380,
        swipeDownStart: 260,
        swipeDownLeave: 260,
        swipeDownCancel: 200,
        infoExpand: 260,
        infoCollapse: 260,
        zoomIn: 320,
        zoomOut: 320,
        hideTop: 200,
        hideBottom: 240,
        showTop: 180,
        showBottom: 300,
        dragKickBack: 480,
        dragAutoMove: 25,
        pinchKickBack: 260,
        autoMoveKickBack: 720,
        swipeUp: 380,
        swipeUpCancel: 200,
        swipeUpZoomOut: 260
    },
    delay: {
        leave: 0,
        swipeDownLeave: 0
    },
    getEasingName(name = '') {
        if (name.indexOf(easePrefix) === 0) {
            name = name.slice(easePrefix.length);
        }

        if (easing[name]) {
            return easing[name];
        }

        if (/^(ease|linear)/.test(name)) {
            return name;
        }

        return 'ease';
    }
};
