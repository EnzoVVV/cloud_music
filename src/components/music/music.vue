<template>
    <div>
        <tabs :content='musicHeader' class='music-tabs'></tabs>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
    import tabs from 'base/tabs/tabs'
    import recommend from 'components/recommend/recommend'
    export default {
        name: 'music',
        components: {
            tabs,
            recommend
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
                ]
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {

        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .music-tabs
        background: $color-theme
</style>