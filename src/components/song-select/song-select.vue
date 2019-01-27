<template>
    <div class='song-select' ref='wrapper'>
        <div class='header'>
            <div @click='back' class='back'><IconSvg icon-class='back'></IconSvg></div>
            <span class='title'>{{title}}</span>
        </div>
        <scroll ref='scroll' class='scroll'>
            <ul>
                <li v-for='song in songs' :key='song.id' :ref='song.id'>
                    <liner :main='song.name' :sub='sub(song)' :showCheck='true' :itemId='song.id' @check='check'></liner>
                </li>
            </ul>
        </scroll>
        <div class='bottom'>
            <div @click='handleClick(0)' class='bottom-btn'>
                <IconSvg icon-class='restore' size='30px'></IconSvg>
                <div class='text'>下一首播放</div>
            </div>
            <div @click='handleClick(1)' class='bottom-btn'>
                <IconSvg icon-class='restore' size='30px'></IconSvg>
                <div class='text'>添加到歌单</div>
            </div>
        </div>
        <SaveToDisc v-if='stdFlag' :songs='selectedSongs' @hide='hide'></SaveToDisc>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import liner from 'base/liner/liner'
    import { mapGetters, mapActions } from 'vuex'
    import { deepCopy } from 'common/js/tools'
    const SaveToDisc = () => import('components/save-to-disc/save-to-disc')
    export default {
        name: 'songselect',
        components: {
            scroll,
            liner,
            SaveToDisc
        },
        props: {
            songs: {
                type: Array
            }
        },
        data() {
            return {
                checkedCount: 0,
                selectedSongs: [],
                stdFlag: false
            }
        },
        computed: {
            title() {
                return `已选择${this.checkedCount}项`
            }
        },
        watch: {

        },
        methods: {
            check(id, status) {
                if(status) {
                    if(!this.checkList.find(i => i === id)) {
                        this.checkList.push(id)
                        this.checkedCount++
                    }
                } else {
                    this.checkList = this.checkList.filter(i => i !== id)
                    this.checkedCount--
                }
            },
            back() {
                this.$emit('back')
            },
            ...mapActions([
                'insertSongsToPlayNext'
            ]),
            addToDisc() {
                this.stdFlag = true
            },
            addToPlayNext() {
                this.insertSongsToPlayNext(this.selectedSongs)
            },
            handleClick(type) {
                if(this.checkList.length === 0) {
                    this.$message('请先选择歌曲')
                    return
                }
                this.selectedSongs = []
                this.checkList.forEach(id => {
                    const song = this.songs.find(i => i.id === id)
                    this.selectedSongs.push(song)
                })
                if(type === 0) {
                    this.addToPlayNext()
                }
                if(type === 1) {
                    this.addToDisc()
                }
            },
            sub(song) {
                return `${song.singer} - ${song.album}`
            }

        },
        created() {
            this.checkList = []
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .song-select
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 7100
        background: $color-background
        .header
            position: absolute
            top: 0
            height: 44px
            width: 100%
            display: flex
            align-items: center
            background: $color-theme
            color: $color-text-a
            z-index: 1
            .back
                margin: 0 10px
            .title
                color: $color-text-a
                flex: 1
        .scroll
            position: absolute
            left: 0
            right: 0
            top: 44px
            bottom: 60px
        .bottom
            position: absolute
            bottom: 0
            height: 60px
            width: 100%
            display: flex
            align-items: center
            background: $color-background
            border-top: 1px solid $color-light
            &-btn
                flex: 1
                display: flex
                flex-direction: column
                align-items: center
            .text
                padding-top: 2px
                color: $color-text-ii
</style>