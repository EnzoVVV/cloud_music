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
                    <p>{{title}}</p>
                </div>
                <div @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend'>
                   <scroll class='scroll' :listen-scroll='listenScroll' :probe-type='probeType' @scroll='handleScroll' ref='scroll'>
                       <slot></slot>
                   </scroll>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import { translate } from 'common/js/dom'
    const duration = 200
    export default {
        // TODO, 让minislit的transition生效
        name: 'minilist',
        components: {
            scroll
        },
        props: {
            title: {
                type: String,
                default: ''
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
        computed: {
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
            }
        },
        methods: {
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
                    setTimeout(() => {
                        this.hide()
                    }, duration)
                }
                this.headerTouch = {}
            }
        },
        created() {
        },
        mounted() {
            this.scrollEl = this.$refs.scroll.$el
            this.headerEl = this.$refs.header
            this.headerEl.style.bottom = this.scrollEl.offsetHeight + 'px'
            this.maxMoveDistance = this.scrollEl.offsetHeight
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
            transition: all 4s
            .mini-list
                transition: all 4s
        &.mini-list-enter, &.mini-list-leave-to
            opacity: 0
            transform: translate3d(0, 100%, 0)
            .mini-list
                opacity: 0
                transform: translate3d(0, 100%, 0)
        .decorate
            position: absolute
            top: 0
            left: 0
            right: 0
            height: 100%
        .header
            position: absolute
            left: 0
            right: 0
            height: 44px
            padding-left: 10px
            border-radius: 15px 15px 0 0
            background: $color-background
            display: flex
            align-items: center 
            font-size: $font-size-small
            color: $color-text-g
        .scroll
            position: absolute 
            bottom: 0
            max-height: 30%
            width: 100%
            background: $color-background
            overflow: hidden
</style>