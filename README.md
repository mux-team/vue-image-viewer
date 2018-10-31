## 注意事项

1. **组件的进场和退场动画，依赖调用方传入相应图片的位置信息**，其中进场位置可通过 enterstart 事件接口传入，退场位置可通过 leavestart 事件接口传入，如果没有传入退场位置，组件会以图片渐隐的方式退场，具体可参考示例1；
2. 沉浸态的页码默认显示，可通过 hidePageNum 属性控制隐藏；
3. 对于无限下拉场景，可通过 append 接口追加图片。

## 示例

```atom 示例1：第一屏浏览功能

<template>
    <div class="c-container">
        <c-row>
            <c-span>
                <div class="img-wrapper" @click="onImgClick(0)">
                    <img :src="list[0].src">
                </div>
            </c-span>

            <c-span>
                <div class="img-wrapper" @click="onImgClick(1)">
                    <img :src="list[1].src">
                </div>
                <div class="img-wrapper c-gap-top" @click="onImgClick(2)">
                    <img :src="list[2].src">
                </div>
            </c-span>
        </c-row>

        <c-image-viewer
            a-if="showViewer"
            ref="viewer"
            :list="list"
            :startIndex="showIndex"
            :hideInfo="hideInfo"
            :hideToolbar="hideToolbar"
            :hidePageNum="hidePageNum"
            :isSwipeFirstLeave="false"
            @enterstart="beforeViewerEnter"
            @leavestart="beforeViewerLeave"
            @leave="onViewerLeave"
            @switch="onViewerSwitch"
            @swipefirst="onViewerSwipeFirst"
        >
            <!-- 自定义工具栏 -->
            <template slot="toolbar">
                <p
                    style="position: absolute; bottom: 0; width: 100%; text-align: center; line-height: .42rem;"
                >
                自定义功能区，3倍屏下高度126px
                </p>
            </template>
        </c-image-viewer>

        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': hideInfo}" @click="onChangeInfo">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangeInfo">{{ hideInfo ? '显示' : '隐藏' }}信息区</label>
        </div>
        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': hideToolbar}" @click="onChangeToolbar">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangeToolbar">{{ hideToolbar ? '显示' : '隐藏' }}功能区</label>
        </div>
        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': hidePageNum}" @click="onChangePageNum">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangePageNum">{{ hidePageNum ? '显示' : '隐藏' }}页码</label>
        </div>
    </div>
</template>

<script type="config">
    {
        data: {
            list: [
                {
                    src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3475871833,401230358&fm=27&gp=0.jpg",
                    width: 700,
                    height: 1280,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。",
                    anchor: {
                        text: "我是锚点",
                        url: "http://m.baidu.com/"
                    }
                },
                {
                    src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=359944356,195888032&fm=27&gp=0.jpg",
                    width: 1920,
                    height: 1200,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。"
                },
                {
                    src: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1451090914,4273211459&fm=27&gp=0.jpg",
                    width: 800,
                    height: 1142,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。"
                },
                {
                    src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2697325968,1688005489&fm=27&gp=0.jpg",
                    width: 1600,
                    height: 1200,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                },
                {
                    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3908584135,4101995779&fm=27&gp=0.jpg",
                    width: 1600,
                    height: 2400,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                }
            ],
            showIndex: 0,
            showViewer: false,
            hideInfo: false,
            hideToolbar: false,
            hidePageNum: false
        },
        components: {
            'c-row': 'search-ui/Row/Row',
            'c-span': 'search-ui/Row/Span',
            'c-image-viewer': 'search-ui/ImageViewer/ImageViewer'
        }
    }
</script>

<script>
    module.exports = {
        methods: {
            onImgClick(i) {
                this.showViewer = true;
                this.showIndex = i;
            },
            beforeViewerEnter(obj, animate) {
                if (typeof animate === 'function') {
                    let startEl = $(this.$el).find('.img-wrapper').get(obj.index);
                    animate(startEl);
                }
            },
            beforeViewerLeave(obj, animate) {
                if (typeof animate === 'function') {
                    let endEl = $(this.$el).find('.img-wrapper').get(obj.index);
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
            },
            onViewerSwipeFirst() {
                // alert('前面没有了，需要调用者处理');
            },
            onChangeInfo() {
                this.hideInfo = !this.hideInfo;
            },
            onChangeToolbar() {
                this.hideToolbar = !this.hideToolbar;
            },
            onChangePageNum() {
                this.hidePageNum = !this.hidePageNum;
            }
        }
    }
</script>

<style lang="less" scoped>
.img-wrapper {
    img {
        display: block;
        width: 100%;
    }
}
.feature-toggle-wrapper {
    font-size: 16px;
}
.feature-toggle-label {
    display: inline-block;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    margin-bottom: 1em;
    margin-left: 0.6em;
    -webkit-user-select: none;
            user-select: none;
}
.feature-toggle {
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin-left: 1em;
    margin-bottom: 1em;
    vertical-align: middle;
}
.feature-toggle > input {
    display: none;
}
.feature-toggle-bar-container {
    float: left;
    position: relative;
    display: inline-block;
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    width: 2em;
    padding: 0.2em 0px 0.2em 0.1em;
}
.feature-toggle-circle {
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px;
            box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    width: 1.2em;
    height: 1.2em;
    line-height: 2em;
    background-color: #fff;
}
.feature-toggle-bar {
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    width: 100%;
    height: 0.8em;
    border-radius: 30px;
    background-color: rgba(0, 0, 0, 0.258824);
}
.feature-toggle.state-checked .feature-toggle-circle {
    left: 45%;
    background-color: #009688;
}
.feature-toggle.state-checked .feature-toggle-bar {
    background-color: #009688;
    opacity: 0.4;
}
</style>
```

