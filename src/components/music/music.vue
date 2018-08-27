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
    export default {
        name: 'music',
        components: {
            tabs
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
                        text: '朋友',
                        to: '/music/friends'
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