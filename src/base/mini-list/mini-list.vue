<template>
    <div class='mini-list'>
        <div class='decorate' @click='hide' ref='decorate'>
        </div>
        <div class='wrapper' ref='wrapper'>
            <div class='header' @touchstart='headerTouchStart' @touchmove='headerTouchMove' @touchend='headerTouchEnd' ref='header'>
                <slot name='header' v-if='modifiedHeader'></slot>
                <div class='title' v-else>{{title}}</div>
            </div>
            <scroll class='scroll' :listen-scroll='listenScroll' :probe-type='probeType' @scroll='handleScroll' ref='scroll'>
                <slot name='list'></slot>
            </scroll>
        </div>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import { translate, changeOpacity, isClick } from 'common/js/dom'
    const duration = 200
    // transition动画时间
    const AnimationDuration = 200
    const transitionDuration = AnimationDuration / 1000 + 's'
    export default {
        name: 'minilist',
        components: {
            scroll
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            modifiedHeader: {
                type: Boolean,
                default: false
            },
            // header是否有下边线
            headerBorder: {
                type: Boolean,
                default: true
            },
            // minilist的父组件比miniplayer的zIndex低, minilist是子组件，就算zIndex比miniplayer数值高，也不会在miniplayer层叠之上
            // 是否覆盖miniplayer
            coverMPlayer: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                showMiniList: true,
                probeType: 3,
                listenScroll: true,
                maxMoveDistance: 300,
                headerTouch: {},
                touch: {},
                position: 0
            }
        },
        methods: {
            hide() {
                translate(this.$refs.wrapper, 0, 100, {
                    transitionDuration: transitionDuration,
                    percent: true
                })
                this.finish()
            },
            finish() {
                changeOpacity(this.$refs.decorate, 0, AnimationDuration)
                // 需要transition动画结束后再emit hide事件
                // 原因：emit hide事件后父组件会终结此实例，就来不及完成动画了
                setTimeout(() => {
                    this.$emit('hide')
                }, AnimationDuration)
            },
            handleScroll(pos) {
                this.position = pos.y
            },
            // 列表在初始位置时,向下拉动, 则收起list
            touchstart(e) {
                // 列表不在初始位置时，this.position < 0, 不进行此逻辑处理， return掉
                if(this.position < 0) return
                // 但是，列表在初始位置时， this.position == 0, 此时如果向上滑动， 先执行的touch逻辑， 再触发的scroll事件执行handleScroll函数更新this.position
                // 所以, 列表从初始位置手指向上划时， 也触发了touch函数，所以在touchmove和touchend中，加上判断，如果totalDiff大于0，才translate
                this.touch.initiated = true
                const touch = e.touches[0]
                this.touch.startY = touch.pageY
                this.touch.startTime = new Date()
                this.listClicked = false
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
                // 是click事件
                if(isClick(this.touch)) {
                    this.listClicked = true
                    this.touch = {}
                    return   
                }
                // 给外界区分是click还是touch, touchend后还会触发e.target的click事件
                this.listClicked = false
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
                        this.finish()
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
                    this.$emit('headerClick', e.target)
                    this.headerTouch = {}
                    return   
                }
                let moveDistance = 0
                let duration = 200
                if(this.headerTouch.totalDiff > this.maxMoveDistance / 2) {
                    moveDistance = this.maxMoveDistance + this.headerEl.offsetHeight
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
                    this.finish()
                }
                this.headerTouch = {}
            },
            // 动画结束后执行
            animationCompleted() {
                this.maxMoveDistance = this.scrollEl.offsetHeight
                // this.$slots.list是vnode数组, vnode取dom是vnode.elm
                const list = this.$slots.list[0].elm
                if(list) {
                    list.addEventListener('touchstart', this.touchstart)
                    list.addEventListener('touchmove', this.touchmove)
                    list.addEventListener('touchend', this.touchend)
                }
            },
            coverMiniPlayer(flag) {
                window.$bus.emit('coverMiniPlayer', flag)
            }
        },
        created() {
            if(this.coverMPlayer) {
                this.coverMiniPlayer(true)
            }
        },
        mounted() {
            this.scrollEl = this.$refs.scroll.$el
            this.headerEl = this.$refs.header
            if(!this.headerBorder) {
                const headerHeight = parseInt(getComputedStyle(this.headerEl).height)
                // top - 1 挡住header的border
                this.scrollEl.style.top = headerHeight - 1 + 'px'
            }
            // 由于scroll采用绝对定位, 没法撑开这个高度，需要手动设置高度
            this.$refs.wrapper.style.height = parseInt(getComputedStyle(this.scrollEl.firstElementChild).height) + parseInt(getComputedStyle(this.headerEl).height) + 'px'
            translate(this.$refs.wrapper, 0, 0, {
                transitionDuration: transitionDuration
            })
            changeOpacity(this.$refs.decorate, 0.5, AnimationDuration)
            // 调用动画结束钩子
            setTimeout(() => {
                this.animationCompleted()
            }, AnimationDuration)
        },
        beforeDestroy() {
            if(this.coverMPlayer) {
                this.coverMiniPlayer(false)
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .mini-list
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 8000
        overflow: hidden
        .decorate
            position: absolute
            top: 0
            left: 0
            right: 0
            height: 100%
            background: $color-text
            opacity: 0
        .wrapper
            position: absolute
            left: 0
            right: 0
            bottom: 0
            max-height: 50%
            transform: translate3d(0, 100%, 0)
            .header
                height: 44px
                padding-left: 10px
                border-radius: 10px 10px 0 0
                background: $color-background
                display: flex
                align-items: center 
                font-size: $font-size-medium
                color: $color-text-g
                border-bottom: 1px solid $color-light
                .title
                    text-overflow: ellipsis
                    overflow: hidden
                    white-space: nowrap
            .scroll
                width: 100%
                background: $color-background
                overflow: hidden
                position: absolute
                top: 44px
                bottom: 0
</style>