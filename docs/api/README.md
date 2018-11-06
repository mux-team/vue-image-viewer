# API


## Props

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| list              | 图片列表   |Array||是|
| total             | 图片总数   |Number|0|否|
| startIndex        | 浏览起始位置   |Number|0|否|
| setIndex          | 套图内的index，一般为0   |Number|0|否|
| hideInfo          | 隐藏信息区  |Boolean|false|否|
| hideToolbar       | 隐藏功能区  |Boolean|false|否|
| hidePageNum       | 隐藏沉浸态的页码  |Boolean|false|否|
| isSwipeFirstLeave | 左滑第一张图是否退场  |Boolean|false|否|

### 其中 list 数组里对象的详细字段：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| src               | 图片链接   |String||是|
| width             | 图片宽度   |Number||是|
| height            | 图片高度   |Number||是|
| desc              | 图片描述   |String|空|否|
| setNum            | 如果是套图，填写套图内图片数量   |Number|0|否|
| setList           | 如果是套图，填写套图内图片数据（字段包含src, width, height）   |Array|空|否|

## Methods

| 名称               | 说明                                | 参数     | 返回值        |
|-------------------|-------------------------------------|----------|--------------|
| append            | 追加图片       |list: Array|@return Boolean|
| updateList        | 更新列表中的部分图片    |startIndex: Number, list: Array|@return Boolean|
| updateItem        | 更新图片的部分字段    |index: Number, setIndex: Number, data: Object|@return Boolean|
| updateSetInfo     | 更新图片的套图数据    |index: Number, setInfo: Object|@return Boolean|
| showSecondScreen  | 上滑显示第二屏   |无|@return Boolean|
| close             | 关闭组件（一般不需要调用）   |无|@return Boolean|

### 其中 append 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| list             | 图片列表（字段包含src, width, height）   |Array||是|

### 其中 updateList 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| startIndex       | 起始index   |Number||是|
| list             | 图片列表（字段包含src, width, height等）   |Array||是|

### 其中 updateItem 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| index          | 图片index   |Number||是|
| setIndex       | 套图内index，不是套图就写0   |Number||是|
| data             | 要更新的字段和值   |Object||是|

### 其中 updateSetInfo 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| index               | 图片index   |Number||是|
| setInfo             | 套图   |Object||是|
| ---list             | 套图图片（字段包含src, width, height等）   |Array||是|

## Slots

| 名称               | 描述             |
| ------------------|------------------|
| info              | 信息区 slot |
| toolbar           | 功能区 slot |
| anchor            | 锚点 slot |
| secondScreen      | 第二屏 slot |

## Events

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
```
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
```
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
```
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
```
params[0] = {
    index: 0,   // 当前展示图片序号
    setIndex: 0,   // 套图内序号，一般为0
    type: 'close-button' // 退场类型："close-button"关闭按钮退场、"close"关闭接口退场、"swipe-down"下拉退场、"swipe-first"第一张图右滑退场。
};
```

### switch 事件附带参数示例：
```
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
```
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
```
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
```
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
