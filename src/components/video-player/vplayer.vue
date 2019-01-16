<template>
    <video-player :options='playerOptions' class='video-player vjs-custom-skin'></video-player>
</template>
<script>
    import 'video.js/dist/video-js.css'
    import './custom-theme.css'
    import { videoPlayer } from 'vue-video-player'
    export default {
        name: 'vplayer',
        components: {
            videoPlayer
        },
        props: {
            videoUrl: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                playerOptions: {
                    // videojs options
                    // height: '232px',
                    // width: window.innerWidth,
                    fluid: true,
                    muted: true,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [{
                        type: "video/mp4",
                        src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                    }],
                    poster: "/static/images/author.jpg",
                }
            }
        },
        computed: {

        },
        watch: {
            videoUrl(val) {
                this.playerOptions.sources[0].src = val
            }
        },
        methods: {

        },
        created() {
            this.playerOptions.sources[0].src = this.videoUrl
            debugger
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    // 不能直接在这里改播放器样式，会被覆盖
    // TODO，加载样式文件的顺序是啥
    // TODO，圆角加不上呢，改播放按钮样式
    .video-player
        margin: 5px
        border-radius: 5px
</style>