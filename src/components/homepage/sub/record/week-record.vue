<script>
    import { playlistMixin, homepageMixin, recordMixin } from 'common/js/mixins'
    import { getUserRecord } from 'api/user'
    export default {
        name: 'weekrecord',
        mixins: [ playlistMixin, homepageMixin, recordMixin ],
        methods: {
            getRecord() {
                getUserRecord(this.homepage.id, 1).then(res => {
                    if(res === false) {
                        this.denied = true
                        return
                    }
                    this.records = res
                })
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .scroll
        position: absolute
        left: 0
        top: 0
        right: 0
        bottom: 88px
        .empty
            margin: 30px
            color: $color-text-ii
            text-align: center
</style>