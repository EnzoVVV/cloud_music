<template>
    <div class='follow'>
        <FunctionalHeader :title='title' @back='back'></FunctionalHeader>
        <tabswiper :tabContent='tabs' :componentList='componentList' :defaultIndex='defaultIndex' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import tabswiper from 'base/swiper/tabswiper'
    const following = () => import('./following.vue')
    const follower = () => import('./follower.vue')
    const componentList = [
        {
            name: 'following',
            component: following
        },
        {
            name: 'follower',
            component: follower
        }
    ]
    export default {
        name: 'follow',
        components: {
            tabswiper,
            FunctionalHeader
        },
        props: {
            defaultIndex: {
                type: Number,
                default: 0
            },
            title: {
                type: String,
                default: 'TA的好友'
            }
        },
        data() {
            return {
                tabs: [
                    {
                        text: '关注'
                    },
                    {
                        text: '粉丝'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight
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
            this.$emit('mountedCalled')
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .follow
        position: fixed
        left: 0
        top: 0
        right: 0
        bottom: 0
        z-index: 7700
        background: $color-background
</style>