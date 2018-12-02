<template>
    <div class='album'>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' class='list'>
            <albumlist :albums='albums' v-if='albums.length'></albumlist>
            <loading v-else class='loading'></loading>
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
        },
        created() {
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