```atom 示例2：第二屏上拉功能

<template>
    <div class="c-container">
        <c-row>
            <c-span>
                <div class="img-wrapper" @click="onImgClick(0)">
                    <img :src="list[0].src">
                </div>
            </c-span>

            <c-span>
                <div class="img-wrapper" @click="onImgClick(1)">
                    <img :src="list[1].src">
                </div>
                <div class="img-wrapper c-gap-top" @click="onImgClick(2)">
                    <img :src="list[2].src">
                </div>
            </c-span>
        </c-row>

        <c-image-viewer
            a-if="showViewer"
            ref="viewer"
            :list="list"
            :startIndex="showIndex"
            :hideInfo="hideInfo"
            :hidePageNum="hidePageNum"
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
                    <p style="position: absolute; right: .17rem; bottom: .09rem; line-height: .24rem; font-size: .14rem;" @click="onClick">
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
        </c-image-viewer>
        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': hidePageNum}" @click="onChangePageNum">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangePageNum">{{ hidePageNum ? '显示' : '隐藏' }}页码</label>
        </div>
        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': hideInfo}" @click="onChangeInfo">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangeInfo">{{ hideInfo ? '显示' : '隐藏' }}信息区</label>
        </div>
    </div>
</template>

<script type="config">
    {
        data: {
            list: [
                {
                    src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3475871833,401230358&fm=27&gp=0.jpg",
                    width: 700,
                    height: 1280,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。",
                    anchor: {
                        text: "我是锚点",
                        url: "http://m.baidu.com/"
                    }
                },
                {
                    src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=359944356,195888032&fm=27&gp=0.jpg",
                    width: 1920,
                    height: 1200,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。"
                },
                {
                    src: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1451090914,4273211459&fm=27&gp=0.jpg",
                    width: 800,
                    height: 1142,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。"
                },
                {
                    src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2697325968,1688005489&fm=27&gp=0.jpg",
                    width: 1600,
                    height: 1200,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                },
                {
                    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3908584135,4101995779&fm=27&gp=0.jpg",
                    width: 1600,
                    height: 2400,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                }
            ],
            showIndex: 0,
            showViewer: false,
            hideInfo: true,
            hidePageNum: true
        },
        components: {
            'c-row': 'search-ui/Row/Row',
            'c-span': 'search-ui/Row/Span',
            'c-image-viewer': 'search-ui/ImageViewer/ImageViewer'
        }
    }
</script>

<script>
    module.exports = {
        methods: {
            onImgClick(i) {
                this.showViewer = true;
                this.showIndex = i;
            },
            beforeViewerEnter(obj, animate) {
                if (typeof animate === 'function') {
                    let startEl = $(this.$el).find('.img-wrapper').get(obj.index);
                    animate(startEl);
                }
            },
            beforeViewerLeave(obj, animate) {
                if (typeof animate === 'function') {
                    let endEl = $(this.$el).find('.img-wrapper').get(obj.index);
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

<style lang="less" scoped>
.img-wrapper {
    img {
        display: block;
        width: 100%;
    }
}
.feature-toggle-wrapper {
    font-size: 16px;
}
.feature-toggle-label {
    display: inline-block;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    margin-bottom: 1em;
    margin-left: 0.6em;
    -webkit-user-select: none;
            user-select: none;
}
.feature-toggle {
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin-left: 1em;
    margin-bottom: 1em;
    vertical-align: middle;
}
.feature-toggle > input {
    display: none;
}
.feature-toggle-bar-container {
    float: left;
    position: relative;
    display: inline-block;
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    width: 2em;
    padding: 0.2em 0px 0.2em 0.1em;
}
.feature-toggle-circle {
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px;
            box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    width: 1.2em;
    height: 1.2em;
    line-height: 2em;
    background-color: #fff;
}
.feature-toggle-bar {
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    width: 100%;
    height: 0.8em;
    border-radius: 30px;
    background-color: rgba(0, 0, 0, 0.258824);
}
.feature-toggle.state-checked .feature-toggle-circle {
    left: 45%;
    background-color: #009688;
}
.feature-toggle.state-checked .feature-toggle-bar {
    background-color: #009688;
    opacity: 0.4;
}
</style>
```

