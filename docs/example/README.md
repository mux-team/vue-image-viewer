# 全屏展示

## 体验二维码


## 介绍
- 通过配置`data`里的`list`数据绑定图片信息来实现点击从图片区域展开大图，并且左右滑动可按照顺序来切换图片
- 用户可以配置`slot`来展示信息栏、页码、自定义等相关信息
- 通过`beforeViewerEnter` 与`beforeViewerLeave` 回调函数来指定展开收回的图片位置
- 通过配置`closeIconURL` `closeIconSize` 来设置图片浏览器的关闭按钮的地址和大小

## 代码

### 模板
```html
<template>
    <div class="example-container">
        <h1>全屏展示</h1>
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
            @enterstart="beforeViewerEnter"
            @leavestart="beforeViewerLeave"
            @leave="onViewerLeave"
            @switch="onViewerSwitch"
            @secondscreenshow="onSecondScreenShow"
            @secondscreenhide="onSecondScreenHide"
        >
            <!-- 自定义工具栏 -->
            <template slot="toolbar">
                <div style="position: absolute; bottom: 0; width: 100%; height: .42rem;">
                    <p style="margin: 0;position: absolute; right:17px; bottom:9px; line-height: 24px; font-size: 14px;" @click="onClick">
                        查看详情
                    </p>
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
                },
                {
                    src: "http://img2.dzwww.com:8888/tupian/20171228/2017122808392ad32000858cb9.jpg",
                    width: 900,
                    height: 1200,
                    desc: "2008年起转战影坛，并凭借好莱坞电影《功夫之王》成为首位荣登IMDB电影新人排行榜榜首的亚洲女星 [9-10]  。2009年在“80后新生代娱乐大明星”评选活动中获封“四小花旦”之一 [11]  。"
                }
            ],
            showIndex: 0,
            showViewer: false
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