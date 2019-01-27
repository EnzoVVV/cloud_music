<template>
    <scroll class='scroll' ref='scroll'>
        <ul>
            <li v-for='(song, index) in records' :key='song.id'>
                <liner :main='song.name' :sub='song.singer' :index='index + 1' :showIndex='true' :selectable='true' @select='selectSong(song)'></liner>
            </li>
        </ul>
    </scroll>
</template>
<script>
    import { playlistMixin, homepageMixin, recordMixin } from 'common/js/mixins'
    import { getUserRecord } from 'api/user'
    export default {
        name: 'weekrecord',
        mixins: [ playlistMixin, homepageMixin, recordMixin ],
        components: {

        },
        props: {

        },
        data() {
            return {
            }
        },
        computed: {
        },
        watch: {

        },
        methods: {
            getRecord() {
                getUserRecord(this.homepage.id, 1).then(res => {
                    this.records = res
                })
            }
        },
        created() {
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
        bottom: 88px
</style>