# 指导

### NPM
推荐使用这种方式引入组件
```sh
npm install mux-vue-image-viewer
```

### CDN
您也可以通过引入js文件的方式来使用
```html
<script src="https://unpkg.com/mux-vue-image-viewer@1.0.0/dist/mux-vue-image-viewer.js"></script>
```

### 下载
<a href="https://raw.githubusercontent.com/mux-team/vue-image-viewer/master/dist/mux-vue-image-viewer.js">download</a>

### 引入
您可以以组件的形式引入
``` html
<template>
  <image-viewer></image-viewer>
</template>

<script>
import ImageViewer from 'mux-vue-image-viewer';

export default {
  components: {
    ImageViewer,
  },
};
</script>

```

