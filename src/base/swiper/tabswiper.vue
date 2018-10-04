<template>
    <div>
        <tabs :content='tabContent' :defaultIndex='defaultIndex' ref='tabs' class='tabs' @click='clickTab'></tabs>
        <div class='marker' ref='marker'></div>
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
            }
        },
        data() {
            return {
                tabDistance: 0,
                touch: {},
                curIndex: this.defaultIndex,
                currentMarkerPosition: 0,
                marker: null
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            getTabDistance() {
                const tabs = this.$el.getElementsByClassName('tab-text')
                const tab0 = tabs[0]
                const tab1 = tabs[1]
                const tab0Median = (tab0.getBoundingClientRect().left + tab0.getBoundingClientRect().right) / 2
                const tab1Median = (tab1.getBoundingClientRect().left + tab1.getBoundingClientRect().right) / 2
                this.tabDistance = tab1Median - tab0Median
                this.setMarkerPosition(tab0Median)
            },
            setMarkerPosition(tab0Median) {
                this.currentMarkerPosition = tab0Median - this.marker.offsetWidth / 2 + this.defaultIndex * this.tabDistance
                translate(this.marker,this.currentMarkerPosition)
            },
            clickTab(index) {
                const diff = index - this.curIndex
                this.currentMarkerPosition = this.currentMarkerPosition + diff * this.tabDistance
                translate(this.marker,this.currentMarkerPosition)
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
                const moveDistance = -diff/window.innerWidth * this.tabDistance 
                translate(this.marker, moveDistance + this.currentMarkerPosition)
            },
            touchend(diff) {
                if(!this.touch.initiated) {
					return
				}
                const direction = Math.sign(diff)
                this.curIndex = this.curIndex - direction
                this.$refs.tabs.setActiveStyle(this.curIndex)
                const moveDistance = -diff/window.innerWidth * this.tabDistance
                const duration = 200
                translate(this.marker, moveDistance + this.currentMarkerPosition, 0, {
					transitionDuration: duration + 'ms'
                })
                setTimeout(() => {
                    this.currentMarkerPosition = moveDistance + this.currentMarkerPosition
                },duration)
                this.touch = {}
            }
        },
        created() {

        },
        mounted() {
            this.$refs.swiper.$on('updatetouchstart',this.touchstart)
            this.$refs.swiper.$on('updatetouchmove',this.touchmove)
            this.$refs.swiper.$on('updatetouchend',this.touchend)
            this.marker = this.$refs.marker
            this.getTabDistance()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .tabs
        background: $color-theme
    .marker
        position: absolute
        top: 36px
        left: 0
        width: 35px
        border: 1px solid $color-background
</style>