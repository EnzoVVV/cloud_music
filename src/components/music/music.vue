<template>
    <div>
        <tabswiper :tabContent='musicHeader' :componentList='componentList' :defaultIndex='defaultIndex' :swiperHeight='swiperHeight' :showMarker='true'></tabswiper>
    </div>
</template>
<script>
    import recommend from 'components/recommend/recommend'
    import singer from 'components/singer/singer'
    import radio from 'components/radio/radio'
    import tabswiper from 'base/swiper/tabswiper'
    const componentList = [
        {
            name: 'recommend',
            component: recommend
        },
        {
            name: 'singer',
            component: singer
        },
        {
            name: 'radio',
            component: radio
        }
    ]
    export default {
        name: 'music',
        components: {
            tabswiper
        },
        props: {

        },
        data() {
            return {
                musicHeader: [
                    {
                        text: '推荐',
                        to: '/music/recommend'
                    },
                    {
                        text: '歌手',
                        to: '/music/singer'
                    },
                    {
                        text: '电台',
                        to: '/music/radio'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight - 54 - 44,
                defaultIndex: 1
            }
        }
    }
</script>