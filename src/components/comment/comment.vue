<template>
    <transition name='comment'>
        <div class='comment'>
            <FunctionalHeader title='评论' @back='back'></FunctionalHeader>
            <!-- TODO, :data='' -->
            <scroll class='scroll' :pullup='true' @scrollToEnd='loadMore'>
                <div>
                    <div class='song' @click='selectSong'>
                        <liner :picUrl='song.picUrl' :main='song.name' :sub='song.singer' height='80px' :hasBorder='false'></liner>
                    </div>
                    <div class='header'>精彩评论</div>
                    <cline></cline>
                    <div class='header'>最新评论</div>
                    <cline></cline>
                    <!-- 如果还有数据, 则拉到最底时显示loading，加载完数据后，内容增多，loading组件被推到下面了 -->
                    <loading v-show='hasMore'></loading>
                </div>
            </scroll>
        </div>
    </transition>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import scroll from 'base/scroll/scroll'
    import liner from 'base/liner/liner'
    import cline from './sub-components/cline'
    import loading from 'base/loading/loading'
    export default {
        name: 'comment',
        components: {
            FunctionalHeader,
            scroll,
            liner,
            cline,
            loading
        },
        props: {
            song: {
                type: Object
            }
        },
        data() {
            return {
                curPage: 1,
                hasMore: false,
                comments: []
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
                getComments(this.curPage).then(res => {
                    this.comments = this.comments.concat(res)
                    this.checkMore()
                })
            },
            checkMore() {

            },
            selectSong() {

            },
            back() {
                this.$emit('back')
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
</style>