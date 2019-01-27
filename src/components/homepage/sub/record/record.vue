<template>
    <div class='record'>
        <FunctionalHeader :title='title' @back='back'></FunctionalHeader>
        <tabswiper :tabContent='tabs' :componentList='componentList' :defaultIndex='defaultIndex' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import tabswiper from 'base/swiper/tabswiper'
    import weekrecord from './week-record.vue'
    import allrecord from './all-record.vue'
    import { playlistMixin } from 'common/js/mixins'
    const componentList = [
        {
            name: 'weekrecord',
            component: weekrecord
        },
        {
            name: 'allrecord',
            component: allrecord
        }
    ]
    export default {
        name: 'record',
        mixins: [ playlistMixin ],
        components: {
            tabswiper,
            FunctionalHeader
        },
        props: {
            title: {
                type: String
            }
        },
        data() {
            return {
                tabs: [
                    {
                        text: '最近一周'
                    },
                    {
                        text: '所有时间'
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
    .record
        position: fixed
        left: 0
        top: 0
        right: 0
        bottom: 0
        z-index: 7900
        background: $color-background
</style>