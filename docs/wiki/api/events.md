# Events

| 名称               | 描述             |
| ------------------|------------------|
| enterstart        | 进场开始 |
| enter             | 进场完成 |
| leavestart        | 退场开始 |
| leave             | 退场完成 |
| switch            | 翻页    |
| imgclick          | 图片点击    |
| secondscreenshow  | 第二屏显示    |
| secondscreenhide  | 第二屏隐藏    |
| swipefirst        | 左滑第一张图  |

### enterstart 事件附带参数示例：
```js
params[0] = {
    index: 0,   // 当前展示图片序号
    setIndex: 0   // 套图内序号，一般为0
};

/**
 * 传入进场位置
 * @param {Element} el DOM元素
 */
param[1] = function animate(el) {};
```

### enter 事件附带参数示例：
```js
params[0] = {
    index: 0,   // 当前展示图片序号
    setIndex: 0,   // 套图内序号，一般为0
    data: {     // 当前展示图片
        src: '',
        width: 100,
        height: 100,
        desc: '',
        index: 0,   // 图片序号
        setIndex: 0   // 套图内序号，一般为0
    },
    prevData: {     // 当前展示图片的上一张
        src: '',
        width: 100,
        height: 100,
        desc: '',
        index: 0,   // 图片序号
        setIndex: 0   // 套图内序号，一般为0
    },
    nextData: {     // 当前展示图片的下一张
        src: '',
        width: 100,
        height: 100,
        desc: '',
        index: 0,   // 图片序号
        setIndex: 0   // 套图内序号，一般为0
    }
};
```

### leavestart 事件附带参数示例：
```js
params[0] = {
    index: 0,   // 当前展示图片序号
    setIndex: 0,   // 套图内序号，一般为0
    type: 'close-button' // 退场类型："close-button"关闭按钮退场、"close"关闭接口退场、"swipe-down"下拉退场、"swipe-first"第一张图右滑退场。
};

/**
 * 传入退场位置
 * @param {Element|Object} elOrRect DOM元素 或 位置信息（left, top, width, height）
 */
param[1] = function animate(elOrRect) {};
```

### leave 事件附带参数示例：
```js
params[0] = {
    index: 0,   // 当前展示图片序号
    setIndex: 0,   // 套图内序号，一般为0
    type: 'close-button' // 退场类型："close-button"关闭按钮退场、"close"关闭接口退场、"swipe-down"下拉退场、"swipe-first"第一张图右滑退场。
};
```

### switch 事件附带参数示例：
```js
params[0] = {
    dir: -1, // 方向：-1为往前翻页，1为往后翻页
    index: 0,   // 当前图片序号
    setIndex: 0,   // 套图内序号，一般为0
    data: {     // 当前展示图片
        src: '',
        width: 100,
        height: 100,
        desc: '',
        index: 0,   // 图片序号
        setIndex: 0   // 套图内序号，一般为0
    },
    prevData: {     // 当前展示图片的上一张
        src: '',
        width: 100,
        height: 100,
        desc: '',
        index: 0,   // 图片序号
        setIndex: 0   // 套图内序号，一般为0
    },
    nextData: {     // 当前展示图片的下一张
        src: '',
        width: 100,
        height: 100,
        desc: '',
        index: 0,   // 图片序号
        setIndex: 0   // 套图内序号，一般为0
    }
};
```

### imgclick 事件附带参数示例：
```js
params[0] = {
    status: true, // true为进入沉浸态，false为退出沉浸态
    index: 0,   // 当前图片序号
    setIndex: 0,   // 套图内序号，一般为0
    data: {     // 当前展示图片数据
        src: '',
        width: 100,
        height: 100,
        desc: ''
    }
};
```

### secondscreenshow 事件附带参数示例：
```js
params[0] = {
    index: 0,   // 当前图片序号
    setIndex: 0,   // 套图内序号，一般为0
    data: {     // 当前展示图片数据
        src: '',
        width: 100,
        height: 100,
        desc: ''
    }
};
```

### secondscreenhide 事件附带参数示例：
```js
params[0] = {
    index: 0,   // 当前图片序号
    setIndex: 0,   // 套图内序号，一般为0
    data: {     // 当前展示图片数据
        src: '',
        width: 100,
        height: 100,
        desc: ''
    }
};
```