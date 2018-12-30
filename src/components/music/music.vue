<template>
    <div>
        <tabswiper :tabContent='musicHeader' :componentList='componentList' :defaultIndex='defaultIndex' :swiperHeight='swiperHeight'></tabswiper>
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
                        text: '推荐'
                    },
                    {
                        text: '歌手'
                    },
                    {
                        text: '电台'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight - 54 - 44,
                defaultIndex: 1
            }
        }
    }
</script>