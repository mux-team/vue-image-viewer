# 第二屏上拉展示

## 体验二维码


## 介绍
- 通过配置`slot`为`secondScreen` 的模板来配置上拉出现的第二屏
- 可以通过配置`data`中的`hideInfo`与`hideToolbar`隐藏页码和图片信息
- 配置`onSecondScreenShow`与`onSecondScreenHide`回调函数来绑定出现第二屏的回调函数

## 代码

### 模板
```html
<template>
    <div class="example-container">
        <h1>上滑出现第二屏</h1>
        <div class="img-container">
            <div class="img-left">
                <div class="img-wrapper" @click="onImgClick(0)">
                    <img :src="list[0].src">
                </div>
                <div class="img-wrapper" @click="onImgClick(1)">
                    <img :src="list[1].src">
                </div>
            </div>
            <div class="img-right">
                <div class="img-wrapper" @click="onImgClick(2)">
                    <img :src="list[2].src">
                </div>
                <div class="img-wrapper c-gap-top" @click="onImgClick(3)">
                    <img :src="list[3].src">
                </div>
            </div>
        </div>
        <image-viewer
            v-if="showViewer"
            ref="viewer"
            :list="list"
            :startIndex="showIndex"
            :hideInfo="hideInfo"
            :hideToolbar="hideToolbar"
            @enterstart="beforeViewerEnter"
            @leavestart="beforeViewerLeave"
            @leave="onViewerLeave"
            @switch="onViewerSwitch"
            @secondscreenshow="onSecondScreenShow"
            @secondscreenhide="onSecondScreenHide"
        >

            <!-- 自定义第二屏 -->
            <template slot="secondScreen">
                <div
                    style="height: 300px; background-color: #fff;"
                >
                卡片1
                </div>
                <div
                    class="c-gap-top"
                    style="height: 300px; background-color: #fff;"
                >
                卡片2
                </div>
                <div
                    class="c-gap-top"
                    style="height: 300px; background-color: #fff;"
                >
                卡片3
                </div>
            </template>
        </image-viewer>
    </div>
</template>

```
### 配置数据和回调函数

```js
<script>
import ImageViewer from 'components/ImageViewer';

export default {
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
                },
                {
                    src: "http://img2.dzwww.com:8888/tupian/20171228/2017122808392ad32000858cb9.jpg",
                    width: 900,
                    height: 1200,
                    desc: "2008年起转战影坛，并凭借好莱坞电影《功夫之王》成为首位荣登IMDB电影新人排行榜榜首的亚洲女星 [9-10]  。2009年在“80后新生代娱乐大明星”评选活动中获封“四小花旦”之一 [11]  。"
                }
            ],
            showIndex: 0,
            showViewer: false,
            hideInfo: true,
            hideToolbar: true
        }
    },
    components: {
        ImageViewer
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
        },
        onSecondScreenShow(data) {
            console.log('second screen show', data);
        },
        onSecondScreenHide(data) {
            console.log('second screen hide', data);
        },
        onClick() {
            this.$refs.viewer.showSecondScreen();
        },
        onChangeInfo() {
            this.hideInfo = !this.hideInfo;
        },
        onChangePageNum() {
            this.hidePageNum = !this.hidePageNum;
        }
    }
}
</script>
```
### 样式
``` stylus
<style lang="stylus" scoped>
.example-container
    padding 10px

    h1
        font-size 16px
        margin-bottom 10px

.img-container
    display flex

    .img-wrapper
        margin-bottom 8px

    .img-left
        width 49%
        margin-right 8px

    .img-right
        flex 1

.img-wrapper
    img
        display block
        width 100%
</style>
```