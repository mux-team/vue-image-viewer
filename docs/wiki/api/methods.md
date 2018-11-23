# Methods

| 名称               | 说明                                | 参数     | 返回值        |
|-------------------|-------------------------------------|----------|--------------|
| append            | 追加图片       |list: Array|@return Boolean|
| updateList        | 更新列表中的部分图片    |startIndex: Number, list: Array|@return Boolean|
| updateItem        | 更新图片的部分字段    |index: Number, setIndex: Number, data: Object|@return Boolean|
| updateSetInfo     | 更新图片的套图数据    |index: Number, setInfo: Object|@return Boolean|
| showSecondScreen  | 上滑显示第二屏   |无|@return Boolean|
| close             | 关闭组件（一般不需要调用）   |无|@return Boolean|

### append 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| list             | 图片列表（字段包含src, width, height）   |Array||是|

### updateList 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| startIndex       | 起始index   |Number||是|
| list             | 图片列表（字段包含src, width, height等）   |Array||是|

### updateItem 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| index          | 图片index   |Number||是|
| setIndex       | 套图内index，不是套图就写0   |Number||是|
| data             | 要更新的字段和值   |Object||是|

### updateSetInfo 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| index               | 图片index   |Number||是|
| setInfo             | 套图   |Object||是|
| ---list             | 套图图片（字段包含src, width, height等）   |Array||是|