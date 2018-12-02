<template>
    <div v-show='showMiniList'>
        <!-- 让背景亮度降低的方法， 配一个fixed布局占全屏的，z-index低的div，颜色黑色， 透明度0.5 -->
        <div class='empty'>
        </div>
        <transition name='mini-list'>
            <div class='mini-list'>
                <div class='decorate' @click='hide'>
                </div>
                <div class='header' @touchstart='headerTouchStart' @touchmove='headerTouchMove' @touchend='headerTouchEnd' ref='header'>
                    <div class='modeIcon'><IconSvg :icon-class='modeIcon'></IconSvg></div>
                    <p class='modeText'>{{modeText}}</p>
                    <IconSvg icon-class='clear' class='clear'></IconSvg>
                </div>
                <div @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend'>
                   <scroll class='scroll' :listen-scroll='listenScroll' :probe-type='probeType' @scroll='handleScroll' ref='scroll'>
                       <transition-group name='list' tag='ul'>
                           <li v-for='item in mockList' :key='item.id' @click='select(item)' ref='item' class='item'>
                               <span class='name' :class='{active: currentSong.id == item.id }'>{{item.name}}</span>
                               <span class='singer' :class='{active: currentSong.id == item.id }'>{{'- ' + item.singer}}</span>
                               <div class='delete' @click.stop='delteOne(item)'><IconSvg icon-class='delete'></IconSvg></div>
                               <div class='border'></div>
                           </li>
                       </transition-group>
                   </scroll>
                </div>
            </div>
        </transition>
        <confirm class='confirm' ref='confirm' text='是否清空播放列表' confirmBtnText='清空' @confirm='clear'></confirm>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import confirm from 'base/confirm/confirm'
    import { translate, hasClass } from 'common/js/dom'
    import { mapActions, mapGetters } from 'vuex'
    import { playerMixin } from 'common/js/mixins'
    import { playMode } from 'common/js/config'
    const duration = 200
    export default {
        name: 'minisonglist',
        mixins: [playerMixin],
        components: {
            scroll,
            confirm
        },
        props: {
            showList: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showMiniList: true,
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
            showList(val) {
                this.showMiniList = val
                if(val) {
                    // transition动画完成后刷新scroll，不然没法滚动
                    setTimeout(() => {
                        this.$refs.scroll.refresh()
                    }, 500)
                }
            },
            currentSong(val) {
                const index = this.secquenceList.find(i => i.id === val.id)
                if(index > 3) {
                    const el = this.$refs.items[index - 3]
                    this.$refs.scroll.scrollToElement(el, 1000)
                } else {
                    this.$refs.scroll.scrollTo(0, 0, 1000)
                }
            }
        },
        methods: {
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
            },
            handleScroll(pos) {
                this.position = pos.y
            },
            touchstart(e) {
                // 列表不在初始位置时，this.position < 0, 不进行此逻辑处理， return掉
                if(this.position < 0) return
                // 但是，列表在初始位置时， this.position == 0, 此时如果向上滑动， 先执行的touch逻辑， 再触发的scroll事件执行handleScroll函数更新this.position
                // 所以, 列表从初始位置手指向上划时， 也触发了touch函数，所以在touchmove和touchend中，加上判断，如果totalDiff大于0，才translate
                this.touch.initiated = true
                const touch = e.touches[0]
                this.touch.startY = touch.pageY
            },
            touchmove(e) {
                if(!this.touch.initiated) {
                    return
                }
                const touch = e.touches[0]
                const deltaY = touch.pageY - this.touch.startY
                this.touch.totalDiff = deltaY > 0 ? deltaY : 0
                if(this.touch.totalDiff > 0) {
                    // scroll组件也感知了滑动，需要先将scroll组件disable
                    this.$refs.scroll.disable()
                    translate(this.scrollEl, 0, this.touch.totalDiff)
                    translate(this.headerEl, 0, this.touch.totalDiff)
                }
            },
            touchend(e) {
                if(!this.touch.initiated) {
                    return 
                }
                if(this.touch.totalDiff > 0) {
                    let moveDistance = 0
                    if(this.touch.totalDiff > this.maxMoveDistance / 2) {
                        moveDistance = this.maxMoveDistance
                    } else {
                        moveDistance = this.touch.totalDiff = 0
                    }
                    translate(this.scrollEl, 0, moveDistance, {
                        transitionDuration: duration + 'ms'
                    })
                    translate(this.headerEl, 0, moveDistance, {
                        transitionDuration: duration + 'ms'
                    })
                    if(moveDistance > 0) {
                        setTimeout(() => {
                            this.hide()
                        }, duration)
                    }
                }
                this.touch = {}
                this.$refs.scroll.enable()
            },
            headerTouchStart(e) {
                this.headerTouch.initiated = true
                const touch = e.touches[0]
                this.headerTouch.startY = touch.pageY
            },
            headerTouchMove(e) {
                if(!this.headerTouch.initiated) {
                    return 
                }
                const touch = e.touches[0]
                const deltaY = touch.pageY - this.headerTouch.startY
                this.headerTouch.totalDiff = deltaY > 0 ? deltaY : 0
                translate(this.scrollEl, 0, this.headerTouch.totalDiff)
                translate(this.headerEl, 0, this.headerTouch.totalDiff)
            },
            headerTouchEnd(e) {
                if(!this.headerTouch.initiated) {
                    return 
                }
                // 是click事件
                if(this.headerTouch.totalDiff === undefined) {
                    // currentTarget始终是事件的监听者, 而target是事件的真正发出者
                    // 此处事件已经冒泡了，e.currrentTarget一定是this.$refs.header，因为header绑定的事件监听处理，e.target是真正点击的元素
                    const el = e.target
                    if(el.className == 'modeIcon' || el.className == 'modeText') {
                        this.toggleMode()
                    } 
                    if(hasClass(el, 'clear')) {
                        this.confirm()
                    }
                    this.headerTouch = {}
                    return   
                }
                let moveDistance = 0
                let duration = 200
                if(this.headerTouch.totalDiff > this.maxMoveDistance / 2) {
                    moveDistance = this.maxMoveDistance
                } else {
                    moveDistance = this.headerTouch.totalDiff = 0
                }
                translate(this.scrollEl, 0, moveDistance, {
                    transitionDuration: duration + 'ms'
                })
                translate(this.headerEl, 0, moveDistance, {
                    transitionDuration: duration + 'ms'
                })
                if(moveDistance > 0) {
                    setTimeout(() => {
                        this.hide()
                    }, duration)
                }
                this.headerTouch = {}
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
            debugger
            let self = this
            setTimeout(() => {
                debugger
                self.scrollEl = self.$refs.scroll.$el
                self.headerEl = self.$refs.header
                self.maxMoveDistance = self.headerEl.getBoundingClientRect().bottom
            }, 500)
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
        background: $color-text-m
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