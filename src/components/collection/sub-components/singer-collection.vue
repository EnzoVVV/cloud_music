<template>
    <scroll class='scroll'>
        <ul>
            <li v-for='album in curAlbums' :key='album.id'>
                <liner :picUrl='album.picUrl' :main='album.name' :sub='album.singer'></liner>
            </li>
        </ul>
    </scroll>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { collectionMixin } from 'common/js/mixins'
    export default {
        // TODO
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
            }
        },
        created() {
            this.curAlbums = this.albums
        },
        mounted() {

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
        bottom: 0
</style>