<template>
    <div>
        <modal :hideBtn='true' title='收藏到歌单' width='95%' @hide='hide'>
            <ul class='lists'>
                <li class='list' @click='showCreateDisc = true'>
                    <IconImg class='img' imgName='add'></IconImg>
                    <div class='text'>新建歌单</div>
                </li>
                <li class='list' v-for='disc in discs' :key='disc.name' @click='add(disc)'>
                    <img class='img' v-lazy='disc.picUrl'></img>
                    <div class='text'>
                        <p class='name'>{{disc.name}}</p>
                        <p class='info'>{{clistInfo(disc)}}</p>
                    </div>
                </li>
            </ul>
        </modal>
        <createdisc v-if='showCreateDisc' @hide='hideCreateDisc' @confirm='confirm' :song='song'></createdisc>
    </div>
</template>
<script>
    import modal from 'base/modal/modal'
    import createdisc from 'components/create-disc/create-disc'
    import { mapGetters, mapActions } from 'vuex'
    import { addSongsToDisc } from 'api/disc'
    export default {
        name: 'SaveToDisc',
        components: {
            modal,
            createdisc
        },
        props: {
            song: {
                type: Object
            },
            songs: {
                type: Array
            }
        },
        data() {
            return {
                showCreateDisc: false
            }
        },
        computed: {
            ...mapGetters([
                'discs'
            ])
        },
        watch: {

        },
        methods: {
            clistInfo(disc) {
                return `${disc.songList.length}首`
            },
            // 隐藏CreateDisc
            hideCreateDisc() {
                this.showCreateDisc = false
            },
            // CreateDisc点击确认，隐藏CreateDisc，再隐藏本组件
            confirm() {
                this.hideCreateDisc()
                this.hide()
            },
            // 隐藏本组件
            hide() {
                this.$emit('hide')
            },
            add(disc) {
                if(this.song) {
                    // 添加一首歌
                    this.addSongToDisc({
                        song: this.song,
                        disc: disc
                    })
                    addSongsToDisc(disc.id, [this.song.id]).then(() => {
                        this.hide()
                    })
                } else if(this.songs) {
                    this.songs.forEach(song => {
                        this.addSongToDisc({
                            song: song,
                            disc: disc
                        })
                    })
                    addSongsToDisc(disc.id, this.songs.map(song => song.id)).then(() => {
                        this.hide()
                    })
                }
            },
            ...mapActions([
                'addSongToDisc'
            ])
        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .list
        margin-left: 5px
        height: 60px
        display: flex
        align-items: center
        position: relative
        .img
            width: 50px !important
            height: 50px !important
            border-radius: 5px
            overflow: hidden
        .text
            margin-left: 10px
            width: calc(100% - 100px)
            .name
                padding-bottom: 6px
                text-overflow: ellipsis 
                overflow: hidden
                white-space: nowrap
            .info
                color: $color-text-g
                font-size: $font-size-small
</style>