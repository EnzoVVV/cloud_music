<template>
    <div class='liner' :style='computedStyle'>
        <check v-if='showCheck' :circle='circleCheck' @check='check' class='check' ref='check'></check>
        <div class='img-wrapper' v-if='!showIndex' :style='imgWrapperStyle'><img :src='picUrl' class='img' :style='imgStyle'></img></div>
        <div class='index' v-if='showIndex'>{{index}}</div>
        <div class='content-wrapper' :style='contentStyle'>
            <div class='content'>
                <div class='name' ref='main' :style='mainStyle'>{{main}}</div>
                <div class='desc' ref='sub' :style='subStyle'>{{sub}}</div>
            </div>
            <div class='sort' v-if='sort' @touchstart.stop='touchstart' @touchmove.stop='touchmove' @touchend.stop='touchend'>
                <IconSvg icon-class='menu'></IconSvg>
            </div>
        </div>
    </div>
</template>
<script>
    import check from 'base/check-box/check-box'
    export default {
        name: 'liner',
        components: {
            check
        },
        props: {
            showIndex: {
                type: Boolean,
                default: false
            },
            picUrl: {
                type: String,
                default: ''
            },
            index: {
                type: Number,
                default: 1
            },
            main: {
                type: String,
                default: ''
            },
            sub: {
                type: String,
                default: ''
            },
            height: {
                type: String,
                default: '60px'
            },
            // 有下边框
            hasBorder: {
                type: Boolean,
                default: true
            },
            // 圆形图片
            circleImg: {
                type: Boolean,
                default: false
            },
            // 潜字体
            light: {
                type: Boolean,
                default: false
            },
            // 有排序图标
            sort: {
                type: Boolean,
                default: false
            },
            // 有checkbox
            showCheck: {
                type: Boolean,
                default: false
            },
            // 圆形的checkbox样式
            circleCheck: {
                type: Boolean,
                default: false
            },
            // item的id
            itemId: {
                type: Number,
                default: 0
            }

        },
        data() {
            return {

            }
        },
        computed: {
            computedStyle() {
                return {
                    height: this.height
                }
            },
            imgWrapperStyle() {
                return {
                    height: this.height,
                    width: this.height
                }
            },
            imgStyle() {
                let size = parseInt(this.height) - 10 + 'px'
                return {
                    height: size,
                    width: size,
                    'border-radius': this.circleImg ? '50%' : '5px'
                }
            },
            contentStyle() {
                return this.hasBorder ? {
                    'border-bottom': '1px solid rgb(228, 228, 228)'
                } : {}
            },
            mainStyle() {
                return {
                    'font-size': Math.ceil(parseInt(this.height) * 0.25) + 'px'
                }
            },
            subStyle() {
                return {
                    'font-size': Math.floor(parseInt(this.height) * 0.2) + 'px'
                }
            }
        },
        watch: {

        },
        methods: {
            check(status) {
                this.$emit('check', this.itemId, status)
            },
            manualCheck(status) {
                this.$refs.check.manual(status)
            },
            touchstart(e) {
                this.$emit('sortstart', e, this.itemId)
            },
            touchmove(e) {
                this.$emit('sortmove', e)
            },
            touchend(e) {
                this.$emit('sortend', e)
            }
        },
        created() {

        },
        mounted() {
            if(this.light) {
                this.$refs.main.style.color = '#757575'
                this.$refs.sub.style.color = 'rgb(144,144,144)'
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .liner
        display: flex
        align-items: center
        box-sizing: border-box
        width: 100%
        font-size: $font-size-medium
        padding-left: 5px
        .check
            padding-right: 5px
        .index
            float: left 
            width: 50px
            height: 50px
            display: flex
            align-items: center
            justify-content: center
            color: $color-text-g
        .img-wrapper
            display: flex
            align-items: center
            justify-content: center
        .content-wrapper
            margin-left: 10px
            display: flex
            height: 100%
            width: 100%
            .content
                flex-direction: column
                display: flex
                justify-content: center
                flex: 1
                .name
                    font-size: $font-size-medium-x
                    color: $color-text
                    padding-bottom: 5px
                    text-overflow: ellipsis 
                    overflow: hidden
                    white-space: nowrap
                .desc
                    font-size: $font-size-small
                    color: $color-text-g
            .sort
                width: 50px
                display: flex
                align-items: center

</style>