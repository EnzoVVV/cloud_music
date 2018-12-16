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
                }, 1200)
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