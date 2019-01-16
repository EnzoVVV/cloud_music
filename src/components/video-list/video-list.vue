<template>
    <div class='videolist'>
        <scroll class='wrapper'>
            <ul>
                <li v-for='video in videolist' :key='video.id' class='video'>
                    <div class='img-wrapper' @click='play(video)'>
                        <img v-lazy='video.picUrl' class='img'></img>
                        <IconImg imgName='play' class='play' size='80px'></IconImg>
                    </div>
                    <div class='title'>{{video.name}}</div>
                    <div class='info'>
                        <img class='avatar' :src='video.avatar'></img>
                        <div class='artist'>{{video.artists[0].name}}</div>
                        <div class='btn' @click='toggleFS'><IconImg imgName='like'></IconImg></div>
                        <div class='btn' @click='showComment(video.id)'><IconImg imgName='comment'></IconImg></div>
                        <div class='btn' @click='infoListFlag = true'><IconImg imgName='uj'></IconImg></div>
                    </div>
                </li>
            </ul>
        </scroll>
        <vplayer v-if='startPlay' :videoUrl='videoUrl'></vplayer>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import vplayer from 'components/video-player/vplayer'
    import { getMVAddress } from 'api/video'
    export default {
        name: 'videolist',
        components: {
            scroll,
            vplayer
        },
        props: {
            videolist: {
                type: Array
            }
        },
        data() {
            return {
                infoListFlag: false,
                startPlay: false,
                videoUrl: ''
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            toggleFS() {

            },
            showComment(id) {

            },
            play(video) {
                getMVAddress(video.id).then(res => {
                    this.videoUrl = res
                    this.startPlay = true
                })
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
                .img-wrapper
                    position: relative
                .img
                    height: 100%
                    width: 100%
                    border-radius: 5px
                .play
                    position: absolute
                    top: 50%
                    left: 50%
                    transform: translate3d(-50%, -50%, 0)
                .title
                    margin: 10px 0
                    border-bottom: 1px solid $color-text-i
                .info
                    height: 44px
                    display: flex
                    align-items: center
                    border-top: 1px solid $color-light
                    .avatar
                        width: 30px
                        height: 30px
                        border-radius: 50%
                    .artist
                        padding-left: 5px
                        flex: 1
                        text-overflow: ellipsis 
                        overflow: hidden
                        white-space: nowrap
</style>