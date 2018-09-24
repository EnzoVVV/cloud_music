<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn" ref='progressButton'></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { transform } from 'common/js/dom'
  import { mapGetters } from 'vuex'
  const progressBtnWidth = 16

  export default {
    name: 'progressbar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        barWidth: 0,
        progressWidth: 0
      }
    },
    computed: {
      ...mapGetters([
          'currentSong'
      ]),
    },
    created() {
      this.touch = {}
    },
    mounted() {
      // player.vue随App.vue加载，此时v-show='false'，获取不到宽度， 在watch currentSong时计算宽度
      // this.barWidth = this.$refs.progressBar.clientWidth
      // this.progressWidth = this.barWidth - this.btnWidth
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        // const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        const offsetWidth = Math.min(this.progressWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
        this.$emit('percentChanging', this._getPercent())
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      setProgressOffset(percent) {
        if (percent >= 0 && !this.touch.initiated) {
          const offsetWidth = percent * this.progressWidth
          // const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          // const offsetWidth = percent * barWidth
          this._offset(offsetWidth)
        }
      },
      _triggerPercent() {
        this.$emit('percentChange', this._getPercent())
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _getPercent() {
        console.log('this.$refs.progress.clientWidth is ',this.$refs.progress.clientWidth)
        console.log('this.progressWidth is ',this.progressWidth)
        console.log('percent is ',this.$refs.progress.clientWidth / this.progressWidth)
        // const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        return this.$refs.progress.clientWidth / this.progressWidth
      }
    },
    watch: {
      percent(newPercent) {
        this.setProgressOffset(newPercent)
      },
      currentSong(song) {
        if(this.barWidth != 0 && this.progressWidth != 0) {
          return
        }
        this.barWidth = this.$refs.progressBar.clientWidth
        this.progressWidth = this.barWidth - progressBtnWidth
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-background
          border-radius: 50%
          background: $color-text
</style>
