<template>
    <transition name='slide'>
        <div>
            <div class='background' @click='hide'>
            </div>
            <div class='menu'>
                <scroll class='scroll' ref='scroll' :listen-scroll='listenScroll' :probe-type='probeType'>
                    <div>
                        <div class='header'>
                            <div class='info'>
                                <span>匿名用户</span>
                            </div>
                        </div>
                        <ul>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的会员</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                            <li class='line'>
                                <IconSvg icon-class='setting'></IconSvg>
                                <span>我的消息</span>
                            </li>
                        </ul>
                    </div>
                    </scroll>
                    <div class='bottom'>
                        <div class='item'>
                            <IconSvg icon-class='night-mode'></IconSvg>
                            <span>夜间模式</span>
                        </div>
                        <div class='item'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>设置</span>
                        </div>
                        <div class='item'>
                            <IconSvg icon-class='exit'></IconSvg>
                            <span>退出</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import { scrollMixin } from 'common/js/mixins'
    export default {
        name: 'leftmenu',
        mixins: [scrollMixin],
        components: {

        },
        props: {
            showLeftMenu: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {

            }
        },
        computed: {

        },
        watch: {
        },
        methods: {
            hide() {
                this.$emit('hide')
            }
        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .background
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: $color-text-m
        opacity: 0.5
        z-index: 2900
    .menu
        position: fixed
        left: 0
        top: 0
        right: 15%
        bottom: 0
        z-index: 3000
        background: $color-theme-l
        overflow: hidden
        .scroll
            position: absolute 
            left: 0
            top: 0
            right: 0
            bottom: 44px
            overflow: hidden
            .header
                width: 100%
                height: 200px
                overflow: hidden
                background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJIFfomYGWHkuqnOuyO_rHnHZI5-yBB5NpKwzZ97CBDIGm0RHdLQ')
                position: relative
                .info
                    position: absolute 
                    left: 15px
                    bottom: 15px
            .line
                padding-left: 5px
                line-height: 44px
                height: 44px
                width: 100%
                display: flex
                align-items: center
                span 
                    margin-left: 5px
        .bottom
            position: absolute 
            left: 0
            top: calc(100% - 44px)
            right: 0
            bottom: 0
            display: flex
            align-items: center
            justify-content: center
            .item
                flex: 1
                margin: 0 10px
                display: flex
                justify-content: center
                align-items: center
                span 
                    margin-left: 5px
</style>