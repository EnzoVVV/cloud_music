<template>
    <ul class='album-list'>
        <li v-for='album in albumList' :key='album.id' class='item' @click='selectAlbum(album)'>
            <liner :showImg='true' :cd='true' :picUrl='album.picUrl' :main='album.name' :sub='album.date'></liner>
        </li>
    </ul>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { getSingerAlbums } from 'api/singer'
    import liner from 'base/liner/liner'
    export default {
        name: 'albumlist',
        components: {
            liner
        },
        props: {
            albums: {
                type: Array
            }
        },
        data() {
            return {
                albumList: this.albums
            }
        },
        computed: {
            ...mapGetters([
                'singer'
            ])
        },
        watch: {

        },
        methods: {
            selectAlbum(album) {
                this.showComponent('albumDetail',album)
            }
        },
        created() {
            // 外部没有传入albums, 则自行调服务取
            if(!this.albums || this.albums.length == 0) {
                getSingerAlbums(this.singer.id).then(res => {
                    this.albumList = res
                })
            }
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .album-list
        background: $color-background
</style>