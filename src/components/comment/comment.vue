<template>
    <transition name='comment'>
        <div class='comment'>
            <FunctionalHeader title='评论' @back='back'></FunctionalHeader>
            <scroll class='scroll' :pullup='true' @scrollToEnd='loadMore'>
                <div>
                    <div class='info' @click='selectInfo'>
                        <liner :picUrl='info.picUrl' :main='info.main' :sub='info.sub' height='80px' :hasBorder='false' :showImg='true'></liner>
                    </div>
                    <div class='header'>精彩评论</div>
                    <cline v-for='(comment, index) in hotComments' :key='index + "hot"' :comment='comment' :type='type' :subject='info'></cline>
                    <div v-if='allHotComments.length > 10' class='all' @click='cviewerFlag = true'>全部精彩评论 ></div>
                    <div class='header'>最新评论</div>
                    <cline v-for='(comment, index) in comments' :key='index + "common"' :comment='comment'  :type='type' :subject='info' @showReply='showReply'></cline>
                    <!-- 如果还有数据, 则拉到最底时显示loading，加载完数据后，内容增多，loading组件被推到下面了 -->
                    <loading v-show='hasMore'></loading>
                </div>
            </scroll>
            <reply v-if='replyFlag' :comment='repliedComment' @back='replyFlag = false'></reply>
            <cviewer v-if='cviewerFlag' :comments='allHotComments' @back='cviewerFlag = false'></cviewer>
        </div>
    </transition>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import scroll from 'base/scroll/scroll'
    import liner from 'base/liner/liner'
    import cline from './sub-components/cline'
    const reply = () => import('./sub-components/reply')
    const cviewer = () => import('./sub-components/cviewer')
    import { getComment, getHotComment } from 'api/comment'
    export default {
        name: 'comment',
        components: {
            FunctionalHeader,
            scroll,
            liner,
            cline,
            reply,
            cviewer
        },
        props: {
            type: {
                type: String,
                default: 'song',
                validator: (value) => {
                    return ['song', 'album', 'disc'].indexOf(value) > -1
                }
            },
            subject: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                curPage: 0,
                hasMore: true,
                comments: [],
                hotComments: [],
                allHotComments: [],
                replyFlag: false,
                repliedComment: null,
                cviewerFlag: false,
                info: {}
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            loadMore() {
                if(!this.hasMore) {
                    return
                }
                this.curPage++
                getComment(this.subject.id, this.curPage, this.type).then(res => {
                    this.comments = this.comments.concat(res.comments)
                    this.total = res.total
                    this.hasMore = res.hasMore
                })
            },
            getHotComments() {
                getHotComment(this.subject.id, this.type).then(res => {
                    this.hotComments = res.comments.slice(0, 10)
                    this.allHotComments = res.comments
                })
            },
            showReply(comment) {
                this.replyFlag = true
                this.repliedComment = comment
            },
            selectInfo() {
                if(this.type === 'song') {
                    // 是song则触发播放
                    this.$bus.emit('requestPlayFromComment')
                }
                this.back()
            },
            back() {
                this.$emit('back')
            }
        },
        created() {
            this.loadMore()
            this.getHotComments()
            this.info = {
                id: this.subject.id,
                picUrl: this.subject.picUrl,
                main: this.subject.name,
                sub: this.subject.singer || this.subject.creator || ''
            }
        },
        mounted() {
            this.$emit('mountedCalled')
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
        z-index: 7500
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
            .all
                height: 60px
                display: flex
                justify-content: center
                align-items: center
                color: $color-text-light
</style>