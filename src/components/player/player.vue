<template>
    <div class='player' v-show='playlist.length'>
        <transition name='normal'>
            <div class='normal-player' v-show='fullScreen'>
                <div class='background'>
                    <img :src='currentSong.picUrl' class='background-img'></img>
                </div>
                <div class='header' ref='header'>
                    <div @click='goBack'><IconSvg class='header-back' icon-class='back'></IconSvg></div>
                    <div class='header-info'>
                        <div class='header-info-title'>{{switchedSong && switchedSong.name || ''}}</div>
                        <div class='header-info-singer'>
                            <div class='header-info-singer-name'>{{switchedSong && switchedSong.singer || ''}}</div>
                            <IconSvg class='header-info-singer-back' icon-class='arrow-right'></IconSvg>
                        </div>
                    </div>
                </div>
                <div class='middle' ref='middle'>
                    <!-- 切换歌词页面的click事件替换成在touchend中处理了 -->
                    <!-- 移动端，touch事件之后是click事件，为了click所以此处不能touchstart.prevent，如必须，则可以在touch处理函数中e.preventDefault -->
                    <div class='cd-wrapper' ref='cdWrapper' @touchstart.stop='touchstart' @touchmove.stop='touchmove' @touchend.stop='touchend'>
                        <div class='cd' :class='cdStatus'>
                            <img :src='currentSong.picUrl' class='cd-img'></img>
                        </div>
                    </div>
                    <div class='next-cd-wrapper' ref='nextCdWrapper' v-if='nextSong'>
                        <div class='next-cd'>
                            <img :src='nextSong.picUrl' class='next-cd-img'></img>
                        </div>
                    </div>
                    <div class='pre-cd-wrapper' ref='preCdWrapper' v-if='preSong'>
                        <div class='pre-cd'>
                            <img :src='preSong.picUrl' class='pre-cd-img'></img>
                        </div>
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
                                <p class='text'>暂无歌词</p>
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
                        <!-- 这五个按钮公用一个样式类，就是operator-icon，用空格和自有样式类分开 -->
                        <div class='operator-icon mode' @click='toggleMode'>
                            <IconSvg :icon-class='modeIcon'></IconSvg>
                        </div>
                        <div class='operator-icon pre' @click='playPre'>
                            <IconSvg icon-class='pre'></IconSvg>
                        </div>
                        <div class='operator-icon play' @click='togglePlay'>
                            <IconSvg :icon-class='playBtnIcon'></IconSvg>
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
            <div class='img-wrapper'><img :src='currentSong.picUrl' class='img'></img></div>
            <div class='name'>{{currentSong.name}}</div>
            <progresscircle :radius='radius' :percent='percent' class='play'>
                <div @click.stop='togglePlay' class='circle-button'>
                    <IconSvg :icon-class='miniPlayBtnIcon'></IconSvg>
                </div>
            </progresscircle>
            <div class='list' @click.stop='miniListFlag = true'>
                <IconSvg icon-class='play-history'></IconSvg>
            </div>
        </div>
        <minisonglist :list='sequenceList' v-show='miniListFlag'></minisonglist>
        <audio ref='audio' @playing='audioReady' @timeupdate='timeupdate' @ended='ended' @pause='paused'></audio>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import minisonglist from 'components/mini-song-list/mini-song-list'
    import progressbar from 'base/progress-bar/progress-bar'
    import Lyric from 'lyric-parser'
    import scroll from 'base/scroll/scroll'
    import slider from 'base/slider/slider'
    import progresscircle from 'base/progress-circle/progress-circle'
    import { transform, transitionDuration,translate } from 'common/js/dom'
    import { playerMixin } from 'common/js/mixins'

    // 切歌动画transitionDuration(ms)
    const duration = 300
    const translateOption = {
        transitionDuration: duration + 'ms'
    }
    export default {
        name: 'player',
        mixins: [playerMixin],
        components: {
            minisonglist,
            progressbar,
            scroll,
            slider,
            progresscircle
        },
        props: {

        },
        data() {
            return {
                miniListFlag: false,
                songReady: false,
                currentTime: 0,
                timer: null,
                progressBarMoving: false,
                currentLyric: null,
                showLyric: false,
                isPureMusic: false,
                pureMusicLyric: '纯音乐，请欣赏',
                currentLineNum: 0,
                touch: {},
                nextSong: null,
                preSong: null,
                switchedSong: null,
                radius: 32,
                clientWidth: window.innerWidth,
                // 音频时长
                audioDuration: 0
            }
        },
        computed: {
            ...mapGetters([
                'fullScreen',
                'playlist',
                'playing',
                'currentIndex'
            ]),
            playBtnIcon() {
                return this.playing ? 'pause' : 'play'
            },
            miniPlayBtnIcon() {
                return this.playing ? 'pause-bare' : 'play-bare'
            },
            cdStatus() {
                // 切歌时，旋转复位
                if(!this.songReady) {
                    return ''
                } else {
                    // 出现歌词时，旋转暂停
                    if(!this.showLyric) {
                        return this.playing ? 'play' : 'play pause'
                    } else {
                        return 'play pause'
                    }
                }
            },
            percent() {
                return this.audioDuration != 0 ? this.currentTime / this.audioDuration : 0
            }
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
                    return
                }
                this.songReady = false
                // 停止歌词
                if(this.currentLyric) {
                    this.currentLyric.stop()
                }
                this.$refs.audio.src = newSong.url
                this.$refs.audio.play()

                // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲
                this.clearTimer()
                this.timer = setTimeout(() => {
                    this.songReady = true
                }, 5000)
                this.getLyric()
                this.getSideSong()
                this.switchedSong = newSong
                // 如果是滑动cd图片来切歌，那将cdWrapper复位
                this.$refs.cdWrapper.style[transitionDuration] = '0s'
                this.$refs.cdWrapper.style[transform] = 'translate3d(0,0,0)'
            },
            playing(val) {
                if(!this.songReady) {
                    return
                }
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    val ? audio.play() : audio.pause()
                })
            }
        },
        methods: {
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE'
            }),
            togglePlay() {
                if (!this.songReady) {
                    return
                }
                this.setPlayingState(!this.playing)
                // 暂停/播放歌词
                if(this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
            },
            playNext(clicked = true) {
                if (!this.songReady) {
                    return
                }
                if(clicked) {
                    // 点击按钮切歌
                    translate(this.$refs.nextCdWrapper, 0, 0, translateOption)
                    translate(this.$refs.cdWrapper, -this.clientWidth, 0, translateOption)
                    setTimeout(() => {
                        this.doPlayNext()
                    },duration)
                } else {
                    // 滑动cd触发切歌
                    this.doPlayNext()
                }
            },
            doPlayNext() {
                this.setCurrentIndex((this.currentIndex+1) % this.playlist.length)
                if (!this.playing) {
                    this.setPlayingState(true)
                }
                this.songReady = false
            },
            playPre(clicked = true) {
                if (!this.songReady) {
                    return
                }
                if(clicked) {
                    // 点击按钮切歌
                    translate(this.$refs.preCdWrapper, 0, 0, translateOption)
                    translate(this.$refs.cdWrapper, this.clientWidth, 0, translateOption)
                    setTimeout(() => {
                        this.doPlayPre()
                    },duration)
                } else {
                    // 滑动cd触发切歌
                    this.doPlayPre()
                }
            },
            doPlayPre() {
                this.setCurrentIndex((this.playlist.length + this.currentIndex -1) % this.playlist.length)
                if (!this.playing) {
                    this.setPlayingState(true)
                }
                this.songReady = false
            },
            ended() {
                if(this.playlist.length > 1) {
                    this.setCurrentIndex((this.currentIndex+1) % this.playlist.length)
                    this.songReady = false
                } else if(this.playlist.length == 1) {
                    this.currentTime = this.$refs.audio.currentTime = 0
                }
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
                // 获取音频时长
                this.audioDuration = this.$refs.audio.duration
                this.clearTimer()
                // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
                this.songReady = true
                // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
                if (this.currentLyric && !this.isPureMusic) {
                    this.currentLyric.seek(this.currentTime * 1000)
                }
            },
            paused() {
                // 一首歌播放完，先触发了audio的pause，然后是ended
                this.setPlayingState(false)
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
            },
            timeupdate(e) {
                // 移动进度条时，更新this.currentTime，同时在播放，也会触发更新this.currentTime的这个函数
                if(this.progressBarMoving) {
                    return
                }
                this.currentTime = e.target.currentTime
            },
            progressBarChanging (percent) {
                this.progressBarMoving = true
                this.currentTime = this.audioDuration * percent
                if (this.currentLyric) {
                    this.currentLyric.seek(this.currentTime * 1000)
                }
            },
            progressBarChange(percent) {
                const currentTime = this.audioDuration * percent
                this.currentTime = this.$refs.audio.currentTime = currentTime
                this.progressBarMoving = false
                if(this.currentLyric) {
                    this.currentLyric.seek(this.currentTime * 1000) // 毫秒
                }
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
            },
            touchstart(e) {
                this.touch.initiated = true
                const touch = e.touches[0]
                this.touch.startX = touch.pageX
                this.touch.startY = touch.pageY
                this.touch.startTime = new Date()
            },
            touchmove(e) {
                if(!this.touch.initiated) {
                    return
                }
                const touch = e.touches[0]
                const deltaX = touch.pageX - this.touch.startX
                const deltaY = touch.pageY - this.touch.startY
                if(Math.abs(deltaY) > Math.abs(deltaX)) {
                    // 判断为非横滑
                    // return
                }
                let offsetWidth = 0
                this.touch.percent = deltaX / this.clientWidth
                if(deltaX < 0) {
                    // 左滑，下一首
                    offsetWidth = Math.max(0, this.clientWidth + deltaX)
                    this.$refs.nextCdWrapper.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                    this.$refs.cdWrapper.style[transform] = `translate3d(${deltaX}px,0,0)`
                    // 滑动超过一半时，切换header处显示的歌曲信息
                    if(-this.touch.percent >= 0.5) {
                        this.switchedSong = this.nextSong
                    } else {
                        this.switchedSong = this.currentSong
                    }
                } else {
                    // 右滑，上一首
                    offsetWidth = Math.min(this.clientWidth, -this.clientWidth + deltaX)
                    this.$refs.preCdWrapper.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                    this.$refs.cdWrapper.style[transform] = `translate3d(${deltaX}px,0,0)`
                    // 滑动超过一半时，切换header处显示的歌曲信息
                    if(this.touch.percent >= 0.5) {
                        this.switchedSong = this.preSong
                    } else {
                        this.switchedSong = this.currentSong
                    }
                }
            },
            touchend(e) {
                if(!this.touch.initiated) {
                    return
                }
                this.touch.initiated = false
                // 元素同时有touch事件和click事件，click事件的触发会守影响(延迟，被touch事件处理函数preventDefault或return而阻拦等)，所以用touchend检测click
                // percent是undefined，说明没有touchmove，是click
                if(this.touch.percent === undefined) {
                    const timecost = new Date() - this.touch.startTime
                    if(timecost < 120) {
                        this.toggleLyric(true)
                        return
                    }
                }
                if(this.touch.percent < 0) {
                    // 左滑
                    if(-this.touch.percent >= 0.5) {
                        // 切下一首
                        translate(this.$refs.nextCdWrapper, 0, 0, translateOption)
                        translate(this.$refs.cdWrapper, -this.clientWidth, 0, translateOption)
                        setTimeout(() => {
                            this.playNext(false)
                        },duration)
                    } else {
                        // 切回本首
                        translate(this.$refs.nextCdWrapper, this.clientWidth, 0, translateOption)
                        translate(this.$refs.cdWrapper, 0, 0, translateOption)
                    }
                } else {
                    // 右滑
                    if(this.touch.percent >= 0.5) {
                        // 切前一首
                        translate(this.$refs.preCdWrapper, 0, 0, translateOption)
                        translate(this.$refs.cdWrapper, this.clientWidth, 0, translateOption)
                        setTimeout(() => {
                            this.playPre(false)
                        },duration)
                    } else {
                        // 切回本首
                        translate(this.$refs.preCdWrapper, -this.clientWidth, 0, translateOption)
                        translate(this.$refs.cdWrapper, 0, 0, translateOption)
                    }
                }
            },
            // 加载前后歌曲信息，并设置位置
            getSideSong() {
                this.nextSong = this.playlist[(this.currentIndex + 1) % this.playlist.length]
                this.preSong = this.playlist[(this.playlist.length + this.currentIndex -1) % this.playlist.length]
                this.$nextTick(() => {
                    translate(this.$refs.nextCdWrapper, this.clientWidth)
                    translate(this.$refs.preCdWrapper, -this.clientWidth)
                })
            },
            getLyric() {
                this.currentSong.getLyric().then(lyric => {
                    this.currentLyric = new Lyric(lyric,this.handleLyric)
                }).catch(() => {
                    this.currentLyric = null
                    this.currentLineNum = 0
                    this.$nextTick(() => {
                        let wrapperHeight = this.$refs.lyricWrapper.$el.clientHeight
                        // 没有歌词时，将noLyric对应的div设置高度，不然区域太小点击不到，不容易切换回cd
                        if(this.$refs.noLyric) {
                            this.$refs.noLyric.style.height = wrapperHeight + 'px'
                        }
                    })
                })
                this.$nextTick(() => {
                    this.toggleLyric(this.showLyric)
                })
            },
            handleLyric({lineNum, txt}) {
                if(!this.$refs.lyricLine) {
                    return
                }
                this.currentLineNum = lineNum
                if(lineNum > 5) {
                    let lineEl = this.$refs.lyricLine[lineNum - 5]
                    this.$refs.lyricWrapper.scrollToElement(lineEl,1000)
                } else {
                    this.$refs.lyricWrapper.scrollTo(0,0,1000)
                }
            },
            toggleLyric(flag) {
                // 从歌词页面切回cd时，cd需要继续从之前的位置开始旋转，在cdStatus的代码控制暂停
                // cdWrapper不能用v-show='!showLyric'控制，因为v-show为false时，display：none，就不能切回时继续上次的位置了
                if(flag) {
                    // 显示歌词
                    this.$refs.cdWrapper.style.visibility = 'hidden'
                    this.$refs.lyricWrapper.$el.style.visibility = 'visible'
                    this.showLyric = true
                } else {
                    // 显示cd
                    this.$refs.cdWrapper.style.visibility = 'visible'
                    this.$refs.lyricWrapper.$el.style.visibility = 'hidden'
                    this.showLyric = false
                }
            }
        }
    }
