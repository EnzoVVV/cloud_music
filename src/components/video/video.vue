<template>
    <tabswiper :tabContent='tabs' :componentList='componentList' :defaultIndex='0' :swiperHeight='swiperHeight'></tabswiper>
</template>
<script>
    import tabswiper from 'base/swiper/tabswiper'
    const recommendMV = () => import('./sub-components/recommend-mv')
    const freshMV = () => import('./sub-components/fresh-mv')
    const componentList = [
        {
            name: 'recommendMV',
            component: recommendMV
        },
        {
            name: 'freshMV',
            component: freshMV
        }
    ]
    export default {
        name: 'videoviewer',
        components: {
            tabswiper
        },
        data() {
            return {
                tabs: [
                    {
                        text: '推荐'
                    },
                    {
                        text: '最新'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight - 54 - 44
            }
        }
    }
</script>