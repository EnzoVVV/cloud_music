<template>
    <div class='videolist'>
        <scroll class='wrapper' ref='scroll'>
            <ul>
                <li v-for='video in videolist' :key='video.id' class='video'>
                    <vplayer :subject='video'></vplayer>
                    <div class='title'>{{video.name}}</div>
                    <div class='info'>
                        <img class='avatar' :src='video.picUrl'/>
                        <div class='artist'>{{video.artists[0].name}}</div>
                        <span class='empty'></span>
                        <div class='btn' @click='toggleLike(video)'><IconImg :imgName='likeIcon(video)' size='20px' :ref='video.id'></IconImg></div>
                        <div class='btn' @click='showComment(video)'><IconImg imgName='comment' class='comment-btn' size='20px'></IconImg></div>
                        <!-- <div class='btn' @click='infoListFlag = true'><IconImg imgName='um'></IconImg></div> -->
                    </div>
                </li>
                <div class='no-more'>没有更多啦</div>
            </ul>
        </scroll>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import vplayer from 'components/video-player/vplayer'
    import { bubble } from 'common/js/dom'
    import { playlistMixin } from 'common/js/mixins'
    import { likeVideo } from 'api/video'
    
    export default {
        name: 'videolist',
        mixins: [ playlistMixin ],
        components: {
            scroll,
            vplayer
        },
        props: {
            videolist: {
                type: Array
            }
        },
        data() {
            return {
                likedItems: []
            }
        },
        methods: {
            likeIcon(item) {
                if(item.liked) {
                    return 'note-liked'
                }
                const liked = !!this.likedItems.find(i => i == item.id)
                return liked ? 'note-liked' : 'note-like'
            },
            toggleLike(item) {
                const index = this.likedItems.findIndex(i => i == item.id)
                if(index > -1) {
                    // 取消
                    this.likedItems.splice(index, 1)
                } else {
                    // 点赞
                    bubble(this.$refs[item.id][0].$el)
                    this.likedItems.push(item.id)
                }
                likeVideo(item.id, index < 0)
            },
            showComment(video) {
                this.showComponent('comment', 'mv', video)
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .videolist
        position: absolute 
        top: 0
        left: 0
        bottom: 0
        right: 0
        overflow: hidden
        background: $color-text-d
        .wrapper
            position: absolute 
            top: 0
            left: 0
            bottom: 0
            right: 0
            overflow: hidden
            .video
                padding: 5px
                margin-bottom: 5px
                background: $color-text-a
                .title
                    margin: 10px 0
                    border-bottom: 1px solid $color-text-i
                .info
                    height: 44px
                    display: flex
                    align-items: center
                    border-top: 1px solid $color-light
                    .avatar
                        width: 30px
                        height: 30px
                        border-radius: 50%
                    .artist
                        padding-left: 5px
                        text-overflow: ellipsis 
                        overflow: hidden
                        white-space: nowrap
                    .empty
                        flex: 1
                    .btn
                        margin: 0 15px
                        .comment-btn
                            filter: brightness(40%)
            .no-more
                text-align: center
                padding: 15px
                color: $color-text-ii
</style>