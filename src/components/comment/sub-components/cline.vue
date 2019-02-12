<template>
    <div>
        <div class='user-line'>
            <liner :hasBorder='false' :circleImg='true' :light='true' :picUrl='comment.user.picUrl' :main='comment.user.userName' :sub='comment.time' height='40px' :showImg='true' :imgSelectable='true' @imgClick='imgClick'></liner>
            <span v-if='likedCount !== 0' class='liked-count'>{{likedCount}}</span>
            <div class='like-btn' @click='toggleLike' ref='likeBtn'><IconImg :imgName='likeIcon' size='15px'></IconImg></div>
        </div>
        <div class='content'>
            <span class='comment'>{{comment.content}}</span>
            <span class='reply' v-if='!hideReply && comment.reply && comment.reply.length' @click='showReply(comment)'>{{comment.reply.length}}条回复 ></span>
        </div>
    </div>
</template>
<script>
    import liner from 'base/liner/liner'
    import { likeComment } from 'api/comment'
    import { bubble } from 'common/js/dom'
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
            },
            // 资源类型
            type: {
                type: String
            },
            // 资源信息
            subject: {
                type: Object
            }
        },
        data() {
            return {
                replyFlag: false,
                liked: this.comment.liked || false,
                likedCount: this.comment.likedCount || 0
            }
        },
        computed: {
            likeIcon() {
                return this.liked ? 'thumb-liked' : 'thumb-like'
            }
        },
        watch: {

        },
        methods: {
            showReply(comment) {
                this.$emit('showReply', comment)
            },
            imgClick(id) {
                this.showComponent('homepage', this.comment.user.userId)
            },
            toggleLike() {
                this.liked = !this.liked
                this.likedCount += this.liked ? 1 : -1
                likeComment(this.subject.id, this.comment.id, this.liked, this.type)
                if(this.liked) {
                    bubble(this.$refs.likeBtn)
                }
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
    .user-line
        display: flex
        align-items: center
        .liked-count
            color: $color-text-light
            font-size: $font-size-small
        .like-btn
            padding: 0 10px
    .content
        padding: 5px 5px 10px 55px
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