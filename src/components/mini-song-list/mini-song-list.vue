<template>
    <div>
        <minilist @hide='hide' :modifiedHeader='true' @headerClick='headerClick' ref='minilist'>
            <div slot='header' class='minilist-header'>
                <div class='modeIcon'><IconSvg :icon-class='modeIcon'></IconSvg></div>
                <div class='modeText'>{{modeText}}</div>
                <div class='clear'><IconSvg icon-class='clear'></IconSvg></div>
            </div>
            <ul slot='list'>
                <li v-for='item in sequenceList' :key='item.id' @click='select(item)' ref='item' class='minilist-item'>
                    <div class='info' :class='{active: currentSong.id == item.id }'>
                        <IconImg imgName='speaker' size='16px' v-if='currentSong.id == item.id' class='speaker'></IconImg>
                        <div class='name'>{{item.name}}</div>  
                        <div class='singer'>{{'- ' + item.singer}}</div>
                    </div>
                    <div class='delete' @click.stop='deleteOne(item)'><IconSvg icon-class='delete'></IconSvg></div>
                    <div class='border'></div>
                </li>
            </ul>
        </minilist>
        <confirm class='confirm' ref='confirm' text='是否清空播放列表' confirmBtnText='清空' @confirm='clear'></confirm>
    </div>
</template>
<script>
    import confirm from 'base/confirm/confirm'
    import { hasClass } from 'common/js/dom'
    import { mapActions, mapGetters } from 'vuex'
    import { playerMixin } from 'common/js/mixins'
    import { playMode } from 'common/js/config'
    import minilist from 'base/mini-list/mini-list'
    export default {
        name: 'minisonglist',
        mixins: [playerMixin],
        components: {
            minilist,
            confirm
        },
        props: {
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'sequenceList'
            ]),
            modeText() {
                const mode = this.mode === playMode.listCycle ? '列表循环' : this.mode === playMode.random ? '随机播放' : '单曲循环'
                const songsCount = this.sequenceList.length
                return `${mode} ( ${songsCount} )`
            }
        },
        watch: {
            currentSong(val) {
                this.autoScroll()
            }
        },
        methods: {
            headerClick(el) {
                if(el.className == 'modeIcon' || el.className == 'modeText') {
                    this.toggleMode()
                } else if(hasClass(el, 'clear')) {
                    this.confirm()
                }
            },
            autoScroll() {
                const index = this.sequenceList.findIndex(i => i.id === this.currentSong.id)
                if(index > 3) {
                    const el = this.$refs.item[index - 3]
                    this.scroll.scrollToElement(el, 1000)
                } else {
                    this.scroll.scrollTo(0, 0, 1000)
                }
            },
            ...mapActions([
                'selectPlay',
                'deleteSong',
                'deleteSongList'
            ]),
            select(item) {
                this.selectPlay(item)
            },
            deleteOne(item) {
                this.deleteSong(item) 
                // 没有歌了，隐藏列表
                if(this.sequenceList.length == 0) {
                    this.hide()
                }
            },
            confirm() {
                this.$refs.confirm.show()
            },
            clear() {
                this.deleteSongList()
                this.hide()
            },
            hide() {
                this.$emit('hide')
            }
        },
        created() {
        },
        mounted() {
            this.scroll = this.$refs.minilist.$refs.scroll
            this.autoScroll()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .minilist-header
        width: 100%
        height: 100%
        display: flex
        align-items: center 
        .modeIcon
            width: 25px
        .modeText
            flex: 1
        .clear
            width: 40px
    .minilist-item
        height: 44px
        line-height: 44px
        margin-left: 10px
        display: flex
        align-items: center
        border-bottom: 1px solid $color-light
        .info
            flex: 1
            display: flex
            align-items: center
            overflow: hidden
            white-space: nowrap
            &.active
                color: $color-theme
            .speaker
                padding-right: 7px
            .singer
                padding-left: 5px
                font-size: $font-size-small
                color: $color-text-g
        .delete
            width: 40px
            height: 100%
            display: flex
            align-items: center
            padding-left: 30px
</style>