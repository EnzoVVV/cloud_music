<template>
    <div class='message'>{{text}}</div>
</template>
<script>
    import { changeOpacity } from 'common/js/dom'
    export default {
        name: 'message',
        components: {

        },
        props: {
            text: {
                type: String,
                default: 'success'
            },
            // message显示时间
            period: {
                type: Number,
                default: 1200
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
            show() {
                // 先将透明度从0到1，保持一段时间后再降到0
                changeOpacity(this.$el, 1, 500)
                setTimeout(() => {
                    changeOpacity(this.$el, 0 ,500)
                    setTimeout(() => {
                        this.$emit('back')
                    }, 500)
                }, this.period)
            }
        },
        created() {

        },
        mounted() {
            setTimeout(() => {
                this.show()
            }, 10)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .message
        position: fixed
        bottom: 100px
        left: 50%
        transform: translate(-50%, 0)
        height: 25px
        max-width: 200px
        border-radius: 10px
        z-index: 9999
        background-color: $color-background-d
        padding: 0 15px
        display: flex
        align-items: center
        opacity: 0
        font-size: $font-size-small
        text-overflow: ellipsis 
        overflow: hidden
        white-space: nowrap
        color: $color-text-a
</style>