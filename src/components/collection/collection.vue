<template>
    <div class='collection'>
        <FunctionalHeader title='我的收藏' sbph='专辑 歌手' :showSearch='true' @back='back' @search='search'></FunctionalHeader>
        <tabswiper :tabContent='tabs' :componentList='componentList' :defaultIndex='defaultIndex' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    const albumCollection = () => import('./sub-components/album-collection')
    import tabswiper from 'base/swiper/tabswiper'
    const componentList = [
        {
            name: 'albumCollection',
            component: albumCollection
        }
    ]
    export default {
        name: 'collection',
        components: {
            tabswiper,
            FunctionalHeader
        },
        props: {
            
        },
        data() {
            return {
                tabs: [
                    {
                        text: '专辑'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight,
                defaultIndex: 0
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            search(query) {
                this.$bus.emit('collection-search', query)
            },
            back() {
                this.$emit('back')
            }
        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .collection
        position: fixed
        left: 0
        top: 0
        right: 0
        bottom: 0
        z-index: 6000
        background: $color-background
</style>