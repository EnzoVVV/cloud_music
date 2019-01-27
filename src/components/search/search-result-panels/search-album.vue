<template>
    <div class='album'>
        <scroll class='list'>
            <div>
                <albumlist :albums='albums' v-if='albums.length'></albumlist>
                <loading v-else class='loading'></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import albumlist from 'components/album-list/album-list'
    import { searchAlbum } from 'api/search'
    import { resultMixin } from 'common/js/mixins'
    export default {
        name: 'searchAlbum',
        mixins: [resultMixin],
        components: {
            albumlist
        },
        props: {

        },
        data() {
            return {
                albums: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            searchAlbums() {
                if(this.query === undefined || this.query === null || this.query === '') {
                    return
                }
                searchAlbum(this.query).then(res => {
                    this.albums = res
                })
            }
        },
        created() {
            this.searchAlbums()
        },
        mounted() {
            this.$bus.on('research', this.searchAlbums)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .album
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