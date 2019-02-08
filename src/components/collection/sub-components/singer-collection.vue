<template>
    <div>
        <scroll class='scroll' v-if='curSingers.length'>
            <ul>
                <li v-for='singer in curSingers' :key='singer.id'>
                    <liner :picUrl='singer.picUrl' :main='singer.name' :showImg='true' icon='um' @iconClick='showSetting(singer)' :selectable='true' @select='showSingerDetail(singer)'></liner>
                </li>
            </ul>
        </scroll>
        <p v-else class='empty'>暂无收藏</p>
    </div>
</template>
<script>
    import { mapGetters, mapActions, mapMutations } from 'vuex'
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
                curSingers: [],
                settingFlag: false
            }
        },
        computed: {
            ...mapGetters([
                'fsingers'
            ]),
            title() {
                return `歌手: ${this.selectedSinger.name}`
            }
        },
        watch: {

        },
        methods: {
            search(query) {
                this.curSingers = this.fsingers.filter(i => i.name.indexOf(query) > -1)
            },
            showSetting(singer) {
                this.selectedSinger = singer
                this.$bus.emit('showCollectionSetting', 'singer', this.selectedSinger)
            },
            deleteSinger() {
                this.favoriteSinger({
                    singer: this.selectedSinger,
                    status: false
                })
                const index = this.curSingers.findIndex(i => i.id == this.selectedSinger.id)
                this.curSingers.splice(index, 1)
                this.$message('已取消收藏')
            },
            showSingerDetail(singer) {
                this.setSinger(singer)
                this.showComponent('singerdetail')
            },
            ...mapActions([
                'favoriteSinger'
            ]),
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        created() {
            this.curSingers = this.fsingers
        },
        mounted() {
            this.$bus.on('deleteCollectionSinger', this.deleteSinger)
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
    .empty
        margin-top: 100px
        text-align: center
        color: $color-text-ii
</style>