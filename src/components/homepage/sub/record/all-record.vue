<!-- <scroll class='scroll' ref='scroll'>
    <ul v-if='records.length'>
        <li v-for='(song, index) in records' :key='song.id'>
            <liner :main='song.name' :sub='song.singer' :index='index + 1' :showIndex='true' :selectable='true' @select='selectSong(song)'></liner>
        </li>
    </ul>
    <div v-else-if='denied' class='empty'>由于对方设置, 无权限查看</div>
    <div v-else class='empty'>暂无听歌数据</div>
</scroll> -->
<script>
    import { playlistMixin, homepageMixin, recordMixin } from 'common/js/mixins'
    import { getUserRecord } from 'api/user'
    export default {
        name: 'allrecord',
        mixins: [ playlistMixin, homepageMixin, recordMixin ],
        methods: {
            getRecord() {
                getUserRecord(this.homepage.id, 0).then(res => {
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