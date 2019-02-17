<template>
    <div>
        <tabswiper :tabContent='musicHeader' :componentList='componentList' :defaultIndex='0' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import recommend from 'components/recommend/recommend'
    const singer = () => import('components/singer/singer')
    const feeds = () => import('components/feeds/feeds')
    import tabswiper from 'base/swiper/tabswiper'
    const componentList = [
        {
            name: 'recommend',
            component: recommend
        },
        {
            name: 'feeds',
            component: feeds
        },
        {
            name: 'singer',
            component: singer
        }
    ]
    export default {
        name: 'music',
        components: {
            tabswiper
        },
        data() {
            return {
                musicHeader: [
                    {
                        text: '推荐'
                    },
                    {
                        text: '动态'
                    },
                    {
                        text: '歌手'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight - 54 - 44
            }
        }
    }
</script>