```atom 示例3：第1张是长图（228x680，横向撑满），第2张是长图（90x300，纵向撑满），第3张是小图（100x100，原尺寸显示），第4张是普通图片（500x313，横向撑满），第5张图有加载状态提示

<template>
    <div class="c-container">
        <c-row>
            <c-span>
                <div class="img-wrapper" @click="onImgClick(0)">
                    <img :src="list[0].src">
                </div>
            </c-span>

            <c-span>
                <div class="img-wrapper" @click="onImgClick(1)">
                    <img :src="list[1].src">
                </div>
                <div class="img-wrapper c-gap-top" @click="onImgClick(2)">
                    <img :src="list[2].src">
                </div>
            </c-span>
        </c-row>

        <c-image-viewer
            a-if="showViewer"
            :list="list"
            :startIndex="showIndex"
            :hideInfo="hideInfo"
            :hideToolbar="hideToolbar"
            @enterstart="beforeViewerEnter"
            @leavestart="beforeViewerLeave"
            @leave="onViewerLeave"
            @switch="onViewerSwitch"
        >
            <!-- 自定义工具栏 -->
            <template slot="toolbar">
                <p style="position: relative; width: 100%; text-align: center; line-height: .42rem;">自定义工具栏</p>
            </template>
        </c-image-viewer>
    </div>
</template>

<script type="config">
    {
        data: {
            list: [
                {
                    src: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1231613821,639063214&fm=27&gp=0.jpg",
                    width: 228,
                    height: 680,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                },
                {
                    src: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3417683066,1421423689&fm=27&gp=0.jpg",
                    width: 90,
                    height: 300,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。"
                },
                {
                    src: "https://cambrian-images.cdn.bcebos.com/c10abfcab76a05742aaac8cf209abe10_1527168418164.jpeg@w_100,h_100",
                    width: 100,
                    height: 100,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。"
                },
                {
                    src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=359944356,195888032&fm=27&gp=0.jpg",
                    width: 500,
                    height: 313,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                },
                {
                    src: "https://timgsa.baidu.com/timg?image&quality=80&imgtype=0&size=b10000_10000&sec=1533644795&di=8012e779d87b3c85bc06538bf7d1711f&src=http%3A%2F%2Ftupian.enterdesk.com%2F2014%2Fmxy%2F09%2F12%2F2%2F1.jpg",
                    width: 1920,
                    height: 1200,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。"
                }
            ],
            showIndex: 0,
            showViewer: false,
            hideInfo: false,
            hideToolbar: false
        },
        components: {
            'c-row': 'search-ui/Row/Row',
            'c-span': 'search-ui/Row/Span',
            'c-image-viewer': 'search-ui/ImageViewer/ImageViewer'
        }
    }
</script>

<script>
    module.exports = {
        methods: {
            onImgClick(i) {
                this.showViewer = true;
                this.showIndex = i;
            },
            beforeViewerEnter(obj, animate) {
                if (typeof animate === 'function') {
                    let startEl = $(this.$el).find('.img-wrapper img').get(obj.index);
                    animate(startEl);
                }
            },
            beforeViewerLeave(obj, animate) {
                if (typeof animate === 'function') {
                    let endEl = $(this.$el).find('.img-wrapper img').get(obj.index);
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
</script>

<style lang="less" scoped>
.img-wrapper {
    img {
        display: block;
        max-width: 100%;
    }
}
</style>
```

