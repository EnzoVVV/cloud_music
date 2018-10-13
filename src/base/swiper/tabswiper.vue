<template>
    <div>
        <tabs :content='tabContent' :defaultIndex='defaultIndex' :showMarker='showMarker' ref='tabs' class='tabs' @click='clickTab'></tabs>
        <swiper :componentList='componentList' :defaultIndex='defaultIndex' :height='swiperHeight' ref='swiper'></swiper>
    </div>
</template>
<script>
    import tabs from 'base/tabs/tabs'
    import swiper from 'base/swiper/swiper'
    import { translate, transform, transitionDuration } from 'common/js/dom.js'
    export default {
        name: 'tabswiper',
        components: {
            tabs,
            swiper
        },
        props: {
            tabContent: {
                type: Array
            },
            componentList: {
                type: Array
            },
            defaultIndex: {
                type: Number,
                default: 0
            },
            swiperHeight: {
                type: Number,
                default: 0
            },
            showMarker: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                touch: {},
                curIndex: this.defaultIndex
            }
        },
        methods: {
            clickTab(index) {
                this.$refs.swiper.swipeTo(index)
                this.curIndex = index
            },
            touchstart() {
                this.touch.initiated = true
            },
            touchmove(diff) {
                if(!this.touch.initiated) {
					return
				}
                this.$refs.tabs.swiping(diff)
            },
            touchend(diff) {
                if(!this.touch.initiated) {
					return
				}
                const direction = Math.sign(diff)
                this.curIndex = this.curIndex - direction
                this.$refs.tabs.setActiveStyle(this.curIndex)
                this.$refs.tabs.swiping(diff, 200, this.curIndex)
                this.touch = {}
            }
        },
        mounted() {
            this.$refs.swiper.$on('updatetouchstart',this.touchstart)
            this.$refs.swiper.$on('updatetouchmove',this.touchmove)
            this.$refs.swiper.$on('updatetouchend',this.touchend)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .tabs
        background: $color-theme
</style>