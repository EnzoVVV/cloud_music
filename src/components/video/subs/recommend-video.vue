<template>
    <div class='video'>
        <videolist :videolist='videolist' v-if='videolist.length'></videolist>
    </div>
</template>
<script>
    import videolist from 'components/video-list/video-list'
    import { getVideo } from 'api/video'
    import { ERR_FREE } from 'api/config'
    export default {
        name: 'radio',
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
                    if(res.data.code == ERR_FREE) {
                        this.videolist = res.data.data
                        console.log(this.videolist[0])
                    }
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