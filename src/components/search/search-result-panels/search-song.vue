<template>
    <div class='song'>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' class='list'>
            <songlist :songs='songs' @click='selectSong' v-if='songs.length'></songlist>
            <loading v-else class='loading'></loading>
        </scroll>
    </div>
</template>
<script>
    import songlist from 'components/song-list/song-list'
    import { mapActions } from 'vuex'
    import { searchSong } from 'api/search'
    import { resultMixin } from 'common/js/mixins'
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

                })
            },
            selectSong(song, index) {
                this.insertSong(song)
            },
            ...mapActions([
                'insertSong'
            ])
        },
        created() {
            this.searchSongs()
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .loading
        position: fixed
        top: 50%
</style>