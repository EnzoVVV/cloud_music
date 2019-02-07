<template>
    <div>
        <scroll class='scroll' v-if='curAlbums.length'>
            <ul>
                <li v-for='album in curAlbums' :key='album.id'>
                    <liner :picUrl='album.picUrl' :main='album.name' :sub='album.singer' :showImg='true' :cd='true' icon='um' :itemId='album.id' @iconClick='showSetting'></liner>
                </li>
            </ul>
        </scroll>
        <p v-else class='empty'>暂无收藏</p>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { collectionMixin } from 'common/js/mixins'
    export default {
        name: 'albumCollection',
        mixins: [collectionMixin],
        components: {

        },
        props: {

        },
        data() {
            return {
                curAlbums: []
            }
        },
        computed: {
            ...mapGetters([
                'albums'
            ])
        },
        watch: {

        },
        methods: {
            search(query) {
                this.curAlbums = this.albums.filter(i => i.name.indexOf(query) > -1)
            },
            showSetting(id) {
                this.selectedAlbum = this.curAlbums.find(i => i.id == id)
                this.$bus.emit('showCollectionSetting', 'album', this.selectedAlbum)
            },
            deleteAlbum() {
                const index = this.curAlbums.findIndex(i => i.id == this.selectedAlbum.id)
                this.curAlbums.splice(index, 1)
                this.favoriteAlbum({
                    album: this.selectedAlbum,
                    status: false
                })
                this.$message('已取消收藏')
            },
            ...mapActions([
                'favoriteAlbum'
            ])
        },
        created() {
            this.curAlbums = this.albums
        },
        mounted() {
            this.$bus.on('deleteCollectionAlbum', this.deleteAlbum)
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
        margin-top: 100px
        text-align: center
        color: $color-text-ii
</style>