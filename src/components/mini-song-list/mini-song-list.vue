<template>
    <div>
        <minilist @hide='hide' :modifiedHeader='true' @headerClick='headerClick' ref='minilist'>
            <div slot='header'>
                <div class='modeIcon'><IconSvg :icon-class='modeIcon'></IconSvg></div>
                <p class='modeText'>{{modeText}}</p>
                <IconSvg icon-class='clear' class='clear'></IconSvg>
            </div>
            <transition-group name='list' tag='ul' slot='list'>
                <li v-for='item in mockList' :key='item.id' @click='select(item)' ref='item' class='item'>
                    <span class='name' :class='{active: currentSong.id == item.id }'>{{item.name}}</span>  
                    <span class='singer' :class='{active: currentSong.id == item.id }'>{{'- ' + item.singer}}</span>
                    <div class='delete' @click.stop='deleteOne(item)'><IconSvg icon-class='delete'></IconSvg></div>
                    <div class='border'></div>
                </li>
            </transition-group>
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
                mockList: [],
                probeType: 3,
                listenScroll: true,
                maxMoveDistance: 300,
                headerTouch: {},
                touch: {},
                position: 0
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
                // const index = this.sequenceList.find(i => i.id === val.id)
                // if(index > 3) {
                //     const el = this.$refs.item[index - 3]
                //     this.$refs.scroll.scrollToElement(el, 1000)
                // } else {
                //     this.$refs.scroll.scrollTo(0, 0, 1000)
                // }
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
                const index = this.sequenceList.find(i => i.id === this.currentSong.id)
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
                if(this.playList.length == 0) {
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
            for(let i=0;i<30;i++) {
                this.mockList.push({
                    id: i,
                    name: '看不见的城市',
                    singer: '惘闻'
                })
            }
        },
        mounted() {
            this.scroll = this.$refs.minilist.$refs.scroll
            this.autoScroll()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .empty
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: $color-text
        opacity: 0.5
        z-index: 2900
    .mini-list
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 3000
        overflow: hidden
        &.mini-list-enter-active, &.mini-list-leave-active
            transition: opacity 0.4s
            .mini-list
                transition: all 0.4s
        &.mini-list-enter, &.mini-list-leave-to
            opacity: 0
            .mini-list
                transform: translate3d(0, 100%, 0)
        .decorate
            position: absolute
            top: 0
            left: 0
            right: 0
            height: 300px
        .header
            position: absolute
            top: 300px
            left: 0
            right: 0
            height: 44px
            padding-left: 10px
            border-radius: 15px 15px 0 0
            background: $color-background
            display: flex
            align-items: center 
            .modeIcon
                transform: scale(0.7)
                transform-origin: 50% 50%
            .clear
                position: absolute
                left: 90%
        .scroll
            position: absolute 
            bottom: 0
            max-height: calc(100% - 300px - 44px)
            width: 100%
            background: $color-background
            overflow: hidden
            .item
                height: 44px
                line-height: 44px
                padding-left: 10px
                position: relative
                &.list-enter-active, &.list-leave-active
                    transition: all 0.1s
                &.list-enter, &.list-leave-to
                    height: 0
                .name
                    &.active
                        color: $color-theme
                .singer
                    font-size: $font-size-small
                    color: $color-text-g
                    &.active
                        color: $color-theme
                .delete
                    position: absolute
                    left: 90%
                    top: 20%
                // 小于1px的边界
                .border
                    height: 1px
                    transform: scaleY(0.3)
                    transform-origin: 50% 100%
                    background: $color-text-light
</style>