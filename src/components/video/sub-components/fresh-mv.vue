<script>
    import { getVideo } from 'api/video'
    import { videoMixin } from 'common/js/mixins'
    export default {
        name: 'freshMV',
        mixins: [ videoMixin ],
        methods: {
            getVideo() {
                getVideo().then(res => {
                    this.videolist = res
                })
            }
        }
    }
</script>