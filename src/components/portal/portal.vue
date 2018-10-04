<template>
    <div>
        <Header @clickTab='clickTab'></Header>
        <swiper :componentList='componentList' :defaultIndex='1' :height='swiperHeight' ref='swiper'></swiper>
    </div>
</template>
<script>
    import Header from 'components/header/header'
    import music from 'components/music/music'
    import mine from 'components/mine/mine'
    import video from 'components/video/video'
    import swiper from 'base/swiper/swiper'
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
                swiperHeight: window.innerHeight - 44
            }
        },
        methods: {
            clickTab(index) {
                this.$refs.swiper.swipeTo(index)
            }
        }
    }
</script>