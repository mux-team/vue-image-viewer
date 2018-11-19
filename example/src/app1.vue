<template>
    <div class="example-container">
        <div class="img-container">
            <div class="img-left">
                <div class="img-wrapper" @click="onImgClick(0)">
                    <img :src="list[0].src">
                </div>
            </div>
            <div class="img-right">
                <div class="img-wrapper" @click="onImgClick(1)">
                    <img :src="list[1].src">
                </div>
                <div class="img-wrapper c-gap-top" @click="onImgClick(2)">
                    <img :src="list[2].src">
                </div>
            </div>
        </div>
        <image-viewer
            v-if="showViewer"
            ref="viewer"
            :list="list"
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
<script>
import ImageViewer from 'components/ImageViewer';

export default {
    data() {
        return {
            list: [
                {
                    src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540895328406&di=633d8af69e007dfb406291614b4b093d&imgtype=0&src=http%3A%2F%2Fdingyue.nosdn.127.net%2Fz3bDK99TJW5R56g6BVH9DyjbTamTRLEV61s8aOt2j9n2g1537360847610compressflag.jpg",
                    width: 414,
                    height: 692,
                    desc: "刘亦菲，1987年8月25日出生于湖北省武汉市，华语影视女演员、歌手，毕业于北京电影学院2002级表演系本科班。2002年主演个人首部电视剧《金粉世家》，从而踏入演艺圈。2003年因主演武侠剧《天龙八部》崭露头角。2004年凭借仙侠剧《仙剑奇侠传》赵灵儿一角获得了高人气与关注度。2005年因在金庸剧《神雕侠侣》中饰演小龙女受到广泛关注。2006年发行首张音乐专辑《刘亦菲》；",
                    anchor: {
                        text: "我是3锚点",
                        url: "http://m.baidu.com/"
                    }
                },
                {
                    src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540895411180&di=169c25cb8e6fc003630619163d73c96f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201408%2F30%2F20140830170758_Ed8yF.jpeg",
                    width: 585,
                    height: 390,
                    desc: "2004年凭借仙侠剧《仙剑奇侠传》赵灵儿一角获得了高人气与关注度。2005年因在金庸剧《神雕侠侣》中饰演小龙女受到广泛关注。2006年发行首张音乐专辑《刘亦菲》；"
                },
                {
                    src: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1179730994,3920644772&fm=26&gp=0.jpg",
                    width: 500,
                    height: 444,
                    desc: "2004年凭借仙侠剧《仙剑奇侠传》赵灵儿一角获得了高人气与关注度。2005年因在金庸剧《神雕侠侣》中饰演小龙女受到广泛关注。2006年发行首张音乐专辑《刘亦菲》；"
                }
            ],
            showIndex: 0,
            showViewer: false,
            hideInfo: false,
            hidePageNum: false
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

<style lang="stylus" scoped>

.img-container
    display flex

    .img-wrapper
        margin-bottom 8px

    .img-left
        width 48%
        margin-right 8px

    .img-right
        flex 1

.img-wrapper
    img
        display block
        width 100%
</style>