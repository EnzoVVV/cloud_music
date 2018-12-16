<template>
    <transition name='recommend'>
        <div class='recommend'>
            <FunctionalHeader title='每日推荐' @back='goback'></FunctionalHeader>
            <scroll class='scroll' ref='scroll'>
                <div :style='bgStyle'>
                    <div class='bg'>
                        <div class='info'>
                            <IconSvg icon-class='calendar' class='calendar' size='150px'></IconSvg>
                            <span class='date'>{{day}}</span>
                        </div>
                    </div>
                    <songlist :songs='songs' @click='selectSong' @clickHeader='playAll' class='songlist' :showHeader='true'></songlist>
                </div>
            </scroll>
        </div>
    </transition>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import FunctionalHeader from 'base/functional-header/functional-header'
    import songlist from 'components/song-list/song-list'
    import { mapActions } from 'vuex'
    import { getDailyRecommend } from 'api/recommend'
    import { mockImg } from 'common/js/config'
    import { createSong } from 'common/js/song'
    export default {
        name: 'DailyRecommend',
        components: {
            scroll,
            FunctionalHeader,
            songlist
        },
        props: {

        },
        data() {
            return {
                songs: []
            }
        },
        computed: {
            day() {
                return (new Date()).getDate()
            },
            bgStyle() {
                return {
                    'background-image': `url(${this.bgImg}`,
                    // 设置一个背景色, 背景图片失效时自动换成背景色
                    'background-color': '#F2F3F4'
                }
            }
        },
        watch: {

        },
        methods: {
            goback() {
                this.$emit('back')
            },
            selectSong(song, index) {
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            playAll() {
                this.selectPlay({
                    list: this.songs,
                    index: 0
                })
            },
            ...mapActions([
                'selectPlay'
            ]),
            getRecommend() {
                getDailyRecommend().then(res => {

                })
            }
        },
        created() {
            // TODO， 需要登陆
            this.getRecommend()
            for(let i=0;i<30;i++) {
                const songData = {
                    id: i,
                    mid: i,
                    songname: '翅膀',
                    singer: [{name: '肆喜'}],
                    album: 'TV WATCH TV',
                    duration: 3,
                    img: mockImg,
                    url: ''
                }
                this.songs.push(createSong(songData))
            }
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .recommend
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 5000
        &.recommend-enter-active, &.recommend-leave-active
            transition: all 0.4s
        &.recommend-enter, &.recommend-leave-to
            transform: translate3d(0, 100%, 0)
        .scroll
            overflow: hidden
            position: absolute 
            top: 44px
            bottom: 0
            width: 100%
            .bg
                position: relative 
                width: 100%
                height: 160px
                overflow: hidden
                .info
                    position: absolute 
                    left: -20px
                    bottom: 0
                    .date
                        position: absolute 
                        left: 52px
                        bottom: 45px
                        font-size: $font-size-large-e
                        color: $color-text-a
            .songlist
                width: 100%
                height: 100%
</style>