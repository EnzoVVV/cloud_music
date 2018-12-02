<template>
    <div class='videolist'>
        <scroll class='wrapper'>
            <ul>
                <li v-for='video in videolist' :key='video.name' class='video'>
                    <img v-lazy='video.cover' class='img' @load='imgLoaded(video)'></img>
                    <div class='title'>{{video.name}}</div>
                    <!-- <div class='info'>
                        <img class='avator' v-lazy=''></img>
                        <span class='author'></span>
                    </div> -->
                </li>
            </ul>
        </scroll>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    export default {
        name: 'radio',
        components: {
            scroll
        },
        props: {
            videolist: {
                type: Array
            }
        },
        data() {
            return {
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            imgLoaded(video) {
                // getVideoDetail(video.id).then(res => {
                // })
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
    .videolist
        position: absolute 
        top: 0
        left: 0
        bottom: 0
        right: 0
        overflow: hidden
        background: $color-text-d
        .wrapper
            height: 100%
            width: 100%
            overflow: hidden
            .video
                padding: 5px
                margin-bottom: 5px
                background: $color-text-a
                .img
                    height: 100%
                    width: 100%
                    border-radius: 5px
                .title
                    margin: 10px 0
                    boder-bottom: 1px solid $color-text-i
                .info
                    display: inline-block
                    line-height: 20px
                    height: 20px
</style>