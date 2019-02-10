<template>
    <video-player :options='playerOptions' class='video-player vjs-custom-skin' v-if='prepared' @play='onPlay'></video-player>
</template>
<script>
    import 'video.js/dist/video-js.css'
    import './custom-theme.css'
    import { videoPlayer } from 'vue-video-player'
    import { getVideoDetail } from 'api/video'
    export default {
        name: 'vplayer',
        components: {
            videoPlayer
        },
        props: {
            videoUrl: {
                type: String,
                default: ''
            },
            subject: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                playerOptions: {
                    // videojs options
                    // height: '232px',
                    // width: window.innerWidth,
                    notSupportedMessage: '视频暂无法播放，请稍后再试',
                    fluid: true,
                    muted: false,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [{
                        type: "video/mp4",
                        src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                    }],
                    poster: this.subject.picUrl
                },
                prepared: false
            }
        },
        computed: {

        },
        watch: {
        },
        methods: {
            onPlay() {
                // 视频开始播放, 停止player
                this.$bus.emit('togglePlay', false)
            }
        },
        created() {
            getVideoDetail(this.subject.id).then(res => {
                this.playerOptions.sources[0].src = res
                this.prepared = true
            })
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    // 不能直接在这里改播放器样式，会被覆盖
    // TODO，加载样式文件的顺序是啥
    .video-player
        margin: 5px
        border-radius: 5px
</style>