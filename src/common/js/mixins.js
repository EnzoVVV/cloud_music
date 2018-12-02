import { playMode } from 'common/js/config'
import { generateRandomList } from 'common/js/tools'
import { mapGetters, mapMutations } from 'vuex'

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
        }
    }
}

import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
// 只有写在export对象内的才能被mixin, 这里import一个函数，但在export对象下没有应用这个函数， 那么在引用mixin的组件内， 是不能直接应用这个import的函数的
// import { search } from 'api/api'
export const resultMixin = {
    components: {
        scroll,
        loading
    },
    data() {
        return {
            probeType: 3,
            listenScroll: true
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
            'playlist'
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
            this.handlePlaylist(val)
        }
    },
    methods: {
        handlePlaylist(playlist) {
            if(!playlist) return
            const scroll = this.$refs.scroll
            if(!scroll) {
                throw new Error('scroll组件的ref要设为scroll')
                return
            }
            const bottom = playlist.length > 0 ? '60px' : ''
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
