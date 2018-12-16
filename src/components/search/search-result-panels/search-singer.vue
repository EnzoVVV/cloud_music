<template>
    <div class='singer'>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' class='list'>
            <ul v-if='singers.length'>
                <li v-for='singer in singers' :key='singer.name' class='line' @click='selectSinger(singer)'>
                    <div class='img-wrapper'><img v-lazy='singer.picUrl' class='img'></img></div>
                    <div class='info'>
                        <span class='name'>{{singer.name}}</span>
                        <span class='alias' v-if='singer.alias'>({{singer.alias}})</span>
                    </div>
                </li>
            </ul>
            <loading v-else class='loading'></loading>
        </scroll>
    </div>
</template>
<script>
    import { searchSinger } from 'api/search'
    import { resultMixin } from 'common/js/mixins'
    import { mapMutations } from 'vuex'
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
                    this.singers = res
                })
            },
            selectSinger(singer) {
                this.setSinger(singer)
                this.$bus.emit('showSingerDetail',true)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
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
    .line
        height: 44px
        display: flex
        align-items: center
        padding-left: 5px
        .img-wrapper
            .img
                width: 38px
                height: 38px
                border-radius: 3px
        .info
            width: 100%
            height: 44px
            line-height: 44px
            position: relative
            &:after
                content: ''
                position: absolute 
                left: 2%
                bottom: 0
                right: 0
                height: 1px
                background: $color-light
            .name
                padding-left: 10px
            .alias
                padding-left: 2px
                color: $color-text-light
    .loading
        position: fixed
        top: 50%
</style>