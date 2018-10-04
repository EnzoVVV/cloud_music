<template>
    <div>
        <Header @clickTab='clickTab' :defaultIndex='defaultIndex'></Header>
        <swiper :componentList='componentList' :defaultIndex='defaultIndex' :height='swiperHeight' ref='swiper'></swiper>
    </div>
</template>
<script>
    import Header from 'components/header/header'
    import music from 'components/music/music'
    import mine from 'components/mine/mine'
    import video from 'components/video/video'
    import swiper from 'base/swiper/swiper'
    import { findComponentDownward } from 'common/js/tools'
    const componentList = [
        {
            component: mine,
            name: 'mine'
        },
        {
            component: music,
            name: 'music'
        },
        {
            component: video,
            name: 'video'
        }
    ]
    export default {
        name: 'portal',
        components: {
            swiper,
            Header
        },
        data() {
            return {
                componentList: componentList,
                swiperHeight: window.innerHeight - 44,
                defaultIndex: 1,
                curIndex: 1,
                tabs: null
            }
        },
        methods: {
            clickTab(index) {
                this.curIndex = index
                this.$refs.swiper.swipeTo(index)
            },
            touchend(diff) {
                const direction = Math.sign(diff)
                this.curIndex = this.curIndex - direction
                this.tabs.setActiveStyle(this.curIndex)
            },
            getTabs() {
                this.tabs = findComponentDownward(this,'tabs')
            }
        },
        created() {
            this.curIndex = this.defaultIndex
        },
        mounted() {
            this.$refs.swiper.$on('updatetouchend',this.touchend)
            this.getTabs()
        }
    }
</script>