```atom 示例4：自定义翻页策略

<template>
    <div class="c-container">
        <c-row>
            <c-span>
                <div class="img-wrapper" @click="onImgClick(0)">
                    <img :src="list[0].src">
                </div>
            </c-span>

            <c-span>
                <div class="img-wrapper" @click="onImgClick(1)">
                    <img :src="list[1].src">
                </div>
                <div class="img-wrapper c-gap-top" @click="onImgClick(2)">
                    <img :src="list[2].src">
                </div>
            </c-span>
        </c-row>

        <c-image-viewer
            a-if="showViewer"
            ref="viewer"
            :list="list"
            :startIndex="showIndex"
            :hideInfo="hideInfo"
            :hideToolbar="hideToolbar"
            :hidePageNum="hidePageNum"
            :isSwipeFirstLeave="false"
            :easySwipe="easySwipe"
            :swipeDuration="swipeDuration"
            @enterstart="beforeViewerEnter"
            @leavestart="beforeViewerLeave"
            @leave="onViewerLeave"
            @switch="onViewerSwitch"
            @swipefirst="onViewerSwipeFirst"
        >
            <!-- 自定义工具栏 -->
            <template slot="toolbar">
                <p
                    style="position: absolute; bottom: 0; width: 100%; text-align: center; line-height: .42rem;"
                >
                自定义功能区，3倍屏下高度126px
                </p>
            </template>
        </c-image-viewer>

        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': swipeDuration === 200}" @click="onChangeSwipeDuration">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangeSwipeDuration">翻页时间改成{{ swipeDuration === 200 ? '默认' : '200ms' }}</label>
        </div>

        <div class="c-row-tile feature-toggle-wrapper">
            <div class="feature-toggle" :class="{'state-checked': easySwipe}" @click="onChangeEasySwipe">
                <div class="feature-toggle-bar-container">
                    <div class="feature-toggle-bar" />
                    <div class="feature-toggle-circle" />
                </div>
            </div>
            <label class="feature-toggle-label" @click="onChangeEasySwipe">翻页{{ easySwipe ? '' : '不' }}判断时间</label>
        </div>
    </div>
</template>

<script type="config">
    {
        data: {
            list: [
                {
                    src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3475871833,401230358&fm=27&gp=0.jpg",
                    width: 700,
                    height: 1280,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。",
                    anchor: {
                        text: "我是锚点",
                        url: "http://m.baidu.com/"
                    }
                },
                {
                    src: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=359944356,195888032&fm=27&gp=0.jpg",
                    width: 1920,
                    height: 1200,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。"
                },
                {
                    src: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1451090914,4273211459&fm=27&gp=0.jpg",
                    width: 800,
                    height: 1142,
                    desc: "杨幂，1986年9月12日出生于北京市，中国内地影视女演员、流行乐歌手、影视制片人。2005年，杨幂进入北京电影学院表演系本科班就读。"
                },
                {
                    src: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2697325968,1688005489&fm=27&gp=0.jpg",
                    width: 1600,
                    height: 1200,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                },
                {
                    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3908584135,4101995779&fm=27&gp=0.jpg",
                    width: 1600,
                    height: 2400,
                    desc: "2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。2006年，杨幂因出演金庸武侠剧《神雕侠侣》而崭露头角。"
                }
            ],
            showIndex: 0,
            showViewer: false,
            hideInfo: false,
            hideToolbar: false,
            hidePageNum: false,
            swipeDuration: 0,
            easySwipe: false
        },
        components: {
            'c-row': 'search-ui/Row/Row',
            'c-span': 'search-ui/Row/Span',
            'c-image-viewer': 'search-ui/ImageViewer/ImageViewer'
        }
    }
</script>

<script>
    module.exports = {
        methods: {
            onImgClick(i) {
                this.showViewer = true;
                this.showIndex = i;
            },
            beforeViewerEnter(obj, animate) {
                if (typeof animate === 'function') {
                    let startEl = $(this.$el).find('.img-wrapper').get(obj.index);
                    animate(startEl);
                }
            },
            beforeViewerLeave(obj, animate) {
                if (typeof animate === 'function') {
                    let endEl = $(this.$el).find('.img-wrapper').get(obj.index);
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
            },
            onViewerSwipeFirst() {
                // alert('前面没有了，需要调用者处理');
            },
            onChangeSwipeDuration() {
                this.swipeDuration = 200 - this.swipeDuration;
            },
            onChangeEasySwipe() {
                this.easySwipe = !this.easySwipe;
            }
        }
    }
</script>

<style lang="less" scoped>
.img-wrapper {
    img {
        display: block;
        width: 100%;
    }
}
.feature-toggle-wrapper {
    font-size: 16px;
}
.feature-toggle-label {
    display: inline-block;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    margin-bottom: 1em;
    margin-left: 0.6em;
    -webkit-user-select: none;
            user-select: none;
}
.feature-toggle {
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin-left: 1em;
    margin-bottom: 1em;
    vertical-align: middle;
}
.feature-toggle > input {
    display: none;
}
.feature-toggle-bar-container {
    float: left;
    position: relative;
    display: inline-block;
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    width: 2em;
    padding: 0.2em 0px 0.2em 0.1em;
}
.feature-toggle-circle {
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px;
            box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    width: 1.2em;
    height: 1.2em;
    line-height: 2em;
    background-color: #fff;
}
.feature-toggle-bar {
    -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    width: 100%;
    height: 0.8em;
    border-radius: 30px;
    background-color: rgba(0, 0, 0, 0.258824);
}
.feature-toggle.state-checked .feature-toggle-circle {
    left: 45%;
    background-color: #009688;
}
.feature-toggle.state-checked .feature-toggle-bar {
    background-color: #009688;
    opacity: 0.4;
}
</style>
```

