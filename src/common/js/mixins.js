// ---------- js -------------------
import { playMode } from 'common/js/config'
import { generateRandomList } from 'common/js/tools'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PopupManager from 'common/js/popup-manager'

// ---------- 组件 -------------------
import liner from 'base/liner/liner'
import scroll from 'base/scroll/scroll'
const managelist = () => import('components/manage-list/manage-list')
const videolist = () => import('components/video-list/video-list')
const modal = () => import('base/modal/modal')
import progressbar from 'base/progress-bar/progress-bar'
import progresscircle from 'base/progress-circle/progress-circle'
import Lyric from 'lyric-parser'

// ---------- API -------------------


// ---------- Mixins -------------------
export const playerMixin = {
    computed: {
        ...mapGetters([
            'currentSong',
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
        }
    },
    methods: {
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlaylist: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'toggleSongFS'
        ]),
        toggleMode() {
            const modesCount = Object.keys(playMode).length
            const nextMode = (this.mode + 1) % modesCount
            this.setPlayMode(nextMode)
            let list = null
            if(nextMode === playMode.random) {
                list = generateRandomList(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // 切换list时，确保currentIndex不变
            this.resetCurrentIndex(list)
            this.setPlaylist(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex(i => i.id === this.currentSong.id)
            this.setCurrentIndex(index)
        }
    }
}


// 只有写在export对象内的才能被mixin, 这里import一个函数，但在export对象下没有应用这个函数， 那么在引用mixin的组件内， 是不能直接应用这个import的函数的
// import { search } from 'api/api'
export const resultMixin = {
    components: {
        scroll
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(['query']),
        noResult() {
            return `未找到与"${this.query}"相关内容`
        }
    },
    methods: {
        handlePlaylist(flag) {
            const scroll = this.$refs.scroll
            const bottom = flag ? '89px' : ''
            scroll.$el.style.bottom = bottom
            scroll.refresh()
        }
    }
}

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist',
            'FMSwitch'
        ])
    },
    mounted() {
        const flag = this.playlist.length > 0 || this.FMSwitch
        this.handlePlaylist(flag)
    },
    activated() {
        const flag = this.playlist.length > 0 || this.FMSwitch
        this.handlePlaylist(flag)
    },
    watch: {
        playlist(val) {
            if(!val || val.length === 0) return
            const flag = val.length > 0
            this.handlePlaylist(flag)
        },
        FMSwitch(val) {
            this.handlePlaylist(val)
        }
    },
    methods: {
        handlePlaylist(flag) {
            const scroll = this.$refs.scroll
            if(!scroll) {
                throw new Error('scroll组件的ref要设为scroll')
            }
            const bottom = flag ? '45px' : ''
            scroll.$el.style.bottom = bottom
            scroll.refresh()
        }
    }
}

export const scrollMixin = {
    components: {
        scroll
    },
    data() {
        return {
            scrollX: 0,
            scrollY: 0
        }
    },
    methods: {
        handleScroll(pos) {
            this.scrollX = pos.x
            this.scrollY = pos.y
        }
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
    }
}


export const collectionMixin = {
    components: {
        scroll,
        liner,
        managelist
    },
    mounted() {
        this.$bus.on('collection-search', this.search)
    }
}

// 用户页
export const homepageMixin = {
    components: {
        scroll,
        liner
    },
    methods: {
        selectSong(song) {
            this.insertSong(song)
        },
        ...mapActions([
            'insertSong'
        ])
    }
}

// 播放记录
export const recordMixin = {
    data() {
        return {
            records: []
        }
    },
    computed: {
        ...mapGetters([
            'homepage'
        ])
    },
    methods: {
        handlePlaylist(flag) {
            const scroll = this.$refs.scroll
            const bottomVal = 45 + 88 + 'px'
            const bottom = flag ? bottomVal : ''
            scroll.$el.style.bottom = bottom
            scroll.refresh()
        }
    },
    created() {
        this.getRecord()
    }
}

// 关注/粉丝
export const followMixin = {
    data() {
        return {
            follows: []
        }
    },
    computed: {
        ...mapGetters([
            'homepage'
        ])
    },
    methods: {
        handlePlaylist(flag) {
            const scroll = this.$refs.scroll
            const bottomVal = 45 + 88 + 'px'
            const bottom = flag ? bottomVal : ''
            scroll.$el.style.bottom = bottom
            scroll.refresh()
        }
    },
    created() {
        this.getFollows()
    }
}


// video
export const videoMixin = {
    render(h) {
        let children = []
        const self = this
        if(this.videolist.length > 0) {
            const videolistVNode = h(
                'videolist', {
                    props: {
                        videolist: self.videolist
                    }
                }
            )
            children.push(videolistVNode)
        } else {
            children = []
        }

        return h(
            'div', {
                attr: {
                    class: 'video'
                }
            }, children
        )
    },
    components: {
        videolist
    },
    data() {
        return {
            videolist: []
        }
    },
    created() {
        this.getVideo()
    }
}

// player和FM
export const playersMixin = {
    components: {
        modal,
        liner,
        scroll,
        progressbar,
        progresscircle
    },
    data() {
        return {
            songReady: false,
            currentTime: 0,
            timer: null,
            progressBarMoving: false,
            currentLyric: null,
            currentLyricText: '',
            showLyric: false,
            isPureMusic: false,
            pureMusicLyric: '纯音乐，请欣赏',
            currentLineNum: 0,
            radius: 32,
            // 音频时长
            audioDuration: 0,
            selectSingerList: [],
            FS: false,
            coverMiniPlayer: false
        }
    },
    computed: {
        percent() {
            return this.audioDuration != 0 ? this.currentTime / this.audioDuration : 0
        },
        ...mapGetters([
            'favoriteSongs'
        ])
    },
    methods: {
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        checkFS() {
            this.FS = !!this.favoriteSongs.find(i => i.id === this.currentSong.id)
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
            this.currentLyricText = txt
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
        },
        // 选择要查看的歌手
        showSingerDetail() {
            let singerInfo = this.currentSong.singerInfo
            if(singerInfo.length == 1) {
                // 只有一个歌手
                this.triggerSingerDetailPage(singerInfo[0])
            } else {
                // 多个歌手, 触发弹窗选择歌手
                this.selectSingerList = singerInfo.slice()
            }
        },
        selectSinger(singer) {
            this.selectSingerList = []
            this.triggerSingerDetailPage(singer)
        },
        hideModal() {
            this.selectSingerList = []
        },
        triggerSingerDetailPage(singer) {
            this.setSinger(singer)
            this.showComponent('singerdetail')
        },
        // 切换是否覆盖miniplayer
        handleCoverMiniPlayer(flag) {
            // 当前显示comment组件时，隐藏miniplayer
            this.coverMiniPlayer = flag
        },
        liftMiniPlayer() {
            // 每次用builder创建组件时，抬高miniplayer的zIndex
            // 使miniplayer的zIndex始终保持在最上层, 如果组件需要覆盖miniplayer，设置coverMiniPlayer控制miniplayer的v-show
            this.$refs.miniplayer.style.zIndex = PopupManager.nextZIndex()
        }
    },
    mounted() {
        this.$bus.on('coverMiniPlayer', this.handleCoverMiniPlayer)
        this.$bus.on('liftMiniPlayer', this.liftMiniPlayer)
    }
}