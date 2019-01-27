// ----------js-------------------
import { playMode } from 'common/js/config'
import { generateRandomList } from 'common/js/tools'
import { mapGetters, mapMutations, mapActions } from 'vuex'

// ----------组件-------------------
import liner from 'base/liner/liner'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'


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
        scroll,
        loading
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
        this.handlePlaylist(this.playlist)
    },
    activated() {
        this.handlePlaylist(this.playlist)
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
        liner
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
            this.$bus.emit('shiftPlayer', true)
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

// 用户页提升player的zindex
export const shiftPlayerMixin = {
    methods: {
        shiftMiniPlayer(flag) {
            this.$refs.miniplayer.style.zIndex = flag ? 8000 : 5000
        },
        shiftPlayer(flag) {
            this.$refs.player.style.zIndex = flag ? 8100 : 7000
        }
    },
    mounted() {
        this.$bus.on('shiftMiniPlayer', this.shiftMiniPlayer)
        this.$bus.on('shiftPlayer', this.shiftPlayer)
    }
}
