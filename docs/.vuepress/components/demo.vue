<template>
    <div id="index">
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
    </div>
</template>

<script>
import ImageViewer from '../../../src/components/ImageViewer';

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
        },
        onClick() {
            location.href = 'http://www.dzwww.com/photo/';
        }
    }
}
</script>


<style lang="stylus" scoped>
$accentColor = #38f
$borderColor = #eaecef

#index
    background-color #fafafa
    overflow hidden
    min-height 600px

    .main
        width 800px
        margin 40px auto
        display flex

    .example
        text-align center
        width 308px

    h1
        font-size 32px
        color #32495f
        margin 70px auto 20px
        text-align center

    h2
        font-size 20px
        color #6889a9
        border none
        margin 20px 0 0

    p
        font-size 12px
        color #6889a9
        margin 0

    .desc
        flex 1
        margin-left 30px
        padding 100px 0
        text-align center

        .opt-wrapper
            margin 40px 0

        .card-btn
            color #fff
            background linear-gradient(30deg,#3f5b77,#51779b)
            padding 16px 48px
            font-size 20px
            border none
            cursor pointer
            line-height 24px
            margin-right 10px

            &.white
                background #fff
                color #32495f

    footer
        margin 0 auto 40px
        text-align center
        color #999



</style>
