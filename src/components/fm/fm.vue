<template>
    <div class='player'>
        <transition name='normal'>
            <div class='normal-player' v-show='fullScreen' ref='player'>
                <div class='background'>
                    <img :src='currentSong.picUrl' class='background-img'/>
                </div>
                <div class='header' ref='header'>
                    <div @click='toggleFullScreen' class='header-back'><IconSvg icon-class='back'></IconSvg></div>
                    <div class='header-middle'><IconImg imgName='personal_fm' size='45px'></IconImg></div>
                    <div class='header-menu'><IconImg imgName='uj'></IconImg></div>
                </div>
                <div class='middle'>
                    <div class='cd-wrapper' ref='cdWrapper'>
                        <img :src='currentSong.picUrl' class='img' @click='toggleLyric(true)'/>
                        <div class='name'>{{currentSong.name}}</div>
                        <div class='singer' @click.stop='showSingerDetail'>{{currentSong.singer}} ></div>
                    </div>
                    <scroll class='lyric-wrapper' ref='lyricWrapper'>
                        <div class='lyric' @click='toggleLyric(false)'>
                            <div v-if='currentLyric'>
                                <p v-for='(line,index) in currentLyric.lines' :key='index' ref='lyricLine' class='text' :class="{'current': currentLineNum === index}" >{{line.txt}}</p>
                            </div>
                            <div class='pure-music' v-if='isPureMusic'>
                                <p>{{pureMusicLyric}}</p>
                            </div>
                            <div v-if='!currentLyric' class='no-lyric' ref='noLyric'>
                                <p class='text' v-show='showLyric'>暂无歌词</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class='bottom'>
                    <div class='progress'>
                        <span class='time time-left'>{{formatTime(currentTime)}}</span>
                        <div class='progressbar'>
                            <progressbar :percent='percent' @percentChange='progressBarChange' @percentChanging='progressBarChanging'></progressbar>
                        </div>
                        <span class='time time-right'>{{formatTime(audioDuration)}}</span>
                    </div>
                    <div class='operator'>
                        <div class='operator-icon delete' @click='deleteOne'>
                            <IconSvg icon-class='clear' size='38px'></IconSvg>
                        </div>
                        <div class='operator-icon favorite' @click='toggleFavorite'>
                            <IconImg :imgName='favoriteIcon' ref='likeBtn'></IconImg>
                        </div>
                        <div class='operator-icon play' @click='togglePlay'>
                            <IconImg :imgName='playBtnIcon' size='60px'></IconImg>
                        </div>
                        <div class='operator-icon next' @click='playNext'>
                            <IconImg imgName='next' size='45px'></IconImg>
                        </div>
                        <div class='operator-icon comment' @click='showComment'>
                            <IconImg imgName='comment'></IconImg>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class='mini-player' v-show='!fullScreen && !coverMiniPlayer' @click='toggleFullScreen' ref='miniplayer'>
            <div class='img-wrapper'><img :src='currentSong.picUrl' class='img'/></div>
            <div class='info'>
                <div class='name'>{{currentSong.name}}</div>
                <div class='lyric' v-if='currentLyricText.length'>{{currentLyricText}}</div>
            </div>
            <progresscircle :radius='radius' :percent='percent' class='play'>
                <div @click.stop='togglePlay' class='circle-button'>
                    <IconSvg :icon-class='miniPlayBtnIcon' size='20px'></IconSvg>
                </div>
            </progresscircle>
            <div class='favorite' @click.stop='toggleFavorite'>
                <IconImg :imgName='favoriteMiniIcon' size='30px'></IconImg>
            </div>
        </div>
        <audio ref='audio' @playing='audioReady' @timeupdate='timeupdate' @ended='ended' @pause='paused'></audio>
        <!-- 选择查看的歌手 -->
        <modal v-if='selectSingerList.length' title='请选择要查看的歌手' :hideBtn='true' @hide='hideModal'>
            <scroll>
                <div>
                    <liner v-for='singer in selectSingerList' :key='singer.id' :showImg='true' :picUrl='singer.picUrl || defaultSingerPic' :main='singer.name' :selectable='true' @select='selectSinger(singer)'></liner>
                </div>
            </scroll>
        </modal>
    </div>
</template>

