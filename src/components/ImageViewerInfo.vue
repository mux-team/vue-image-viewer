<template>
    <div class="image-viewer-info">
        <div ref="content" class="image-viewer-info-content text">
            <p
                :style="{'-webkit-line-clamp': clampNum}"
                class="image-viewer-info-clamp"
                @click="onTextClick($event)"
            >
                <span class="image-viewer-info-index">{{obj.index + 1}}</span>
                <span v-show="count > 0" class="image-viewer-info-total">/{{count}}</span>
                {{obj.desc}}
            </p>
        </div>

        <!-- 辅助元素 -->
        <div ref="hidden" class="image-viewer-info-hidden text">
            <p
                :style="{'-webkit-line-clamp': clampNumHidden}"
                class="image-viewer-info-clamp"
            >
                <span class="image-viewer-info-index">{{obj.index + 1}}</span>
                <span v-show="count > 0" class="image-viewer-info-total">/{{count}}</span>
                {{obj.desc}}
            </p>
        </div>
    </div>
</template>

<script type="config">
import AnimateConfig from '../common/animate-config.js';
import {cssAnimate} from '../common/animate.js';
import util from '../common/util.js';

export default {
    props: {
        obj: {
            type: Object,
            required: true
        },
        count: {
            type: Number,
            default: 0
        },
        isVisible: {
            type: Boolean,
            default: true
        },
        innerWidth: {
            type: Number,
            default: 0
        },
        innerHeight: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            clampNum: this.innerWidth > this.innerHeight ? 3 : 6,
            clampNumHidden: this.innerWidth > this.innerHeight ? 7 : 13
        }
    },
    computed: {
        defaultLineNum: function() {
            return this.innerWidth > this.innerHeight ? 3 : 6;
        }
    },
    watch: {
        obj() {
            // 恢复默认6行，有动画
            if (this.clampNum !== this.defaultLineNum && this.isVisible) {
                let height = this.$refs.content.getBoundingClientRect().height;
                let clonedEl = this.$refs.content.cloneNode(true);

                // 固定高度
                util.setCss(this.$el, {
                    height: height + 'px'
                });

                // 前插拷贝元素
                this.$el.insertBefore(clonedEl, this.$refs.content);

                // 更新行数
                this.clampNum = this.defaultLineNum;
                this.clampNumHidden = this.maxLineNum;

                this.$nextTick(() => {
                    // 数据更新后的高度
                    let newHeight = this.$refs.content.getBoundingClientRect().height;

                    cssAnimate(this.$el, {
                        height: newHeight + 'px'
                    }, {
                        duration: AnimateConfig.duration.infoCollapse,
                        ease: AnimateConfig.transition['ease-in-out']
                    }).then(() => {
                        // 移除拷贝元素
                        this.$el.removeChild(clonedEl);

                        // 恢复样式
                        util.setCss(this.$el, {
                            height: ''
                        });
                    });
                });
            }
            // 恢复默认6行，没有动画
            else if (this.clampNum !== this.defaultLineNum) {
                // 更新行数
                this.clampNum = this.defaultLineNum;
                this.clampNumHidden = this.maxLineNum;
            }
        },
        defaultLineNum(newVal, oldVal) {
            // 未展开状态
            if (this.clampNum === oldVal) {
                this.clampNum = this.defaultLineNum;
                this.clampNumHidden = this.maxLineNum;
            }
            // 展开状态
            else {
                this.clampNum = this.maxLineNum;
                this.clampNumHidden = this.defaultLineNum;
            }
        }
    },
    mounted() {
        // iphone5展开12行，默认13行
        let isIphone5 = /iPhone/.test(navigator.userAgent)
            && Math.min(window.innerHeight, window.innerWidth) <= 320;
        this.maxLineNum = isIphone5 ? 12 : 13;
        this.clampNumHidden = this.maxLineNum;
    },
    methods: {
        onTextClick(event) {
            let height = this.$refs.content.getBoundingClientRect().height;
            let newHeight = this.$refs.hidden.getBoundingClientRect().height;

            // 优化性能，高度不变时不需要动画
            if (Math.abs(height - newHeight) < 10) {
                return;
            }

            // 固定高度
            util.setCss(this.$el, {
                height: height + 'px'
            });

            // 高度增加
            if (this.clampNum === this.defaultLineNum) {
                // 互换
                this.clampNum = this.maxLineNum;
                this.clampNumHidden = this.defaultLineNum;

                this.$nextTick(() => {
                    cssAnimate(this.$el, {
                        height: newHeight + 'px'
                    }, {
                        duration: AnimateConfig.duration.infoExpand,
                        ease: AnimateConfig.transition['ease-in-out']
                    }).then(() => {
                        // 恢复样式
                        util.setCss(this.$el, {
                            height: ''
                        });
                    });
                });
            }
            // 高度减小
            else {
                cssAnimate(this.$el, {
                    height: newHeight + 'px'
                }, {
                    duration: AnimateConfig.duration.infoCollapse,
                    ease: AnimateConfig.transition['ease-in-out']
                }).then(() => {
                    // 互换
                    this.clampNum = this.defaultLineNum;
                    this.clampNumHidden = this.maxLineNum;

                    this.$nextTick(() => {
                        // 恢复样式
                        util.setCss(this.$el, {
                            height: ''
                        });
                    });
                });
            }

        }
    }
};
</script>

<style lang="stylus" scoped>
.image-viewer-info
    position relative
    margin-bottom 20px
    overflow hidden

    p
        -webkit-user-select none
        user-select none


    .text
        font-size 16px
        line-height 24px
        color #e8e8e8



.image-viewer-info-content
    box-sizing border-box
    padding 16px 17px 0
    overflow hidden


.image-viewer-info-hidden
    position absolute
    left 100%
    top 0
    width 100%
    box-sizing border-box
    padding 16px 17px 0
    overflow hidden


.image-viewer-info-clamp
    display -webkit-box
    overflow hidden
    white-space normal
    text-overflow ellipsis
    -webkit-box-orient vertical


.image-viewer-info-index
    margin-right 8px


.image-viewer-info-total
    margin-left -8px
    margin-right 8px

</style>
