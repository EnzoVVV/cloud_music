<template>
    <div class='song'>
        <scroll class='list'>
            <div>
                <songlist :songs='songs' @click='selectSong' v-if='songs.length'></songlist>
                <loading v-else class='loading'></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import songlist from 'components/song-list/song-list'
    import { mapActions } from 'vuex'
    import { searchSong } from 'api/search'
    import { resultMixin } from 'common/js/mixins'
    import { getAlbumPicUrl } from 'api/album'
    import Song from 'common/js/song'
    export default {
        name: 'searchSong',
        mixins: [resultMixin],
        components: {
            songlist
        },
        props: {

        },
        data() {
            return {
                songs: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            searchSongs() {
                searchSong(this.query).then(data => {
                    this.songs = data
                })
            },
            selectSong(song, index) {
                // 搜索到的歌曲没有picUrl, 通过album id调用服务, 获取专辑封面, 赋给新创建的song类，然后insertSong
                if(!song.picUrl) {
                    // song是在vuex中的, 不能直接操作更改属性值, 所以这里重新创建一个类
                    let updatedSong = new Song(song)
                    getAlbumPicUrl(song.albummid).then(picUrl => {
                        updatedSong.picUrl = picUrl
                        this.insertSong(updatedSong)
                    })
                } else {
                    this.insertSong(song)
                }
            },
            ...mapActions([
                'insertSong'
            ])
        },
        created() {
            this.searchSongs()
        },
        mounted() {
            this.$bus.on('research', this.searchSongs)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .song
        width: 100%
        height: 100%
        overflow hidden
        .list
            position: absolute
            left: 0
            top: 0
            right: 0
            bottom: 60px
            .loading
                position: fixed
                top: 50%
</style>