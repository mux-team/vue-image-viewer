# Props

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
| easySwipe	        |滑动部分不会退	   |Boolean|	false	|否|
| swipeDuration	    |左右切换图片时间	|Number|	350	|否|
| closeIconURL	    |关闭按钮的链接	    |String|	|	否|
| closeIconSize	    |关闭按钮的大小	    |Number|	22|	否|

### list 数组里对象的详细字段：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| src               | 图片链接   |String||是|
| width             | 图片宽度   |Number||是|
| height            | 图片高度   |Number||是|
| desc              | 图片描述   |String|空|否|
| setNum            | 如果是套图，填写套图内图片数量   |Number|0|否|
| setList           | 如果是套图，填写套图内图片数据（字段包含src, width, height）   |Array|空|否|





