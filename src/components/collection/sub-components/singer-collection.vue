<template>
    <scroll class='scroll'>
        <ul>
            <li v-for='singer in curSingers' :key='singer.id'>
                <liner :picUrl='singer.picUrl' :main='singer.name' sub='todo'></liner>
            </li>
        </ul>
    </scroll>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { collectionMixin } from 'common/js/mixins'
    export default {
        name: 'singerCollection',
        mixins: [collectionMixin],
        components: {

        },
        props: {

        },
        data() {
            return {
                curSingers: []
            }
        },
        computed: {
            ...mapGetters([
                'fsinger'
            ])
        },
        watch: {

        },
        methods: {
            search(query) {
                this.curSingers = this.fsinger.filter(i => i.name.indexOf(query) > -1)
            }
        },
        created() {
            this.curSingers = this.fsinger
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