<template>
    <transition name='comment'>
        <div class='comment'>
            <FunctionalHeader :title='title' @back='back'></FunctionalHeader>
            <scroll class='scroll'>
                <div>
                    <cline v-for='(comment, index) in comments' :key='index' :comment='comment' @showReply='showReply'></cline>
                </div>
            </scroll>
            <reply v-if='replyFlag' :comment='repliedComment' @back='replyFlag = false'></reply>
        </div>
    </transition>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import scroll from 'base/scroll/scroll'
    import cline from './cline'
    const reply = () => import('./reply')
    import PopupManager from 'common/js/popup-manager'
    export default {
        name: 'cviewer',
        components: {
            FunctionalHeader,
            scroll,
            cline,
            reply
        },
        props: {
            comments: {
                type: Array
            }
        },
        data() {
            return {
                replyFlag: false,
                repliedComment: null,
                title: '精彩评论'
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            showReply(comment) {
                this.replyFlag = true
                this.repliedComment = comment
            },
            back() {
                this.$emit('back')
            }
        },
        created() {
        },
        mounted() {
            this.$el.style.zIndex = PopupManager.nextZIndex()
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
        z-index: 7600
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
</style>