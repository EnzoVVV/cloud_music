<template>
    <div class='player' v-show='playlist.length && !FMSwitch'>
        <transition name='normal'>
            <div class='normal-player' v-show='fullScreen' ref='player'>
                <div class='background'>
                    <img :src='currentSong.picUrl' class='background-img'/>
                </div>
                <div class='header' ref='header'>
                    <div @click='goBack' class='header-back'><IconSvg icon-class='back'></IconSvg></div>
                    <div class='header-info'>
                        <div class='header-info-title' v-if='!longTitle'>{{headerTitle}}</div>
                        <roller class='header-info-title' v-else :content='headerTitle' :fontSize='14' :height='16'></roller>
                        <div class='header-info-singer' @click='showSingerDetail' v-show='curSinger'>{{curSinger}} ></div>
                    </div>
                    <div class='header-share'><IconSvg icon-class='share' size='23px'></IconSvg></div>
                </div>
                <div class='middle' ref='middle'>
                    <IconImg imgName='stylus' ref='stylus' class='stylus' v-show='!showLyric'></IconImg>
                    <!-- 切换歌词页面的click事件替换成在touchend中处理了 -->
                    <!-- 移动端，touch事件之后是click事件，为了click所以此处不能touchstart.prevent，如必须，则可以在touch处理函数中e.preventDefault -->
                    <div class='cd-wrapper' ref='cdWrapper' @touchstart.stop='touchstart' @touchmove.stop='touchmove' @touchend.stop='touchend'>
                        <div class='cd' :class='cdStatus' ref='cd'>
                            <img :src='currentSong.picUrl' class='cd-img' ref='cdImg'/>
                        </div>
                    </div>
                    <div class='next-cd-wrapper' ref='nextCdWrapper' v-if='nextSong'>
                        <div class='next-cd'>
                            <img :src='nextSong.picUrl' class='next-cd-img'/>
                        </div>
                    </div>
                    <div class='pre-cd-wrapper' ref='preCdWrapper' v-if='preSong'>
                        <div class='pre-cd'>
                            <img :src='preSong.picUrl' class='pre-cd-img'/>
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
                                <p class='text' v-show='showLyric'>暂无歌词</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class='bottom'>
                    <div class='func'>
                        <div class='btn' ref='likeBtn' @click='toggleFS'><IconImg :imgName='likeIcon'></IconImg></div>
                        <div class='btn' @click='showComment'><IconImg imgName='comment'></IconImg></div>
                        <div class='btn' @click='infoListFlag = true'><IconImg imgName='uj'></IconImg></div>
                    </div>
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
                            <IconImg :imgName='modeIcon' size='55px'></IconImg>
                        </div>
                        <div class='operator-icon pre' @click='playPre'>
                            <IconImg imgName='pre' size='45px'></IconImg>
                        </div>
                        <div class='operator-icon play' @click='togglePlay'>
                            <IconImg :imgName='playBtnIcon' size='60px'></IconImg>
                        </div>
                        <div class='operator-icon next' @click='playNext'>
                            <IconImg imgName='next' size='45px'></IconImg>
                        </div>
                        <div class='operator-icon list' @click='showPlayList'>
                            <IconImg imgName='list-icon' size='55px'></IconImg>
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
            <div class='list' @click.stop='miniListFlag = true'>
                <IconSvg icon-class='play-history'></IconSvg>
            </div>
        </div>
        <audio ref='audio' @playing='audioReady' @timeupdate='timeupdate' @ended='ended' @pause='paused'></audio>
        <minisonglist v-if='miniListFlag' @hide='miniListFlag = false'></minisonglist>
        <!-- 选择查看的歌手 -->
        <modal v-if='selectSingerList.length' title='请选择要查看的歌手' :hideBtn='true' @hide='hideModal'>
            <scroll class='selected-singer-list'>
                <div>
                    <liner v-for='singer in selectSingerList' :key='singer.id' :showImg='true' :picUrl='singer.picUrl || defaultSingerPic' :main='singer.name' :selectable='true' @select='selectSinger(singer)'></liner>
                </div>
            </scroll>
        </modal>
        <!-- 歌曲信息 -->
        <infolist v-if='infoListFlag' :song='currentSong' @hide='infoListFlag = false'></infolist>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { transform, transitionDuration,translate, rotate, bubble } from 'common/js/dom'
    import { checkSong } from 'api/song'
    import { qsearch } from 'api/search'
    import { playerMixin, playersMixin } from 'common/js/mixins'
    import { deepCopy } from 'common/js/tools'
    import { sin, cos, arcsin, arccos, arctan, Pythagorean, getDegreeInTriangle } from 'common/js/math'
    import { playMode } from 'common/js/config'
    const minisonglist = () => import('components/mini-song-list/mini-song-list')
    const infolist = () => import('components/info-list/info-list')
    const roller = () => import('base/roller/roller')

    import PopupManager from 'common/js/popup-manager'
    // 切歌动画transitionDuration(ms)
    const duration = 300
    const translateOption = {
        transitionDuration: duration + 'ms'
    }

    // 黑胶针图片宽305高555, radius为旋转中心点到图片边缘的距离
    const stylus_radius_width_ratio = 50 / 305
    const stylus_radius_height_ratio = 50 / 555
    const stylus_width_height_ratio = 305 / 555
    // 黑胶针针尖到图片边缘距离为30
    const stylus_pin_width_ratio = 35 / 305
    const stylus_pin_height_ratio = 35 / 555
    // 黑胶针偏移角度修正量
    const angleModifier_0 = 0.7
    const angleModifier_1 = 2
    // 页面header，bottom的高度
    const header_height = 44
    const bottom_height = 138
    
    export default {
        name: 'player',
        mixins: [ playerMixin, playersMixin ],
        components: {
            minisonglist,
            infolist,
            roller
        },
        data() {
            return {
                miniListFlag: false,
                touch: {},
                nextSong: null,
                preSong: null,
                switchedSong: null,
                clientWidth: window.innerWidth,
                infoListFlag: false,
                longTitle: false,
                defaultSingerPic: 'static/images/default-avatar.png'
            }
        },
        computed: {
            ...mapGetters([
                'fullScreen',
                'playlist',
                'playing',
                'currentIndex',
                'FMSwitch'
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
            infoListTitle() {
                return `歌曲: ${this.currentSong.name}`
            },
            headerTitle() {
                const title = this.switchedSong && this.switchedSong.name || ''
                this.longTitle = title.length * 14 > window.innerWidth - 25 - 10
                return title
            },
            likeIcon() {
                if(this.FSToggled && this.FS) {
                    // 手动点击按钮才有bubble效果，渲染时执行到这里没有动画效果
                    bubble(this.$refs.likeBtn)
                }
                return this.FS ? 'liked' : 'like'
            },
            curSinger() {
                return this.switchedSong && this.switchedSong.singer || ''
            }
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
                    return
                }
                // 先杀掉FM
                if(this.FMSwitch) {
                    this.showComponent('FM', false)
                }
                // 检查歌曲是否可播放
                checkSong(newSong.id).then(res => {
                    if(res.success) {
                        this.loadSong(newSong)
                    } else {
                        this.$message('网易云暂无此歌版权, 正在搜索QQ曲库')
                        qsearch(newSong.name, newSong.singer).then(result => {
                            if(result) {
                                const copySong = deepCopy(newSong)
                                copySong.url = result
                                this.loadSong(copySong)
                            } else {
                                this.handleSongError(newSong)
                            }
                        }).catch(() => {
                            this.handleSongError(newSong)
                        })
                    }
                })
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
            showComment() {
                this.setFullScreen(false)
                this.showComponent('comment', 'song', this.currentSong)
            },
            toggleFS() {
                this.FSToggled = true
                this.toggleSongFS(this.currentSong)
                this.FS = !this.FS
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE'
            }),
            loadSong(song) {
                this.songReady = false
                // 停止歌词
                this.stopLyric()
                this.$refs.audio.src = song.url
                this.$refs.audio.play()

                // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲
                this.clearTimer()
                this.timer = setTimeout(() => {
                    this.songReady = true
                }, 5000)
                this.getLyric()
                this.getSideSong()
                this.switchedSong = song
                // 如果是滑动cd图片来切歌，那将cdWrapper复位
                this.$refs.cdWrapper.style[transitionDuration] = '0s'
                this.$refs.cdWrapper.style[transform] = 'translate3d(0,0,0)'
                this.checkFS()
            },
            // 没有歌曲版权时的处理
            handleSongError(song) {
                setTimeout(() => {
                    this.$message('oops, 歌曲暂无版权')
                }, 1200)
                this.songReady = false
                this.setPlayingState(false)
                this.shiftStylus(true)
                // 停止歌词
                if(this.currentLyric) {
                    this.currentLyric.stop()
                    this.currentLyric = null
                    this.currentTime = 0
                    this.currentLineNum = 0
                    this.currentLyricText = ''
                }
                this.$refs.audio.src = ''
                this.$refs.audio.pause()
                this.getSideSong()
                this.switchedSong = song
            },
            togglePlay() {
                if (!this.songReady) {
                    return
                }
                this.shiftStylus(this.playing)
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
                if(this.playlist.length == 1 || this.mode == 2) {
                    // 列表只有一首歌或单曲循环
                    this.loop()
                    return
                }
                if(clicked) {
                    // 点击按钮切歌
                    translate(this.$refs.nextCdWrapper, 0, 0, translateOption)
                    translate(this.$refs.cdWrapper, -this.clientWidth, 0, translateOption)
                    // 切歌过程中先移开黑胶针
                    this.shiftStylus(true)
                    setTimeout(() => {
                        this.doPlayNext()
                        // 切歌完成，黑胶针复位
                        this.shiftStylus(false)
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
                if(this.playlist.length == 1 || this.mode == 2) {
                    // 列表只有一首歌或单曲循环
                    this.loop()
                    return
                }
                if(clicked) {
                    // 点击按钮切歌
                    translate(this.$refs.preCdWrapper, 0, 0, translateOption)
                    translate(this.$refs.cdWrapper, this.clientWidth, 0, translateOption)
                    this.shiftStylus(true)
                    setTimeout(() => {
                        this.doPlayPre()
                        this.shiftStylus(false)
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
            loop() {
                this.currentTime = this.$refs.audio.currentTime = 0
                this.$refs.audio.play()
                this.setPlayingState(true)
                if(this.currentLyric) {
                    this.currentLyric.seek(0)
                }
            },
            ended() {
                if(this.mode === playMode.singleCycle) {
                    this.loop()
                } else {
                    this.playNext()
                }
            },
            showPlayList() {
                this.miniListFlag = true
            },
            goBack() {
                this.setFullScreen(false)
            },
            toggleFullScreen() {
                this.liftPlayer()
                this.setFullScreen(true)
            },
            paused() {
                // 一首歌播放完，先触发了audio的pause，然后是ended
                this.setPlayingState(false)
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
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
                // 挪动cd的过程中，移开黑胶针
                if(!this.stylusShifted) {
                    this.shiftStylus(true)
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
                // 复位黑胶针
                this.shiftStylus(false)
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
            // cdImg加载完成后，将cd高度设置为和宽度相等，解决黑胶出现缝隙的问题
            edgeEqualiser(flag) {
                const cdImg = this.$refs.cdImg
                const cd = this.$refs.cd
                const equalise = () => {
                    cd.style.height = getComputedStyle(cd).width
                    // 一次性的
                    cdImg.removeEventListener('load', equalise)
                }
                cdImg.addEventListener('load', equalise)
            },
            // 移动黑胶针
            shiftStylus(flag) {
                // flag: true 移开；flag：false 复位
                const angleModifier = flag ? angleModifier_1 : angleModifier_0
                const angle = this.baseAngle - this.angle_cd_stylus * angleModifier
                rotate(this.$refs.stylus.$el, angle)
                this.stylusShifted = flag
            },
            // 设置黑胶针高度与位置
            setStylusPosition() {
                // header高度44，bottom高度100
                const middle_height = window.innerHeight - header_height - bottom_height
                const middle_width = window.innerWidth
                // cd区占总宽度70%, 黑胶是border的45px宽度
                let cd_radius = (middle_width * 0.7 - 45 * 2) / 2
                // 0.8是让黑胶针往下一点
                // 黑胶针高度
                const stylus_height = middle_height / 2 - cd_radius * 0.7
                // 黑胶针宽度
                const stylus_width = stylus_height * stylus_width_height_ratio
                // 设置黑胶针转子的中心到屏幕正中
                const stylus_left = middle_width / 2 - stylus_radius_width_ratio * stylus_width
                const stylus_top = -stylus_radius_height_ratio * stylus_height
                // 设置旋转中心点为黑胶针转子的中心
                const transformOriginX = stylus_radius_width_ratio * stylus_width
                const transformOriginY = stylus_radius_height_ratio * stylus_height
                
                Object.assign(this.$refs.stylus.$el.style, {
                    height: stylus_height + 'px',
                    width: stylus_width + 'px',
                    top: stylus_top + 'px',
                    left: stylus_left + 'px',
                    'transform-origin': `${transformOriginX}px ${transformOriginY}px`
                })

                // 设置针尖位置
                // 针尖pin到旋转中心radius的x轴距离
                const pin_radius_x = stylus_width * (1 - stylus_pin_width_ratio - stylus_radius_width_ratio)
                // 针尖pin到旋转中心radius的y轴距离
                const pin_radius_y = stylus_height * (1 - stylus_pin_height_ratio - stylus_radius_height_ratio)
                // 黑胶针默认状态， 旋转中心到针尖的连线与y轴的夹角
                const originAngle = arctan(pin_radius_x / pin_radius_y)
                // 黑胶针旋转中心到针尖的距离
                const stylus_radius = Pythagorean(pin_radius_x, pin_radius_y)
                // 黑胶针旋转中心到cd中心的距离
                const h = middle_height / 2
                // 当针尖pin刚好处在cd边缘时，旋转中心到针尖连线与y轴的夹角
                const angle_pin_cd = getDegreeInTriangle(stylus_radius, h, cd_radius)
                const R = cd_radius + 45
                // 当针尖pin刚好处在黑胶边缘时，旋转中心到针尖连线与y轴的夹角
                const angle_pin_stylus = getDegreeInTriangle(stylus_radius, h, R)
                // 将stylus rotate这个角度，会使pin刚好处在cd边缘
                this.baseAngle = originAngle - angle_pin_cd
                // pin在cd和pin在黑胶边缘之间，走过的夹角
                this.angle_cd_stylus = angle_pin_stylus - angle_pin_cd
                this.shiftStylus(false)
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
            toggleLyric(flag) {
                // 从歌词页面切回cd时，cd需要继续从之前的位置开始旋转，在cdStatus的代码控制暂停
                // cdWrapper不能用v-show='!showLyric'控制，因为v-show为false时，display：none，就不能切回时继续上次的位置了
                // flag true 显示歌词隐藏cd，flag false 隐藏歌词显示cd
                const cdVisibility = flag ? 'hidden' : 'visible'
                this.$refs.cdWrapper.style.visibility = cdVisibility
                if(this.$refs.nextCdWrapper) {
                    this.$refs.nextCdWrapper.style.visibility = cdVisibility
                }
                if(this.$refs.preCdWrapper) {
                    this.$refs.preCdWrapper.style.visibility = cdVisibility
                }
                this.$refs.lyricWrapper.$el.style.visibility = flag ? 'visible' : 'hidden'
                this.showLyric = flag
            }
        },
        mounted() {
            this.setStylusPosition()
            this.edgeEqualiser()
            this.$bus.on('liftPlayer', this.liftPlayer)
            // 当前歌曲临近的歌曲变化, 需要重新计算side song
            this.$bus.on('playlist-change', this.getSideSong)
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
                filter: blur(35px) brightness(30%)
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
                &-info
                    flex: 1
                    padding-left: 10px
                    padding-top: 10px
                    overflow: hidden
                    &-title
                        font-weight: bold
                        font-size: $font-size-medium
                        color: $color-text-a
                        height: 16px
                    &-singer
                        color: $color-text-i
                        display: flex
                        align-items: center
                        font-size: 8px
                        margin-right: 15px
                        text-overflow: ellipsis 
                        overflow: hidden
                        white-space: nowrap
                &-share
                    padding: 0 10px
            .middle
                position: fixed
                top: 44px
                bottom: 160px
                z-index: 9999
                width: 100%
                display: flex
                align-items: center
                overflow: hidden
                .stylus
                    position: absolute
                    top: 0
                    left: 50%
                    z-index: 1
                .cd-wrapper
                    position: absolute
                    left: 15%
                    // 不能占满，设置width为75%后在左侧起始了(内部元素依然相对wrapper水平居中，但是相对窗口看着不居中了)
                    width: 70%
                    .cd
                        border: 45px solid rgb(0,0,0)
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
                        border: 45px solid rgb(0,0,0)
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
                        border: 45px solid rgb(0,0,0)
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
                .func
                    display: flex
                    align-items: center
                    .btn
                        flex: 1
                        display: flex
                        justify-content: center
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
                overflow: hidden
                .name
                    font-size: $font-size-medium
                    color: $color-text
                    padding-bottom: 5px
                    text-overflow: ellipsis 
                    overflow: hidden
                    white-space: nowrap
                .lyric
                    font-size: $font-size-small-s
                    color: $color-text-g
            .play
                margin: 0 15px
                position: relative
                .circle-button
                    position: absolute
                    top: 6px
                    left: 6px
            .list
                margin-right: 10px
        .selected-singer-list
            overflow: hidden
            max-height: 400px
    // 定义cd旋转的rotate
    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>