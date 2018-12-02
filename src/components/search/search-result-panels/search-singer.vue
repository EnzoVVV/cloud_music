<template>
    <div class='singer'>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' class='list'>
            <ul v-if='singers.length'>
                <li v-for='singer in singers' :key='singer.name'>
                    <img v-lazy='singer.imgUrl'></img>
                    <span>{{singer.name}}</span>
                </li>
            </ul>
            <loading v-else class='loading'></loading>
        </scroll>
    </div>
</template>
<script>
    import { searchSinger } from 'api/search'
    import { resultMixin } from 'common/js/mixins'
    export default {
        name: 'searchSinger',
        mixins: [resultMixin],
        components: {
        },
        props: {

        },
        data() {
            return {
                singers: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            searchSingers() {
                if(this.query === undefined || this.query === null || this.query === '') {
                    return
                }
                searchSinger(this.query).then(res => {

                })
            }
        },
        created() {
            this.searchSingers()
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