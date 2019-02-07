<template>
    <div class='events'>
        <div v-for='event in events' :key='event.id' class='event'>
            <liner :hasBorder='false' :circleImg='true' :light='true' :picUrl='event.user.picUrl' :main='eventMain(event)' :sub='event.time' height='40px' :showImg='true'></liner>
            <div class='msg'>{{event.msg}}</div>
            <section class="pic-list" v-if='event.pics.length'>
                <div v-for='(pic, index) in event.pics' :key='index' class='pic-list-item' :style='picStyle(pic)'></div>
            </section>
            <div class='song-wrapper' v-if='event.song'>
                <liner :hasBorder='false' :picUrl='event.song.picUrl' :main='event.song.name' :sub='event.song.singer' height='40px' :showImg='true' :selectable='true' @select='selectSong(event.song)'></liner>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'
    import liner from 'base/liner/liner'
    export default {
        name: 'event',
        components: {
            liner
        },
        props: {
            events: {
                type: Array,
                default: () => []
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
        .event-empty
            font-size: $font-size-medium-x
            color: $color-text-ii
            display: flex
            justify-content: center
            padding-top: 50px
</style>