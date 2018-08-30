<template>
    <scroll class='listview' :data='content' ref='listview' :listen-scroll='listenScroll' :probe-type='probeType'>
        <div>
            <ul>
                <li v-for='group in content' :key='group.title' class='group' ref='group'>
                    <h2 class='group-title'>{{group.title}}</h2>
                    <ul>
                        <li v-for='item in group.items' :key='item.id' class='group-item'>
                            <img v-lazy='item.imgUrl' class='group-item-img needsclick'></img>
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
                    <li v-for='(item, index) in shortcutList' :key='item' :data-index='index' class='shortcutList-item'>
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>
    </scroll>
</template>

<script>
    // devTools看li元素的盒子模型，高度是12 + 3 + 3 = 18
    const ANCHOR_HEIGHT = 18
    import scroll from 'base/scroll/scroll'
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
                touchInfo: {}
            }
        },
        computed: {
            shortcutList() {
                return this.content.map(group => group.title.substr(0, 1))
            }
        },
        methods: {
            handleTouchStart(e) {
                this.touchInfo.startIndex = e.target.getAttribute('data-index')
                this.scrollTo(this.touchInfo.startIndex)
                this.touchInfo.startPageY = e.touches[0].pageY
            },
            handleTouchMove(e) {
                this.touchInfo.curPageY = e.touches[0].pageY
                this.touchInfo.curIndex = this.touchInfo.startIndex + ((this.touchInfo.curPageY = this.touchInfo.startPageY)/ANCHOR_HEIGHT | 0)
                this.scrollTo(this.touchInfo.curIndex)
            },
            scrollTo(index) {
                // this.$refs.group是一个数组（li是v-for循环的），因此可以用this.$refs.group[index]来选中第index个元素
                this.$refs.listview.scrollToElement(this.$refs.group[index], 200)
            }
        },
        created() {
            this.probeType = 3
            this.listenScroll = true
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
</style>
