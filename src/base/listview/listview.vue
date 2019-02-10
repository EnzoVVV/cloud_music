<template>
    <scroll class='listview' :data='content' ref='listview' :listen-scroll='listenScroll' :probe-type='probeType' @scroll='handleScroll'>
        <ul>
            <li v-for='group in content' :key='group.title' class='group' ref='group'>
                <h2 class='group-title'>{{group.title}}</h2>
                <ul>
                    <li v-for='item in group.items' :key='item.id' class='group-item' @click='handleClick(item)'>
                        <img v-lazy='item.picUrl' class='group-item-img needsclick'/>
                        <span class='group-item-name'>{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- 加了stop后才有滑动过程的动画 -->
        <!-- stop阻止冒泡，prevent阻止原生事件 -->
        <div class='shortcutList' @touchstart.stop.prevent='handleTouchStart' @touchmove.stop.prevent='handleTouchMove' @touchend.stop>
            <ul>
                <!-- element上自定义属性data-index，记录index -->
                <li v-for='(item, index) in shortcutList' :key='item' :data-index='index' class='shortcutList-item' :class="{'current': currentIndex == index}">
                    {{item}}
                </li>
            </ul>
        </div>
        <div class='fixTitle' v-show='fixTitle' ref='fixTitle'>
            <h2 class='title'>{{fixTitle}}</h2>
        </div>
    </scroll>
</template>

<script>
    // devTools看li元素的盒子模型，高度是12 + 3 + 3 = 18
    const ANCHOR_HEIGHT = 18
    // 标题高度
    const TITLE_HEIGHT = 30
    import scroll from 'base/scroll/scroll'
    import { transform } from 'common/js/dom'
    export default {
        name: 'listview',
        components: {
            scroll
        },
        props: {
            content: {
                type: Array
            }
        },
        data() {
            return {
                probeType: 3,
                listenScroll: true,
                touchInfo: {},
                groupHeight: [],
                scrollY: 0,
                currentIndex: 0,
                deviation: 0
            }
        },
        computed: {
            shortcutList() {
                return this.content.map(group => group.title.substr(0, 1))
            },
            fixTitle() {
                if(this.scrollY > 0) {
                    return ''
                }
                return this.content[this.currentIndex] ? this.content[this.currentIndex].title : ''
            }
        },
        methods: {
            handleTouchStart(e) {
                // 添加dom的attribute时是number，但是getAttribute取下来就变成string了
                this.touchInfo.startIndex = parseInt(e.target.getAttribute('data-index'))
                this.scrollTo(this.touchInfo.startIndex)
                this.touchInfo.startPageY = e.touches[0].pageY
            },
            handleTouchMove(e) {
                this.touchInfo.curPageY = e.touches[0].pageY
                this.touchInfo.curIndex = this.touchInfo.startIndex + ((this.touchInfo.curPageY - this.touchInfo.startPageY)/ANCHOR_HEIGHT | 0)
                this.scrollTo(this.touchInfo.curIndex)
            },
            scrollTo(index) {
                // 点击上下部空白区域时
                if(!index && index !== 0) {
                    return
                }
                if(index < 0) {
                    // 向上滑动时超出了上部
                    index = 0
                } else if(index > this.groupHeight.length -2) {
                    // 向下滑动超出了下部
                    index = this.groupHeight.length -2
                }
                // this.$refs.group是一个数组（li是v-for循环的），因此可以用this.$refs.group[index]来选中第index个元素
                this.$refs.listview.scrollToElement(this.$refs.group[index], 200)
                this.scrollY = this.$refs.listview.scroll.y
                this.currentIndex = index
            },
            handleScroll(pos) {
                // 触发了scrollY的watch
                this.scrollY = pos.y
                if(this.scrollY > 0) {
                    this.currentIndex = 0
                    return
                }
                const scrolly = -this.scrollY
                for(let i=0;i<this.groupHeight.length-1;i++) {
                    if(scrolly >= this.groupHeight[i] && scrolly<this.groupHeight[i+1]) {
                        this.currentIndex = i
                        const diff = this.groupHeight[i+1] - scrolly
                        this.handleDiff(diff)
                        return
                    }
                }
                this.currentIndex = this.groupHeight.length - 2
            },
            handleDiff(diff) {
                const deviation = (diff > 0 && diff < TITLE_HEIGHT) ? diff - TITLE_HEIGHT : 0
                // 偏差没变化时（为0时），无需移动
                if(this.deviation === deviation) {
                    return
                }
                this.deviation = deviation
                // translate3d可以开启gpu加速
                // 此时val-TITLE_HEIGHT是负值，就向上偏移了
                this.$refs.fixTitle.style[transform] = `translate3d(0,${deviation}px,0)`
            },
            calculateHeight() {
                let groups = this.$refs.group
                let height = 0
                this.groupHeight = []
                this.groupHeight.push(height)
                groups.forEach((group, index) => {
                    if(index === groups.length - 1 && group.clientHeight < this.$el.clientHeight) {
                        // 最后一个group的高度如果比总高度小的话，必须手动将group高度置为总高度, 不然最后一个滚动不到fixedTitle, 会导致最后一个shortCut不会被点亮
                        group.style.height = this.$el.clientHeight + 'px'
                    }
                    height += group.clientHeight
                    this.groupHeight.push(height)
                })
            },
            handleClick(item) {
                this.$emit('click',item)
            }
        },
        watch: {
            // 需要父组件去掉v-if='content.length'才能watch到content变化
            content() {
                let self = this
                // nextTick
                // TODO，watch到props变化时，dom还没更新？
                setTimeout(self.calculateHeight,20)
            }
        },
        created() {
        }
    }

</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable'

    .listview
        position: relative
        background: $color-background
        width: 100%
        height: 100%
        overflow: hidden
        .group
            padding-bottom: 30px
            &-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text
                background: $color-dialog-background
            &-item
                display: flex
                // 子元素垂直居中对齐，和display flex搭配使用
                align-items: center
                padding: 20px 0 0 30px
                &-img
                    width: 50px
                    height: 50px
                    border-radius: 50%
                &-name
                    margin-left: 20px
                    color: $color-text
                    font-size: $font-size-medium
        .shortcutList
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            &-item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme
        .fixTitle
            position: absolute
            top: 0
            left: 0
            width: 100%
            .title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text
                background: $color-dialog-background
</style>
