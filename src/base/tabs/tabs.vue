<template>
    <div class='wrapper'>
        <div class='tab' ref='tab'>
            <div v-for='(item,index) in content' :key='item.name' class='tab-item' :style='tabStyle(index)' @click='handleClick(index)' ref='tabitem'>
                <p class='tab-link' ref='tablink'>
                    <IconSvg v-if='item.icon' :icon-class='item.icon' class='tab-icon'></IconSvg>
                    <span v-else-if='item.text' class='tab-text'>{{item.text}}</span>
                </p>
            </div>
        </div>
        <div class='marker' ref='marker' v-if='showMarker'></div>
    </div>
</template>
<script>
    // TODO, 开放成props变量， 需要处理的问题: 为偶数（可以设置成不为偶数）；值很大的时候， tabWidth小于marker的宽度
    const totalShowingTabsCount = 5
    import { translate } from 'common/js/dom'
    export default {
        name: 'tabs',
        props: {
            content: {
                type: Array,
                default: () => []
            },
            activeStyle: {
                type: Boolean,
                default: true
            },
            defaultIndex: {
                type: Number
            },
            showMarker: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 一个tab的宽度
                tabWidth: 0,
                // 是否是长tab
                long: this.content.length >= totalShowingTabsCount,
                // 记录当前tab的transform值
                curTabTransform: 0,
                // 记录当前marker的transform值
                curMarkerTransform: 0,
                // tabs组件占有的宽度
                viewerWidth: 0,
                curIndex: this.defaultIndex,
                // this.$refs.marker
                marker: null,
                // this.$refs.tab
                tab: null
            }
        },
        methods: {
            handleClick(index) {
                this.$emit('click',index)
                this.setActiveStyle(index)
                this.moveTabs(index)
                this.moveMarker(index)
                this.curIndex = index
            },
            moveTabs(index) {
                if(!this.long) {
                    return
                }
                if(index < 2) {
                    // 前两个，将tabs移动到首位
                    this.curTabTransform = 0
                } else if(this.isMiddleTab(index)) {
                    const tab = this.$refs.tabitem[index]
                    const tabMedian = (tab.getBoundingClientRect().left + tab.getBoundingClientRect().right) / 2
                    const distance = tabMedian - this.curTabTransform - this.viewerWidth / 2
                    this.curTabTransform = -distance
                } else {
                    // 最后两个，将tabs移动到末尾
                    const width = this.tab.style.width
                    const widthValue = parseInt(width.substring(0, width.length-2))
                    const distance = widthValue - this.viewerWidth
                    this.curTabTransform = -distance
                }
                this.translateTabs()
            },
            translateTabs() {
                const duration = 200
                translate(this.tab, this.curTabTransform, 0 , {
                    transitionDuration: duration + 'ms'
                })
            },
            moveMarker(index) {
                if(!this.showMarker) {
                    return
                }
                if(this.long) {
                    if(index < 2) {
                        this.curMarkerTransform = this.tabWidth / 2 - this.marker.offsetWidth / 2 + index * this.tabWidth
                    } else if(this.isMiddleTab(index)) {
                        this.curMarkerTransform = this.viewerWidth / 2 - this.marker.offsetWidth / 2
                    } else {
                        this.curMarkerTransform = this.viewerWidth - (this.content.length - index) * this.tabWidth + this.tabWidth / 2 - this.marker.offsetWidth / 2
                    }
                } else {
                    const diff = index - this.curIndex
                    this.curMarkerTransform = this.curMarkerTransform + diff * this.tabWidth
                }
                this.translateMarkers()
            },
            translateMarkers() {
                const duration = 200
                translate(this.marker, this.curMarkerTransform, 0, {
                    transitionDuration: duration + 'ms'
                })
            },
            isMiddleTab(index) {
                return this.long && index >= 2 && index < this.content.length - 2
            },
            // 外部调用(tabswiper组件跟随滑动)
            swiping(moveDistance, duration = 0, index) {
                // 有index时，是touchend, 没有index, 是touchmove
                if(this.isMiddleTab(this.curIndex)) {
                     if(this.curIndex == 2) {
                        // 当前是第三个tab(中间区的边界)
                        if(moveDistance <= 0) {
                            // 手指往左滑，移动tab
                            this.swipeTab(moveDistance, duration, index)
                        } else {
                            // 手指往右滑，移动marker
                            this.swipeMarker(moveDistance, duration, index)
                        }
                    } else if(this.curIndex == this.content.length - 3) {
                        // 当前是倒数第三个tab(中间区的边界)
                        if(moveDistance <= 0) {
                            // 手指往左滑，移动marker
                            this.swipeMarker(moveDistance, duration, index)
                        } else {
                            // 手指往右滑，移动tab
                            this.swipeTab(moveDistance, duration, index)
                        }
                    }
                    else {
                        // 当前是在非边缘的中间的tab,那么就移动tab
                        this.swipeTab(moveDistance, duration, index)
                    }
                }  else {
                    // 正常模式，long = false
                    this.swipeMarker(moveDistance, duration, index)
                }
                // 对于Number，判断非空时切记不要if(index)
                if(index != undefined && index != null) {
                    // touchend,记录最终index
                    this.curIndex = index
                }
            },
            swipeTab(moveDistance, duration = 0, index) {
                // moveDistance是组件swipe的距离，diff是相对应的tab移动距离
                const diff = moveDistance / window.innerWidth * this.tabWidth
                const curTabTransform = this.curTabTransform + diff
                translate(this.tab, curTabTransform, 0, {
                    transitionDuration: duration + 'ms'
                })
                if(index != undefined && index != null) {
                    // touchend,记录最终位置
                    this.curTabTransform = curTabTransform
                }
            },
            swipeMarker(moveDistance, duration = 0, index) {
                // 当前不是中间的tab，那么移动marker
                const diff = -moveDistance / window.innerWidth * this.tabWidth
                const curMarkerTransform = this.curMarkerTransform + diff
                translate(this.marker, curMarkerTransform, 0, {
                    transitionDuration: duration + 'ms'
                })
                if(index != undefined && index != null) {
                    // touchend,记录最终位置
                    this.curMarkerTransform = curMarkerTransform
                }
            },
            // 设置初始位置
            setDefaultPosition() {
                this.setActiveStyle(this.defaultIndex)
                this.moveTabs(this.defaultIndex)
                this.setMarkerPosition()
            },
            // 设置marker初始位置
            setMarkerPosition() {
                if(!this.showMarker) {
                    return
                }
                if(this.long) {
                    if(this.defaultIndex < 2) {
                        this.curMarkerTransform = this.tabWidth / 2 - this.marker.offsetWidth / 2 + this.defaultIndex * this.tabWidth
                    } else if(this.isMiddleTab(this.defaultIndex)) {
                        this.curMarkerTransform = this.viewerWidth / 2 - this.marker.offsetWidth / 2
                    } else {
                        this.curMarkerTransform = this.viewerWidth - (this.content.length - this.defaultIndex) * this.tabWidth + this.tabWidth / 2 - this.marker.offsetWidth / 2
                    }
                } else {
                    this.curMarkerTransform = this.tabWidth / 2 - this.marker.offsetWidth / 2 + this.defaultIndex * this.tabWidth
                }
                translate(this.marker, this.curMarkerTransform)
            },
            // 当前tab高亮
            setActiveStyle(index) {
                if(!this.activeStyle) {
                    return
                }
                for(let i=0;i<this.content.length;i++) {
                    if(i!=index) {
                        this.$refs.tablink[i].style.color = 'rgba(255,255,255,0.6)'
                    } else {
                        this.$refs.tablink[i].style.color = 'rgb(255,255,255)'
                    }
                }
            },
            // 设置tab的初始位置
            tabStyle(index) {
                return {
                    width: this.tabWidth + 'px',
                    left: this.tabWidth * index + 'px'
                }
            }
        },
        mounted() {
            // tabs组件可能没有独占一行，比如header两侧还有其他图标，所以用vm.$el.offsetWidth获取tabs占有的宽度，而不能用window,innerWidth
            this.viewerWidth = this.$el.offsetWidth
            this.marker = this.$refs.marker
            this.tab = this.$refs.tab
            if(this.long) {
                this.tabWidth = this.viewerWidth / totalShowingTabsCount
                this.tab.style.width = this.tabWidth * this.content.length + 'px'
            } else {
                this.tabWidth = this.viewerWidth / this.content.length
                this.tab.style.width = this.viewerWidth + 'px'
            }
            this.setDefaultPosition()
        }
    }
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable'
    .wrapper
        width: 100%
        overflow: hidden
        .tab
            position: relative
            height: 44px
            line-height: 44px
            font-size: $font-size-medium
            overflow: hidden
            .tab-item
                display: flex
                justify-content: center
                position: absolute
                left: 0
                .tab-link
                    color: $color-text-i
                    .tab-icon
                        width: 25px !important 
                        height: 25px !important
        .marker
            position: absolute
            top: 36px
            left: 0
            width: 35px
            border: 1px solid $color-background
</style>
