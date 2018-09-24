<template>
    <div class='player' v-show='playlist.length'>
        <transition name='normal'>
            <div class='normal-player' v-show='fullScreen'>
                <div class='background'>
                    <img width='100%' height='100%' :src='currentSong.img'></img>
                </div>
                <div class='header' ref='header'>
                    <div @click='goBack'><IconSvg class='header-back' icon-class='back'></IconSvg></div>
                    <div class='header-info'>
                        <div class='header-info-title'>{{currentSong.name}}</div>
                        <div class='header-info-singer'>
                            <div class='header-info-singer-name'>{{currentSong.singer}}</div>
                            <IconSvg class='header-info-singer-back' icon-class='arrow-right'></IconSvg>
                        </div>
                    </div>
                </div>
                <div class='middle'>
                    <div class='cd-wrapper'>
                        <div class='cd' :class='cdStatus'>
                            <img :src='currentSong.img' class='cd-img'></img>
                        </div>
                    </div>
                </div>
                <div class='bottom'>
                    <div class='progress'>
                        <span class='time time-left'>{{formatTime(currentTime)}}</span>
                        <div class='progressbar'>
                            <progressbar :percent='percent' @percentChange="progressBarChange" @percentChanging="progressBarChanging"></progressbar>
                        </div>
                        <span class='time time-right'>{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class='operator'>
                        <!-- 这五个按钮公用一个样式类，就是operator-icon，用空格和自有样式类分开 -->
                        <div class='operator-icon mode' @click='toggleMode'>
                            <IconSvg :icon-class='modeIcon'></IconSvg>
                        </div>
                        <div class='operator-icon pre' @click='playPre'>
                            <IconSvg icon-class='pre'></IconSvg>
                        </div>
                        <div class='operator-icon play' @click='togglePlay'>
                            <IconSvg icon-class='play' v-show='!playing'></IconSvg>
                            <IconSvg icon-class='pause' v-show='playing'></IconSvg>
                        </div>
                        <div class='operator-icon next' @click='playNext'>
                            <IconSvg icon-class='next'></IconSvg>
                        </div>
                        <div class='operator-icon list' @click='showPlayList'>
                            <IconSvg icon-class='play-history'></IconSvg>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class='mini-player' v-show='!fullScreen' @click='toggleFullScreen'>
            <img  :src='currentSong.img' class='img'></img>
            <div class='name'>{{currentSong.name}}</div>
            <div class='operator-icon play' @click.stop='togglePlay'>
                <IconSvg icon-class='play' v-show='!playing'></IconSvg>
                <IconSvg icon-class='pause' v-show='playing'></IconSvg>
            </div>
            <div class='list' @click.stop='showMiniList'>
                <IconSvg icon-class='play-history'></IconSvg>
            </div>
        </div>
        <minilist :list='sequenceList' v-show='miniListFlag'></minilist>
        <audio ref='audio' @playing='audioReady' @timeupdate='timeupdate' @ended='ended' @pause='paused'></audio>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { playMode } from 'common/js/config'
    import { generateRandomList } from 'common/js/tools'
    import minilist from 'components/mini-list/mini-list'
    import progressbar from 'base/progress-bar/progress-bar'
    export default {
        name: 'player',
        components: {
            minilist,
            progressbar
        },
        props: {

        },
        data() {
            return {
                miniListFlag: false,
                songReady: false,
                currentTime: 0,
                timer: null,
                progressBarMoving: false
            }
        },
        computed: {
            ...mapGetters([
                'fullScreen',
                'playlist',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ]),
            modeIcon() {
                let icon = null
                switch(this.mode) {
                    case 0:
                        icon = 'list-cycle'
                        break
                    case 1:
                        icon = 'random'
                        break
                    case 2:
                        icon = 'single-cycle'
                        break
                    default:
                        break
                }
                return icon
            },
            cdStatus() {
                return this.playing ? 'play' : 'play pause'
            },
            percent() {
                return this.currentTime / this.currentSong.duration
            }
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
                    return
                }
                this.songReady = false
                this.$refs.audio.src = newSong.url
                this.$refs.audio.play()

                // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲
                this.clearTimer()
                this.timer = setTimeout(() => {
                    this.songReady = true
                }, 5000)
            },
            playing(val) {
                if(!this.songReady) {
                    return
                }
                const audio = this.$refs.audio
                audio.load()
                this.$nextTick(() => {
                    console.log('start pause')
                    val ? audio.play() : audio.pause()
                    console.log('complete pause')
                })
            }
        },
        methods: {
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode: 'SET_PLAY_MODE',
                setPlaylist: 'SET_PLAYLIST'
            }),
            togglePlay() {
                if (!this.songReady) {
                    return
                }
                this.setPlayingState(!this.playing)
            },
            toggleMode() {
                const modesCount = Object.keys(playMode).length
                const nextMode = (this.mode + 1) % modesCount
                this.setPlayMode(nextMode)
                let list = null
                if(nextMode === playMode.random) {
                    list = generateRandomList(this.sequenceList)
                } else if(nextMode == playMode.listCycle) {
                    list = this.sequenceList
                } else if(nextMode == playMode.singleCycle) {
                    list = [this.currentSong]
                }
                // 切换list时，确保currentIndex不变
                this.resetCurrentIndex(list)
                this.setPlaylist(list)
            },
            resetCurrentIndex(list) {
                let index = list.findIndex(i => i.id === this.currentSong.id)
                this.setCurrentIndex(index)
            },
            playNext() {
                if (!this.songReady) {
                    return
                }
                this.setCurrentIndex((this.currentIndex+1) % this.playlist.length)
                if (!this.playing) {
                    this.setPlayingState(true)
                }
                this.songReady = false
            },
            ended() {
                console.log('ended')
                if(this.playlist.length > 1) {
                    this.setCurrentIndex((this.currentIndex+1) % this.playlist.length)
                    this.songReady = false
                } else if(this.playlist.length == 1) {
                    console.log('single loop')
                    this.currentTime = this.$refs.audio.currentTime = 0
                }
            },
            playPre() {
                if (!this.songReady) {
                    return
                }
                this.setCurrentIndex((this.playlist.length + this.currentIndex -1) % this.playlist.length)
                if (!this.playing) {
                    this.setPlayingState(true)
                }
                this.songReady = false
            },
            showPlayList() {
                this.miniListFlag = true
            },
            goBack() {
                this.setFullScreen(false)
            },
            toggleFullScreen() {
                this.setFullScreen(true)
            },
            audioReady() {
                this.songReady = true
            },
            paused() {
                // 一首歌播放完，先触发了audio的pause，然后是ended
                console.log('pause')
                // this.setPlayingState(false)
            },
            timeupdate(e) {
                // 移动进度条时，更新this.currentTime，同时在播放，也会触发更新this.currentTime的这个函数
                if(this.progressBarMoving) {
                    return
                }
                this.currentTime = e.target.currentTime
                if(!this.playing) {
                    console.log('timeupdate',this.currentTime)
                }
            },
            progressBarChanging (percent) {
                this.progressBarMoving = true
                this.currentTime = this.currentSong.duration * percent
            },
            progressBarChange(percent) {
                const currentTime = this.currentSong.duration * percent
                this.currentTime = this.$refs.audio.currentTime = currentTime
                this.progressBarMoving = false
            },
            formatTime(interval) {
                interval = Math.floor(interval)
                const minute = Math.floor(interval / 60).toString().padStart(2,'0')
                const second = (interval % 60).toString().padStart(2,'0')
                return `${minute}:${second}`
            },
            clearTimer() {
                clearTimeout(this.timer)
                this.timer = null
            }
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
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .header
                position: fixed
                top: 0
                left: 0
                width: 100%
                height: 44px
                display: flex
                align-items: center
                &-back
                    float: left
                &-info
                    padding-left: 10px
                    padding-top: 15px
                    &-title
                        font-weight: bold
                    &-singer
                        float: left
                        display: flex
                        align-items: center
                        transform: scale(0.7)
                        // scale记得和origin一起用
                        transform-origin: left 
            .middle
                position: fixed
                top: 44px
                bottom: 100px
                width: 100%
                display: flex
                align-items: center
                .cd-wrapper
                    position: absolute
                    left: 15%
                    // 不能占满，设置width为75%后在左侧起始了(内部元素依然相对wrapper水平居中，但是相对窗口看着不居中了)
                    width: 70%
                    text-align: center
                    .cd
                        border: 45px solid $color-background-d
                        border-radius: 50%
                        // cd旋转动画，对应cdStatus
                        &.play
                            animation: rotate 20s linear infinite
                        &.pause
                            animation-play-state: paused 
                        .cd-img
                            height: 100%
                            width: 100%
                            border-radius: 50%
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
                        &.time-right
                            text-align: right
                            padding-right: 5px
                    .progressbar
                        flex: 1
                .operator
                    display: flex
                    flex-direction: row
                    align-items: center
                    line-height: 50px
                    &-icon
                        flex: 1
                        text-align: center
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .header, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .header
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)
        .mini-player
            position: fixed
            bottom: 0
            height: 44px
            width: 100%
            z-index: 1000
            background: $color-background
            .img
                height: 44px
                border-radius: 20%
                float: left
            .name
                padding-left: 5px
                float: left
            .play
                position: fixed
                bottom: 0
                right: 50px
            .list
                position: fixed
                bottom: 0
                right: 10px
    // 定义cd旋转的rotate
    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>