## API

### Props

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

#### 其中 list 数组里对象的详细字段：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| src               | 图片链接   |String||是|
| width             | 图片宽度   |Number||是|
| height            | 图片高度   |Number||是|
| desc              | 图片描述   |String|空|否|
| setNum            | 如果是套图，填写套图内图片数量   |Number|0|否|
| setList           | 如果是套图，填写套图内图片数据（字段包含src, width, height）   |Array|空|否|

### Methods

| 名称               | 说明                                | 参数     | 返回值        |
|-------------------|-------------------------------------|----------|--------------|
| append            | 追加图片       |list: Array|@return Boolean|
| updateList        | 更新列表中的部分图片    |startIndex: Number, list: Array|@return Boolean|
| updateItem        | 更新图片的部分字段    |index: Number, setIndex: Number, data: Object|@return Boolean|
| updateSetInfo     | 更新图片的套图数据    |index: Number, setInfo: Object|@return Boolean|
| showSecondScreen  | 上滑显示第二屏   |无|@return Boolean|
| close             | 关闭组件（一般不需要调用）   |无|@return Boolean|

#### 其中 append 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| list             | 图片列表（字段包含src, width, height）   |Array||是|

#### 其中 updateList 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| startIndex       | 起始index   |Number||是|
| list             | 图片列表（字段包含src, width, height等）   |Array||是|

#### 其中 updateItem 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| index          | 图片index   |Number||是|
| setIndex       | 套图内index，不是套图就写0   |Number||是|
| data             | 要更新的字段和值   |Object||是|

#### 其中 updateSetInfo 接口的参数：

| 名称               | 说明                                | 类型     | 默认值        |  必选 |
|-------------------|-------------------------------------|----------|--------------|------|
| index               | 图片index   |Number||是|
| setInfo             | 套图   |Object||是|
| ---list             | 套图图片（字段包含src, width, height等）   |Array||是|

### Slots

| 名称               | 描述             |
| ------------------|------------------|
| info              | 信息区 slot |
| toolbar           | 功能区 slot |
| anchor            | 锚点 slot |
| secondScreen      | 第二屏 slot |

### Events

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

#### enterstart 事件附带参数示例：
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

#### enter 事件附带参数示例：
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

#### leavestart 事件附带参数示例：
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

#### leave 事件附带参数示例：
```
params[0] = {
    index: 0,   // 当前展示图片序号
    setIndex: 0,   // 套图内序号，一般为0
    type: 'close-button' // 退场类型："close-button"关闭按钮退场、"close"关闭接口退场、"swipe-down"下拉退场、"swipe-first"第一张图右滑退场。
};
```

#### switch 事件附带参数示例：
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

#### imgclick 事件附带参数示例：
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

#### secondscreenshow 事件附带参数示例：
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

#### secondscreenhide 事件附带参数示例：
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
