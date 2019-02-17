<template>
    <detailboard headerTitle='专辑' :subject='album' :headerScrollTitle='album.name' :rollingTitle='true' :songs='songs' :favoriteStatus='favoriteStatus' :cover='album.picUrl' :showSearch='false' :showIndex='true' type='album' @toggleFS='toggleFS' @back='goback'>
    </detailboard>
</template>
<script>
    import detailboard from 'components/detail-board/detail-board'
    import { mapGetters, mapActions } from 'vuex'
    import { getAlbumDetail } from 'api/album'
    export default {
        name: 'albumdetail',
        components: {
            detailboard
        },
        props: {
            album: {
                type: Object
            }
        },
        data() {
            return {
                songs: [],
                favoriteStatus: false
            }
        },
        computed: {
            ...mapGetters([
                'albums'
            ])
        },
        methods: {
            toggleFS(status) {
                this.favoriteAlbum({
                    album: this.album,
                    status: status
                })
                this.favoriteStatus = !this.favoriteStatus
                const text = this.favoriteStatus ? '已收藏' : '已取消收藏'
                this.$message(text)
            },
            ...mapActions([
                'favoriteAlbum'
            ]),
            getAlbumDetails() {
                getAlbumDetail(this.album.id).then(res => {
                    this.songs = res
                })
            },
            checkFavoriteStatus() {
                this.favoriteStatus = !!this.albums && !!this.albums.find(i => i.id === this.album.id)
            },
            goback() {
                this.$emit('back')
            }
        },
        created() {
            this.getAlbumDetails()
            this.checkFavoriteStatus()
        },
        mounted() {
            this.$emit('mountedCalled')
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .img
        width: 100px
        height: 100px
        overflow: hidden
        position: absolute 
        left: 20px
        top: 60px
    .title
        position: absolute 
        left: 140px
        top: 70px
        color: $color-text-a
</style>