</script>

<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .player
        // z-index不能写在这里，z-index只对定位元素有效
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 9999
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
                z-index: 9999
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
                .next-cd-wrapper
                    position: absolute
                    left: 15%
                    width: 70%
                    text-align: center
                    transform: translate(500px,0)
                    .next-cd
                        border: 45px solid $color-background-d
                        border-radius: 50%
                        .next-cd-img
                            height: 100%
                            width: 100%
                            border-radius: 50%
                .pre-cd-wrapper
                    position: absolute
                    left: 15%
                    width: 70%
                    text-align: center
                    transform: translate(-500px,0)
                    .pre-cd
                        border: 45px solid $color-background-d
                        border-radius: 50%
                        .pre-cd-img
                            height: 100%
                            width: 100%
                            border-radius: 50%
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
                        &.time-right
                            text-align: right
                            padding-left: 5px
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
            z-index: 9000
            background: $color-background
            display: flex
            align-items: center
            padding-left: 5px
            .img
                height: 34px
                width: 34px
                border-radius: 20%
                float: left
            .name
                width: calc(100% - 40px - 80px)
                padding-left: 5px
                float: left
            .play
                margin: 0 15px
                position: relative
                .circle-button
                    position: absolute
                    top: 4px
                    left: 4px
            .list
                margin-right: 10px
    // 定义cd旋转的rotate
    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>