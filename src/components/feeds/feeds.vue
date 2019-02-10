<template>
    <event :events='events' ref='events' class='events'></event>
</template>
<script>
    import { getFeed } from 'api/feed'
    import { loginStatus } from 'api/login'
    import { getUserFollowing, getUserEvent } from 'api/user'
    import { playlistMixin } from 'common/js/mixins'
    import { mapActions, mapGetters } from 'vuex'
    import event from 'components/event/event'
    export default {
        name: 'feeds',
        mixins: [ playlistMixin ],
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
            handlePlaylist(flag) {
                const events = this.$refs.events
                if(!events) {
                    return
                }
                const scroll = events.$refs.scroll
                const bottom = flag ? '45px' : '0'
                scroll.$el.style.bottom = bottom
                scroll.refresh()
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
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
</style>