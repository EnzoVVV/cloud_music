<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import { addClass } from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        slider: null,
        dots: [],
        currentPageIndex: 0,
        // slot里的项
        content: null
      }
    },
    mounted() {
        this.initSlotContentStyle()
        this.initDots()
    },
    methods: {
      initSlotContentStyle() {
        this.content = this.$refs.sliderGroup.children
        let sliderWidth = this.$refs.slider.clientWidth
        let width = sliderWidth * this.content.width
        for (let i = 0; i < this.content.length; i++) {
          let item = this.content[i]
          addClass(item, 'slider-item')
          item.style.width = sliderWidth + 'px'
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      initDots() {
        this.dots = new Array(this.content.length)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>