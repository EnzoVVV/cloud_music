<template>
    <video-player :options='playerOptions' class='video-player vjs-custom-skin' v-if='prepared'></video-player>
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