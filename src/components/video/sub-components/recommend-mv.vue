<script>
    import { getRecommendMV } from 'api/video'
    import { videoMixin } from 'common/js/mixins'
    export default {
        name: 'recommendMV',
        mixins: [ videoMixin ],
        methods: {
            getVideo() {
                getRecommendMV().then(res => {
                    this.videolist = res
                })
            }
        }
    }
</script>