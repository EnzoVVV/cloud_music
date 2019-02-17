<template>
    <div class='singer'>
        <scroll class='list' ref='scroll'>
            <div>
                <ul v-if='singers.length'>
                    <li v-for='singer in singers' :key='singer.name' class='line' @click='selectSinger(singer)'>
                        <div class='img-wrapper'><img v-lazy='singer.picUrl' class='img'/></div>
                        <div class='info'>
                            <span class='name'>{{singer.name}}</span>
                            <span class='alias' v-if='singer.alias'>({{singer.alias}})</span>
                        </div>
                    </li>
                </ul>
                <loading v-else class='loading'></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import { searchSinger } from 'api/search'
    import { playlistMixin, resultMixin } from 'common/js/mixins'
    import { mapMutations } from 'vuex'
    export default {
        name: 'searchSinger',
        mixins: [ playlistMixin, resultMixin ],
        data() {
            return {
                singers: []
            }
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
                this.showComponent('singerdetail')
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        created() {
            this.searchSingers()
        },
        mounted() {
            this.$bus.on('research', this.searchSingers)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .singer
        width: 100%
        height: 100%
        overflow: hidden
        .list
            position: absolute
            left: 0
            top: 0
            right: 0
            bottom: 60px
            .line
                height: 60px
                display: flex
                align-items: center
                padding-left: 5px
                .img-wrapper
                    .img
                        width: 50px
                        height: 50px
                        border-radius: 5px
                .info
                    width: 100%
                    height: 100%
                    display: flex
                    align-items: center
                    border-bottom: 1px solid $color-light
                    margin-left: 10px
                    .alias
                        padding-left: 2px
                        color: $color-text-light
            .loading
                position: fixed
                top: 50%
</style>