<script>
    import { getPersonalFM, trash } from 'api/fm'
    import { mapActions } from 'vuex'
    import { playersMixin } from 'common/js/mixins'
    import { bubble } from 'common/js/dom'
    export default {
        name: 'fm',
        mixins: [ playersMixin ],
        components: {
        },
        props: {

        },
        data() {
            return {
                songs: [],
                songsBuffer: [],
                currentIndex: null,
                currentSong: {},
                playing: false,
                fullScreen: true
            }
        },
        computed: {
            playBtnIcon() {
                return this.playing ? 'pause' : 'play'
            },
            miniPlayBtnIcon() {
                return this.playing ? 'pause-bare' : 'play-bare'
            },
            favoriteIcon() {
                if(this.FSToggled && this.FS) {
                    bubble(this.$refs.likeBtn.$el)
                }
                return this.FS ? 'liked' : 'like'
            },
            favoriteMiniIcon() {
                return this.FS ? 'mini-liked' : 'mini-like'
            }
        },
        watch: {
        },
        methods: {
            loadSong() {
                const curSong = this.currentSong = this.songs[this.currentIndex]
                if(this.songsBuffer.length === 0 && this.currentIndex >= this.songs.length - 3) {
                    this.getMore()
                }
                this.songReady = false
                // 停止歌词
                if(this.currentLyric) {
                    this.currentLyric.stop()
                }
                this.$refs.audio.src = curSong.url
                this.$refs.audio.play()
                if(!this.playing) {
                    this.playing = true
                }
                // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲
                this.clearTimer()
                this.timer = setTimeout(() => {
                    this.songReady = true
                }, 5000)
                this.getLyric()
                this.checkFS()
            },
            getFMData() {
                getPersonalFM().then(res => {
                    this.songs = res
                    this.currentIndex = 0
                    if(this.transitionCompleted) {
                        this.loadSong()
                    } else {
                        setTimeout(() => {
                            this.loadSong()
                        }, 300)
                    }
                })
            },
            getMore() {
                getPersonalFM().then(res => {
                    this.songsBuffer = res
                })
            },
            showComment() {
                this.showComponent('comment', 'song', this.currentSong)
            },
            togglePlay() {
                if (!this.songReady) {
                    return
                }
                this.playing = !this.playing
                // 暂停/播放歌词
                if(this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    this.playing ? audio.play() : audio.pause()
                })
            },
            playNext() {
                if (!this.songReady) {
                    return
                }
                this.doPlayNext()
            },
            doPlayNext() {
                if(this.currentIndex === this.songs.length -1) {
                    if(this.songsBuffer.length > 0) {
                        this.songs = this.songsBuffer.slice()
                        this.songsBuffer = []
                        this.currentIndex = 0
                        this.loadSong()
                    } else {
                        getPersonalFM().then(res => {
                            this.songs = res
                            this.currentIndex = 0
                            this.loadSong()
                        })
                    }
                } else {
                    this.currentIndex++
                    this.loadSong()
                }
            },
            ended() {
                this.doPlayNext()
            },
            deleteOne() {
                trash(this.currentSong.id)
                if(this.currentSong.favorite) {
                    this.toggleSongFS(this.currentSong)
                }
                this.doPlayNext()
            },
            toggleFavorite() {
                this.FSToggled = true
                this.FS = !this.FS
                this.toggleSongFS(this.currentSong)
            },
            ...mapActions([
                'stopPlaying'
            ]),
            toggleFullScreen() {
                this.liftPlayer()
                this.fullScreen = !this.fullScreen
            },
            paused() {
                // 一首歌播放完，先触发了audio的pause，然后是ended
                this.playing = false
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
                const audio = this.$refs.audio
                if(audio) {
                    audio.pause()
                }
            },
            show() {
                // FM已开时, 再点击FM入口按钮，则全屏并播放
                this.toggleFullScreen()
                if(!this.playing) {
                    this.togglePlay()
                }
            }
        },
        created() {
            this.getFMData()
            // 杀掉player, 1. 设置playing为false, 停止播放 2. player外层v-show 添加!FMSwitch, 隐藏player
            this.stopPlaying()
        },
        mounted() {
            setTimeout(() => {
                this.transitionCompleted = true
            }, 300)
            this.liftPlayer()
        }
    }
</script>

<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 7000
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(80px) brightness(5%)
                &-img
                    width: 100%
                    height: 100%
            .header
                position: fixed
                top: 0
                left: 0
                width: 100%
                height: 60px
                display: flex
                align-items: center
                &-back
                    padding-left: 10px
                &-middle
                    flex: 1
                    display: flex
                    justify-content: center 
                &-menu
                    padding-right: 10px
            .middle
                position: fixed
                top: 60px
                bottom: 120px
                z-index: 9999
                width: 100%
                display: flex
                align-items: center
                .cd-wrapper
                    position: absolute
                    top: 20px
                    bottom: 0
                    left: 5%
                    width: 90%
                    text-align: center
                    .img
                        max-height: 80%
                        width: 100%
                        border-radius: 5px
                    .name
                        margin-top: 20px
                        color: $color-text-a
                        font-size: $font-size-medium-x
                    .singer
                        margin-top: 10px
                        color: $color-text-light
                        font-size: $font-size-medium
                .lyric-wrapper
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden
                    .lyric
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            // 没有这个height，无法scroll
                            height: 32px
                            color: $color-text-i
                            font-size: $font-size-medium
                            &.current
                                color: $color-text-a
                        &.current
                            color: $color-text-l
                        .pure-music
                            padding-top: 50%
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                    .no-lyric
                        height: 100%
                        width: 100%
                        display: flex
                        justify-content: center
                        align-items: center
            .bottom
                position: fixed
                bottom: 10px
                width: 100%
                .progress
                    display: flex
                    align-items: center
                    width: 90%
                    margin: 0px auto
                    padding: 10px 0
                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        &.time-left
                            text-align: left
                            padding-right: 5px
                            color: $color-text-i
                        &.time-right
                            text-align: right
                            padding-left: 5px
                            color: $color-text-d
                    .progressbar
                        flex: 1
                .operator
                    display: flex
                    flex-direction: row
                    align-items: center
                    &-icon
                        flex: 1
                        text-align: center
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.3s
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .normal-player
                    transform: translate3d(0, 100%, 0)
        .mini-player
            position: fixed
            bottom: 0
            height: 44px
            width: 100%
            z-index: 5000
            background: $color-background
            display: flex
            align-items: center
            padding-left: 5px
            border-top: 1px solid $color-text-lighter
            .img
                height: 34px
                width: 34px
                border-radius: 20%
            .info
                flex-direction: column
                display: flex
                justify-content: center
                flex: 1
                padding-left: 5px
                .name
                    font-size: $font-size-medium-x
                    color: $color-text
                    padding-bottom: 5px
                    text-overflow: ellipsis 
                    overflow: hidden
                    white-space: nowrap
                .lyric
                    font-size: $font-size-small
                    color: $color-text-g
            .play
                margin: 0 15px
                position: relative
                .circle-button
                    position: absolute
                    top: 6px
                    left: 6px
            .favorite
                margin-right: 15px
                
</style>