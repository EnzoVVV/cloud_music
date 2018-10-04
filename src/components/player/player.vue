<template>
    <div class='player' v-show='playlist.length'>
        <transition name='normal'>
            <div class='normal-player' v-show='fullScreen'>
                <div class='background'>
                    <img :src='currentSong.img' class='background-img'></img>
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
                    <!-- 移动端，touch事件之后是click事件，为了click所以此处不能touchstart.prevent，如必须，则可以在touch处理函数中e.preventDefault -->
                    <div class='cd-wrapper' ref='cdWrapper' @click='toggleLyric(true)' @touchstart.stop='touchstart' @touchmove.stop='touchmove' @touchend.stop='touchend'>
                        <div class='cd' :class='cdStatus'>
                            <img :src='currentSong.img' class='cd-img'></img>
                        </div>
                    </div>
                    <div class='next-cd-wrapper' ref='nextCdWrapper' v-if='nextSong'>
                        <div class='next-cd'>
                            <img :src='nextSong.img' class='next-cd-img'></img>
                        </div>
                    </div>
                    <div class='pre-cd-wrapper' ref='preCdWrapper' v-if='preSong'>
                        <div class='pre-cd'>
                            <img :src='preSong.img' class='pre-cd-img'></img>
                        </div>
                    </div>
                    <scroll class='lyric-wrapper' ref='lyricWrapper'>
                        <div class="lyric" @click='toggleLyric(false)'>
                            <div v-if="currentLyric">
                                <p v-for="(line,index) in currentLyric.lines" :key='index' ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" >{{line.txt}}</p>
                            </div>
                            <div class="pure-music" v-if="isPureMusic">
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
            <progresscircle :radius="radius" :percent="percent" class='play'>
                <div @click.stop='togglePlay'>
                    <IconSvg icon-class='play' v-show='!playing'></IconSvg>
                    <IconSvg icon-class='pause' v-show='playing'></IconSvg>
                </div>
            </progresscircle>
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
    import Lyric from 'lyric-parser'
    import scroll from 'base/scroll/scroll'
    import slider from 'base/slider/slider'
    import progresscircle from 'base/progress-circle/progress-circle'
    import { transform, transitionDuration } from 'common/js/dom'
    export default {
        name: 'player',
        components: {
            minilist,
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
                radius: 32
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
                return this.currentTime / this.currentSong.duration
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
                // 暂停/播放歌词
                if(this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
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
                if(this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000) // 毫秒
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
                const clientWidth = this.$refs.middle.clientWidth
                let offsetWidth = 0
                this.touch.percent = deltaX / clientWidth
                if(deltaX < 0) {
                    // 左滑，下一首
                    offsetWidth = Math.max(0, clientWidth + deltaX)
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
                    offsetWidth = Math.min(clientWidth, -clientWidth + deltaX)
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
                const clientWidth = this.$refs.middle.clientWidth
                const duration = 300
                if(this.touch.percent < 0) {
                    // 左滑
                    this.$refs.nextCdWrapper.style[transitionDuration] = duration + 'ms'
                    this.$refs.cdWrapper.style[transitionDuration] = duration + 'ms'
                    if(-this.touch.percent >= 0.5) {
                        // 切下一首
                        this.$refs.nextCdWrapper.style[transform] = 'translate3d(0,0,0)'
                        this.$refs.cdWrapper.style[transform] = `translate3d(${-clientWidth}px,0,0)`
                        setTimeout(() => {
                            this.playNext()
                        },duration)
                    } else {
                        // 切回本首
                        this.$refs.nextCdWrapper.style[transform] = `translate3d(${clientWidth}px,0,0)`
                        this.$refs.cdWrapper.style[transform] = 'translate3d(0,0,0)'
                    }
                } else {
                    // 右滑
                    this.$refs.preCdWrapper.style[transitionDuration] = duration + 'ms'
                    this.$refs.cdWrapper.style[transitionDuration] = duration + 'ms'
                    if(this.touch.percent >= 0.5) {
                        // 切前一首
                        this.$refs.preCdWrapper.style[transform] = 'translate3d(0,0,0)'
                        this.$refs.cdWrapper.style[transform] = `translate3d(${clientWidth}px,0,0)`
                        setTimeout(() => {
                            this.playPre()
                        },duration)
                    } else {
                        // 切回本首
                        this.$refs.preCdWrapper.style[transform] = `translate3d(${-clientWidth}px,0,0)`
                        this.$refs.cdWrapper.style[transform] = 'translate3d(0,0,0)'
                    }
                }
            },
            // 加载前后歌曲信息，并设置位置
            getSideSong() {
                this.nextSong = this.playlist[(this.currentIndex + 1) % this.playlist.length]
                this.preSong = this.playlist[(this.playlist.length + this.currentIndex -1) % this.playlist.length]
                this.$nextTick(() => {
                    let clientWidth = this.$refs.middle.clientWidth
                    // transitionDuration必须带单位，如果为0s为是默认值，如果为0则是无效值
                    this.$refs.nextCdWrapper.style[transitionDuration] = '0s'
                    this.$refs.preCdWrapper.style[transitionDuration] = '0s'
                    this.$refs.nextCdWrapper.style[transform] = `translate3d(${clientWidth}px,0,0)`
                    this.$refs.preCdWrapper.style[transform] = `translate3d(${-clientWidth}px,0,0)`
                })
            },
            getLyric() {
                this.currentSong.getLyric().then(lyric => {
                    this.currentLyric = new Lyric(lyric,this.handleLyric)
                    console.log('currentLyric is ',this.currentLyric)
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
                console.log('handleLyric, lineNum is ',lineNum)
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
                console.log('toggleLyric')
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
                filter: blur(80px) brightness(50%)
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
                            color: $color-text-d
                            font-size: $font-size-medium
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