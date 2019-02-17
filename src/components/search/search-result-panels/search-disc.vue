<template>
    <div class='disc'>
        <scroll class='list' ref='scroll'>
            <div>
                <div v-if='discs.length'>
                    <liner v-for='disc in discs' :key='disc.id' :picUrl='disc.picUrl' :main='disc.name' :sub='sub(disc)' :showImg='true' :itemId='disc.id' :selectable='true' @select='select' ></liner>
                </div>
                <loading v-else class='loading'></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import { searchDisc } from 'api/search'
    import { resultMixin, playlistMixin } from 'common/js/mixins'
    import liner from 'base/liner/liner'
    export default {
        name: 'searchDisc',
        mixins: [resultMixin, playlistMixin],
        components: {
            liner
        },
        data() {
            return {
                discs: []
            }
        },
        methods: {
            searchDiscs() {
                if(this.query === undefined || this.query === null || this.query === '') {
                    return
                }
                searchDisc(this.query).then(res => {
                    this.discs = res
                })
            },
            sub(disc) {
                return `${disc.trackCount}首 by ${disc.creator.name}, 播放${disc.playCount}次`
            },
            select(id) {
                const disc = this.discs.find(i => i.id == id)
                this.showComponent('discdetail', disc)
            }
        },
        created() {
            this.searchDiscs()
        },
        mounted() {
            this.$bus.on('research', this.searchDiscs)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .disc
        width: 100%
        height: 100%
        overflow: hidden
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