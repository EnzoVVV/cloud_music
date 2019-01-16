<template>
    <div class='liner' :style='computedStyle' @click.stop.prevent='handleSelect'>
        <check v-if='showCheck && !showSpeaker' :circle='circleCheck' @check='check' class='check' ref='check'></check>
        <div class='img-wrapper' v-if='showImg && !showSpeaker' :style='imgWrapperStyle'>
            <img :src='picUrl' class='img' :style='imgStyle'></img>
            <IconImg imgName='cd-decorate' class='cd' v-if='cd'></IconImg>
        </div>
        <div class='index' v-if='showIndex'>{{index}}</div>
        <div class='speaker' v-if='showSpeaker'><IconImg imgName='speaker'></IconImg></div>
        <div class='content-wrapper' :style='contentStyle'>
            <div class='content'>
                <div class='name' ref='main' :style='mainStyle'>{{main}}</div>
                <div class='desc' ref='sub' :style='subStyle' v-if='sub.length'>{{sub}}</div>
            </div>
            <div class='sort' v-if='sort' @touchstart.stop='touchstart' @touchmove.stop='touchmove' @touchend.stop='touchend'>
                <IconSvg icon-class='menu'></IconSvg>
            </div>
        </div>
    </div>
</template>
<script>
    import check from 'base/check-box/check-box'
    import { mapGetters } from 'vuex'
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
            showImg: {
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
            // 浅字体
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
            },
            speaker: {
                type: Boolean,
                default: false
            },
            // 是否点击liner后传出事件
            selectable: {
                type: Boolean,
                default: false
            },
            // liner图片显示cd背景
            cd: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {
                showSpeaker: false
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
                    'font-size': Math.ceil(parseInt(this.height) * 0.27) + 'px'
                }
            },
            subStyle() {
                return {
                    'font-size': Math.floor(parseInt(this.height) * 0.23) + 'px'
                }
            },
            ...mapGetters([
                'currentSong'
            ])
        },
        watch: {
            currentSong(val) {
                this.checkCurrentSong()
            }
        },
        methods: {
            checkCurrentSong() {
                if(this.currentSong && this.currentSong.id === this.itemId) {
                    this.showSpeaker = true
                } else {
                    this.showSpeaker = false
                }
            },
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
            },
            handleSelect() {
                if(this.selectable) {
                    this.$emit('select', this.itemId)
                }
            }
        },
        created() {
            this.checkCurrentSong()
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
        .speaker
            width: 50px
            height: 50px
            display: flex
            align-items: center
            justify-content: center
        .img-wrapper
            display: flex
            align-items: center
            justify-content: center
            .cd
                height: 50px !important
                width: 8px !important
        .content-wrapper
            margin-left: 10px
            display: flex
            height: 100%
            width: calc(100% - 50px)
            .content
                flex-direction: column
                display: flex
                justify-content: center
                flex: 1
                div
                    text-overflow: ellipsis 
                    overflow: hidden
                    white-space: nowrap
                .name
                    font-size: $font-size-medium-x
                    color: $color-text
                .desc
                    padding-top: 5px
                    font-size: $font-size-small
                    color: $color-text-g
            .sort
                width: 50px
                display: flex
                align-items: center

</style>