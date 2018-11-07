<template>
  <div class="previewer">
    <a
      class="edit-link"
      target="_blank"
      v-if="!$page.frontmatter.home && $page.frontmatter.previewLink"
      :href="editLink">
      Edit in JSFiddle
    </a>
    <div class="previewer-content">
      <!-- add a wrapper to prevent overflow hidden property effect box-shadow -->
      <div class="iframe-wrapper" v-if="$page.frontmatter.previewLink">
        <!-- <img src="../assets/images/demo.gif" frameborder="0"></img> -->
      <video width="312" height="623" controls="controls" autoplay="autoplay">
          <source src="../assets/images/demo2.mp4" type="audio/ogg">
          <source src="../assets/images/demo2.mp4" type="audio/mpeg">
          你的浏览器不支持audio标签
        </video>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Previewer',
  computed: {
    editLink() {
      return this.$page.frontmatter.previewLink && this.$page.frontmatter.previewLink.replace(/embedded.*$/, '');
    },
  },
};
</script>

<style lang="stylus" scoped>
@require '../styles/config';

.previewer
  $ratio = 1425/700

  position relative
  width $s-preview-width
  height $s-preview-width * $ratio
  background url('../assets/images/16th-mockup.png') no-repeat center/100%

  .edit-link
    position absolute
    top 94px
    right 100%
    font-size 0.9rem
    font-weight normal
    writing-mode vertical-lr

    &:not(:hover)
      color #ccc

  .previewer-content
    $s-vertical = 28px
    $s-horizontal = 11px

    position absolute
    z-index 1
    top $s-vertical
    bottom $s-vertical
    left $s-horizontal
    right $s-horizontal
    background-color #fff
    box-shadow 0 0 0 1.5px rgba(0,0,0,0.8)
    border-radius 32px

    .iframe-wrapper
      position relative
      width 100%
      height 100%
      border-radius 32px
      overflow hidden

      iframe
        margin-top -50px
        width 100%
        height calc(100% + 50px)
</style>
