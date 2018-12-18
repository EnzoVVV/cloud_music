<template>
    <transition name='modal-fade'>
        <div class='modal' @click.stop='hide'>
            <!-- 点wrapper不冒泡, 这样点击wrapper外的空白区域才能将modal隐藏 -->
            <div class='modal-wrapper' :style='computedStyle' @click.stop>
                <div class='modal-content'>
                    <div class='header'><span class='text'>{{title}}</span></div>
                    <slot class='slot'></slot>
                    <div class='operate' v-if='!hideBtn'>
                        <div @click.stop='cancel' class='operate-btn left'>{{cancelBtnText || '取消'}}</div>
                        <div @click.stop='confirm' class='operate-btn' :class='{disable: disableConfirm === true}'>{{confirmBtnText || '确定'}}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'modal',
        components: {

        },
        props: {
            title: {
                type: String,
                default: ''
            },
            cancelBtnText: {
                type: String,
                default: '取消'
            },
            confirmBtnText: {
                type: String,
                default: '确定'
            },
            hideBtn: {
                type: Boolean,
                default: false
            },
            // 别忘了带单位
            width: {
                type: String,
                default: ''
            },
            // 控制禁用确认按钮
            disableConfirm: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {
            }
        },
        computed: {
            computedStyle() {
                if(this.width) {
                    return {
                        width: this.width
                    }
                }
                return ''
            }
        },
        watch: {

        },
        methods: {
            hide() {
                this.$emit('hide')
            },
            cancel() {
                this.hide()
                this.$emit('cancel')
            },
            confirm() {
                if(this.disableConfirm) {
                    return
                }
                this.hide()
                this.$emit('confirm')
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
    .modal
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 9999
        background-color: rgba(0, 0, 0, 0.3)
        &.modal-fade-enter-active
            animation: confirm-fadein 0.3s
            .modal
                animation: confirm-zoom 0.3s
        .modal-wrapper
            position: absolute 
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)
            z-index: 999
            width: 70%
            .modal-content
                border-radius: 5px
                background: $color-background
                .header
                    width: 100%
                    height: 44px
                    display: flex
                    align-items: center
                    .text
                        margin-left: 15px
                .slot
                    width: 100%
                .operate
                    display: flex
                    align-items: center
                    text-align: center
                    font-size: $font-size-medium-x
                    .operate-btn
                        flex: 1
                        line-height: 22px
                        padding: 12px 0
                        border-top: 1px solid $color-background
                        color: $color-theme
                        &.left
                            border-right: 1px solid $color-background
                        &.disable
                            color: $color-d-theme !important
    @keyframes modal-fadein
        0%
            opacity: 0
        100%
            opacity: 1
    @keyframes modal-zoom
        0%
            transform: scale(0)
        50%
            transform: scale(1.1)
        100%
            transform: scale(1)
</style>