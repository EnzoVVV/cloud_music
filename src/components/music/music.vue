<template>
    <div>
        <tabswiper :tabContent='musicHeader' :componentList='componentList' :defaultIndex='0' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import recommend from 'components/recommend/recommend'
    const singer = () => import('components/singer/singer')
    const radio = () => import('components/radio/radio')
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
                swiperHeight: window.innerHeight - 54 - 44
            }
        }
    }
</script>