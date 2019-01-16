<template>
    <transition name='comment'>
        <div class='comment'>
            <FunctionalHeader title='回复' @back='back'></FunctionalHeader>
            <scroll class='scroll'>
                <div>
                    <cline :comment='comment' :hideReply='true'></cline>
                    <div class='header'>全部回复</div>
                    <cline v-for='(comment, index) in comment.reply' :key='index' :comment='comment'></cline>
                </div>
            </scroll>
        </div>
    </transition>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import scroll from 'base/scroll/scroll'
    import cline from './cline'
    export default {
        name: 'reply',
        components: {
            FunctionalHeader,
            scroll,
            cline,
        },
        props: {
            comments: {
                type: Array
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
            back() {
                this.$emit('back')
            }
        },
        created() {
            this.loadMore()
            this.getHotComments()
            this.info = {
                picUrl: this.subject.picUrl,
                main: this.subject.name,
                sub: this.subject.singer || this.subject.creator || ''
            }
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .comment
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 7700
        &.comment-enter-active, &.comment-leave-active 
            transition: all 0.3s
        &.comment-enter, &.comment-leave-to 
            transform: translate3d(0, 100%, 0)
        .scroll
            position: absolute
            top: 44px
            left: 0
            right: 0
            bottom: 0
            overflow: hidden
            background: $color-background
            .header
                height: 25px
                padding-left: 5px
                display: flex
                align-items: center
                background: $color-text-lighter
                font-size: $font-size-small
</style>