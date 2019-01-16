<template>
    <div class='video'>
        <videolist :videolist='videolist' v-if='videolist.length'></videolist>
    </div>
</template>
<script>
    import videolist from 'components/video-list/video-list'
    import { getVideo, getVideoArtistDetail } from 'api/video'
    export default {
        name: 'videoviewer',
        components: {
            videolist
        },
        props: {
        },
        data() {
            return {
                videolist: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            getVideo() {
                getVideo(10).then(res => {
                    this.videolist = res
                    this.videolist.forEach(video => {
                        getVideoArtistDetail(video.artists[0].id).then(res => {
                            video.avatar = res
                        })
                    })
                })
            }
        },
        created() {
            this.getVideo()
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
</style>