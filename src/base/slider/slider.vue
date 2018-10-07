<template>
  <div class="slider" ref="slider" @touchstart='touchstart'>
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
      },
      threshold: {
        type: Number,
        default: 0.3
      },
      speed: {
        type: Number,
        default: 300
      }
    },
    data() {
      return {
        slider: null,
        dots: [],
        currentPageIndex: 0,
        // slot里的项
        content: null,
        timer: null
      }
    },
    mounted() {
      setTimeout(() => {
        this.init()
      },20)
      window.addEventListener('resize',() => {
        if(!this.slider) {
          return
        }
        this.initSlotContentStyle(true)
        this.slider.refresh()
      })
    },
    methods: {
      init() {
        this.initSlotContentStyle()
        this.initDots()
        this.initSlider()
        if(this.autoPlay) {
          this.play()
        }
      },
      initSlotContentStyle(isResize) {
        this.content = this.$refs.sliderGroup.children
        let sliderWidth = this.$refs.slider.clientWidth
        let width = sliderWidth * this.content.length
        for (let i = 0; i < this.content.length; i++) {
          let item = this.content[i]
          addClass(item, 'slider-item')
          item.style.width = sliderWidth + 'px'
        }
        // why为啥resize时不需要加宽度了?
        if(this.loop && !isResize) {
          width += sliderWidth * 2
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      initDots() {
        this.dots = new Array(this.content.length)
      },
      initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: this.threshold,
            speed: this.speed
          }
          // bounce: false,
          // stopPropagation: true,
          // click: this.click
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          if(this.autoPlay) {
            this.play()
          }
        })
      },
      play() {
        this.clearTimer()
        // 这里要用setTimeout，因为自动滑动一次后，也会触发scrollEnd,又调用了play函数
        this.timer = setTimeout(() => {
          this.slider.next()
        },this.interval)
      },
      // 阻止事件冒泡，解决recommend组件滑动slider的时候也同时触发了页面swipe的问题
      // recommend组件，滑动slider的时候，外层swiper接收不到touchstart事件
      // slider的滑动，外层swiper能接收到touchmove事件，因为这里没有阻止touchmove冒泡
      // 但是swiper组件的touchmove函数会检测iniatied，就被return了
      touchstart(e) {
        e.stopPropagation()
      },
      clearTimer() {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    beforeDestroy() {
      this.clearTimer()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position: relative
    overflow: hidden
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
          border-radius: 5px
          background: $color-highlight-background
</style>