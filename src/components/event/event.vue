<template>
    <scroll class='events' ref='scroll' :data='events'>
        <div>
            <div v-for='event in events' :key='event.id' class='event'>
                <liner :hasBorder='false' :circleImg='true' :light='true' :picUrl='event.user.picUrl' :main='eventMain(event)' :sub='event.time' height='40px' :showImg='true' :selectable='true' @select='showHomePage(event.user.id)'></liner>
                <div class='msg'>{{event.msg}}</div>
                <section class="pic-list" v-if='event.pics.length'>
                    <div v-for='(pic, index) in event.pics' :key='index' class='pic-list-item' :style='picStyle(pic)'></div>
                </section>
                <div class='song-wrapper' v-if='event.song'>
                    <liner :hasBorder='false' :picUrl='event.song.picUrl' :main='event.song.name' :sub='event.song.singer' height='40px' :showImg='true' :selectable='true' @select='selectSong(event.song)'></liner>
                </div>
                <!-- <div class='operation'>
                    <span class='empty'></span>
                    <div class='operation-btn' @click='showComment(event)'><IconImg imgName='comment' class='comment-btn' size='20px'></IconImg><span>{{commentText(event)}}</span></div>
                    <div class='operation-btn' @click='toggleLike(event)'><IconImg :imgName='likeIcon(event)' size='20px' :ref='event.id'></IconImg><span>{{likeText(event)}}</span></div>
                </div> -->
            </div>
        </div>
    </scroll>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'
    // import { bubble } from 'common/js/dom'
    import scroll from 'base/scroll/scroll'
    import liner from 'base/liner/liner'
    export default {
        name: 'event',
        components: {
            scroll,
            liner
        },
        props: {
            events: {
                type: Array,
                default: () => []
            },
            // 点击用户头像可进入用户主页
            accessHomepage: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // likedEvents: []
            }
        },
        methods: {
            eventMain(event) {
                let text = ''
                if(event.song) {
                    text = '分享单曲'
                }
                return `<span style="color: #99ccff">${event.user.name}</span><span> ${text}:</span>`
            },
            picStyle(pic) {
                return `background-image:url(${pic})`
            },
            showHomePage(id) {
                if(!this.accessHomepage) {
                    return
                }
                this.showComponent('homepage', id)
            },
            // commentText(event) {
            //     return event.commentCount > 0 ? event.commentCount : '评论'
            // },
            // likeText(event) {
            //     const liked = this.likedEvents.find(i => i == event.id) ? 1 : 0
            //     const total = event.likedCount + liked
            //     return total > 0 ? total : '点赞'
            // },
            // likeIcon(event) {
            //     const liked = !!this.likedEvents.find(i => i == event.id)
            //     return liked ? 'note-liked' : 'note-like'
            // },
            // toggleLike(event) {
            //     const index = this.likedEvents.findIndex(i => i == event.id)
            //     if(index > -1) {
            //         // 取消
            //         this.likedEvents.splice(index, 1)
            //     } else {
            //         // 点赞
            //         bubble(this.$refs[event.id][0].$el)
            //         this.likedEvents.push(event.id)
            //     }
            // },
            // showComment(event) {

            // },
            selectSong(song) {
                this.insertSong(song)
            },
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .events
        background: $color-background
        .event
            border-bottom: 1px solid $color-light
            padding-top: 15px
            .msg
                font-size: 13px
                line-height: 20px
                margin: 5px 5px 5px 50px
            .pic-list
                display: flex
                flex-wrap: wrap
                margin: 5px 5px 5px 50px
                .pic-list-item
                    border-radius: 5px
                    flex: 0 0 33%
                    padding-top: 33%
                    background-repeat: no-repeat
                    background-size: cover
                    background-position: center
                    background-clip: padding-box
                    box-sizing: border-box
                    border: 1.5px solid transparent
                    .pic-list-item:first-child:nth-last-child(4) ~ .pic-list-item:nth-child(2)
                        margin-right: 33%
            .song-wrapper
                background: rgba(144,144,144,0.1)
                margin: 0 10px 10px 50px
                border-radius: 5px
            // .operation
            //     display: flex
            //     align-items: center
            //     padding-bottom: 10px
            //     .empty
            //         flex: 1
            //     .operation-btn
            //         margin: 0 15px
            //         display: flex
            //         align-items: center
            //         .comment-btn
            //             filter: brightness(40%)
            //         span
            //             font-size: $font-size-small-s
            //             color: $color-text-ii
            //             margin-left: 5px
        .event-empty
            font-size: $font-size-medium-x
            color: $color-text-ii
            display: flex
            justify-content: center
            padding-top: 50px
</style>