<template>
    <div>
        <liner :hasBorder='false' :circleImg='true' :light='true' :picUrl='comment.user.picUrl' :main='comment.user.userName' :sub='comment.time' height='40px' :showImg='true' :imgSelectable='true' @imgClick='imgClick'></liner>
        <div class='content'>
            <div class='comment'>{{comment.content}}</div>
            <span class='reply' v-if='!hideReply && comment.reply && comment.reply.length' @click='showReply(comment)'>{{comment.reply.length}}条回复 ></span>
        </div>
    </div>
</template>
<script>
    import liner from 'base/liner/liner'
    export default {
        name: 'cline',
        components: {
            liner
        },
        props: {
            comment: {
                type: Object,
                default: () => {}
            },
            hideReply: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                replyFlag: false
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            showReply(comment) {
                this.$emit('showReply', comment)
            },
            imgClick(id) {
                this.showComponent('homepage', this.comment.user.userId)
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
    .content
        margin-left: 45px
        padding: 5px 5px 10px 0
        display: flex
        flex-direction: column
        border-bottom: 1px solid $color-light
        .comment
            line-height: 20px
            font-size: $font-size-medium
        .reply
            margin-top: 10px
            color: $color-text-h
            font-size: $font-size-small
</style>