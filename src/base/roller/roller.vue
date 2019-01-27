<template>
    <div class='wrapper' :style='computedStyle'>
        <div class='marquee' :style='computedStyle'>
            <div ref='front' class='text'>{{content}}</div>
            <div ref='tail' class='text'>{{content}}</div>
        </div>
    </div>
</template>
<script>
    import { getPxValue } from 'common/js/dom'
    export default {
        name: 'roller',
        components: {

        },
        props: {
            content: {
                type: String,
                default: ''
            },
            // 一个周期的时间, 单位秒
            period: {
                type: Number,
                default: 10
            },
            // TODO，帧数大了有问题
            // 帧数
            fps: {
                type: Number,
                default: 60
            },
            // 第一个尾部和第二个头部的距离
            space: {
                type: Number,
                default: 40
            },
            fontSize: {
                type: Number,
                default: 16
            },
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
            }
        },
        computed: {
            computedStyle() {
                return {
                    width: this.width ? `${this.width}px` : '100%',
                    height: this.height ? `${this.height}px` : '44px'
                }
            }
        },
        watch: {

        },
        methods: {
            // mounted调用
            init() {
                this.actualWidth = this.content.length * this.fontSize
                this.front = this.$refs.front
                this.tail = this.$refs.tail
                this.front.style['font-size'] = this.tail.style['font-size'] = this.fontSize + 'px'
                this.front.style.left = 0
                // front与tail的起始点距离
                this.distance = this.$el.offsetWidth - this.actualWidth > this.space ? this.$el.offsetWidth : this.actualWidth + this.space
                this.tail.style.left = this.distance + 'px'
                this.speed = this.distance/(this.period * this.fps)
                this.timer = setInterval(() => {
                    this.scrollmarquee()
                }, 1000/this.fps)
            },
            scrollmarquee() {
                this.scroll(this.front, this.tail)
                this.scroll(this.tail, this.front)
            },
            scroll(el1, el2) {
                if(getPxValue(el1.style.left) < -this.actualWidth) {
                    // 到头了，移动到最后面
                    el1.style.left = getPxValue(el2.style.left) + this.distance + 'px'
                } else {
                    // 向前移动
                    el1.style.left = getPxValue(el1.style.left) - this.speed + 'px'
                }
            }
        },
        created() {

        },
        mounted() {
            this.init()
        },
        beforeDestroy() {
            clearInterval(this.timer)
            this.timer = null
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .wrapper
        position: relative
        overflow: hidden
        .marquee
            position: absolute
            .text
                position: absolute
                top: 0
                bottom: 0
                display: flex
                align-items: center
                white-space: nowrap

</style>