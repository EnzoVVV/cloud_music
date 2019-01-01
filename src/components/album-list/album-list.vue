<template>
    <div class='album-list'>
        <ul>
            <li v-for='album in albumList' :key='album.id' class='item' @click='selectAlbum(album)'>
                <img class='img' :src='album.picUrl'></img>
                <div class='content'>
                    <div class='name'>{{album.name}}</div>
                    <p class='desc'>{{album.date}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { getSingerAlbums } from 'api/singer'
    export default {
        name: 'albumlist',
        components: {

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
                this.$bus.emit('showAlbumDetail',album)
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
        .item
            position: relative
            display: flex
            align-items: center
            box-sizing: border-box
            height: 60px
            font-size: $font-size-medium
            padding-left: 5px
            .img
                float: left
                width: 50px
                height: 50px
                border-radius: 10%
            .content
                flex: 1
                height: 60px
                line-height: 24px
                margin-left: 20px
                border-bottom: 1px solid rgb(228, 228, 228)
                .name
                    margin-top: 8px
                    color: $color-text
                    text-overflow: ellipsis 
                    overflow: hidden
                    white-space: nowrap
                .desc
                    width: 80%
                    font-size: 12px
                    color: $color-text-g
</style>