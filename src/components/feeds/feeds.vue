<template>
    <event v-if='events.length' :events='events'></event>
</template>
<script>
    import { getFeed } from 'api/feed'
    import { loginStatus } from 'api/login'
    import { getUserFollowing, getUserEvent } from 'api/user'
    import { mapActions, mapGetters } from 'vuex'
    import event from 'components/event/event'
    export default {
        name: 'feeds',
        components: {
            event
        },
        props: {

        },
        data() {
            return {
                following: [],
                events: []
            }
        },
        computed: {
            ...mapGetters([
                'loginUser'
            ])
        },
        watch: {

        },
        methods: {
            getFollowing() {
                loginStatus().then(res => {
                    getUserFollowing(res.id, 1).then(res => {
                        this.following = res
                        const promises = res.map(user => {
                            return getUserEvent(user.id)
                        })
                        Promise.all(promises).then(events => {
                        })
                    })
                })
                
            },
            getFeeds() {
                getFeed().then(res => {
                    this.events = res.filter(i => i)
                })
            },
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
            selectSong(song) {
                this.insertSong(song)
            },
            ...mapActions([
                'insertSong'
            ])
        },
        created() {
            this.getFeeds()
            // this.getFollowing()
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .events
        background: $color-background
        .event
            border-bottom: 1px solid $color-light
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
        .event-empty
            font-size: $font-size-medium-x
            color: $color-text-ii
            display: flex
            justify-content: center
            padding-top: 50px
</style>