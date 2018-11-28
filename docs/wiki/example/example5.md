# 缩略图裁剪

## 示例效果
<div style="margin-top: 30px">
    <span style="display: inline-block;vertical-align:middle">
        <img src="./img/example_s5.gif">
    </span>
    <span style="display: inline-block;vertical-align:middle; margin-left: 100px;">
        <img src="./img/example5.png">
    </span>
</div>

## 介绍
- 缩略图，点击图片从缩略图展开

## 代码

### 模板
```html {22}
<template>
    <div class="example-container">
        <h1>缩略图裁剪</h1>
        <div class="img-container">
            <span v-for="(item, i) in list" :key="i">
                <div class="img-wrapper" @click="onImgClick(i)">
                    <div class="img-load"
                        :style="{
                            'background-image': 'url(' + item.src + ')'
                        }"
                    />
                </div>
            </span>
        </div>
        <image-viewer
            v-if="showViewer"
            ref="viewer"
            :list="list"
            :startIndex="showIndex"
            :hideInfo="false"
            :hideToolbar="true"
            :imageClip="3"
            @enterstart="beforeViewerEnter"
            @leavestart="beforeViewerLeave"
            @leave="onViewerLeave"
            @switch="onViewerSwitch"
        >
        </image-viewer>
    </div>
</template>
```

### 配置数据和回调函数

```javascript
import ImageViewer from 'mux-vue-image-viewer';

export default {
    components: {
        ImageViewer
    },
    data() {
        return {
            list: [
                {
                    src: "http://img2.dzwww.com:8888/tupian/20171228/201712280839d2fccd9ec74f82.jpg",
                    width: 900,
                    height: 1200,
                    desc: "刘亦菲，1987年8月25日出生于湖北省武汉市，华语影视女演员、歌手，毕业于北京电影学院2002级表演系本科班。2002年主演个人首部电视剧《金粉世家》，从而踏入演艺圈。2003年因主演武侠剧《天龙八部》崭露头角。2004年凭借仙侠剧《仙剑奇侠传》赵灵儿一角获得了高人气与关注度。2005年因在金庸剧《神雕侠侣》中饰演小龙女受到广泛关注。2006年发行首张音乐专辑《刘亦菲》；"
                },
                {
                    src: "http://img2.dzwww.com:8888/tupian/20171228/201712280839914971c8162fe0.jpg",
                    width: 900,
                    height: 600,
                    desc: "2004年凭借仙侠剧《仙剑奇侠传》赵灵儿一角获得了高人气与关注度。2005年因在金庸剧《神雕侠侣》中饰演小龙女受到广泛关注。2006年发行首张音乐专辑《刘亦菲》；"
                },
                {
                    src: "http://img2.dzwww.com:8888/tupian/20171228/201712280839dfde29eeecef12.jpg",
                    width: 900,
                    height: 600,
                    desc: "2005年因在金庸剧《神雕侠侣》中饰演小龙女受到广泛关注。2006年发行首张音乐专辑《刘亦菲》；"
                }
            ],
            showViewer: false,
            showIndex: 0,
        }
    },
    methods: {
        onImgClick(i) {
            this.showViewer = true;
            this.showIndex = i;
        },
        beforeViewerEnter(obj, animate) {
            if (typeof animate === 'function') {
                let startEl = document.querySelectorAll('.img-wrapper')[obj.index];
                animate(startEl);
            }
        },
        beforeViewerLeave(obj, animate) {
            if (typeof animate === 'function') {
                let endEl = document.querySelectorAll('.img-wrapper')[obj.index];
                if (endEl) {
                    animate(endEl.getBoundingClientRect());

                    // 下面方式也可
                    animate(endEl);
                }
            }
        },
        onViewerLeave(data) {
            this.showViewer = false;
        },
        onViewerSwitch(obj) {
            // 翻页逻辑
        }
    }
}
```

### 样式
``` stylus
.example-container
    padding 10px

    h1
        font-size 16px
        margin-bottom 10px

.img-container
    display flex

    span
        flex 1

    .img-wrapper
        padding-bottom 100%
        position relative

        .img-load
            position absolute
            width 100%
            height 100%
            background-position top center
            background-size cover
```
