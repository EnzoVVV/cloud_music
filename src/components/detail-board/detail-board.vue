<template>
    <transition name='detail-board'>
        <div class='detail-board'>
            <FunctionalHeader :title='curTitle' :rollingTitle='rollingTitle' sbph='搜索歌单内歌曲' :showSearch='showSearch' :searchbarStyle='searchbarStyle' @back='goback' @search='search' class='custom-header' ref='header'></FunctionalHeader>
            <scroll v-if='searching' class='search-result'>
                <ul>
                    <li v-for='wrapper in searches' :key='wrapper.song.id' class='item' @click='selectSong(wrapper.song,wrapper.index)'>
                        <div class='content'>
                            <h2 class='name'>{{wrapper.song.name}}</h2>
                            <p class='desc'>{{getDesc(wrapper.song)}}</p>
                        </div>
                    </li>
                </ul>
            </scroll>
            <scroll class='scroll' ref='scroll' :listen-scroll='listenScroll' :probe-type='probeType' @scroll='handleScroll'>
                <div>
                    <div class='bg' ref='bg'>
                        <img :src='cover' class='bg-img' :class='{"blur": blur}'></img>
                    </div>
                    <div class='info' ref='info'>
                        <slot name='info'></slot>
                    </div>
                    <songlist :songs='songs' @click='selectSong' @clickHeader='playAll' :showHeader='showHeader' :showIndex='showIndex' :favoriteStatus='favoriteStatus' @toggleFS='toggleFS' ref='songlist' class='songlist'></songlist>
                </div>
            </scroll>
            <div class='fixed-background' v-show='showFixedBG' ref='fbg'>
                <img :src='cover' class='bg-img' :class='{"blur": blur}'></img>
            </div>
        </div>
    </transition>
</template>
<script>
    import { playlistMixin, scrollMixin } from 'common/js/mixins'
    import FunctionalHeader from 'base/functional-header/functional-header'
    import songlist from 'components/song-list/song-list'
    import { mapActions } from 'vuex'
    import { mockImg } from 'common/js/config'
    import { createSong } from 'common/js/song'
    import { opacity } from 'common/js/dom'
    export default {
        name: 'detailboard',
        mixins: [playlistMixin, scrollMixin],
        components: {
            FunctionalHeader,
            songlist
        },
        props: {
            songs: {
                type: Array
            },
            // 默认顶部标题
            headerTitle: {
                type: String,
                default: ''
            },
            // 向上滑动时显示的标题
            headerScrollTitle: {
                type: String,
                default: ''
            },
            // 背景图片src
            cover: {
                type: String,
                default: ''
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            // 是否开启标题滚动
            rollingTitle: {
                type: Boolean,
                default: false
            },
            showIndex: {
                type: Boolean,
                default: true
            },
            // header的搜索
            showSearch: {
                type: Boolean,
                default: true
            },
            // 背景模糊
            blur: {
                type: Boolean,
                default: true
            },
            // 歌单收藏状态
            favoriteStatus: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                mockImg: mockImg,
                showFixedBG: false,
                // 当前标题 (默认标题/滑动标题)
                curTitle: this.headerTitle,
                searchbarStyle: {
                    background: 'none',
                    color: 'rgb(228, 228, 228)'
                },
                // 正在搜索
                searching: false,
                // 搜索结果
                searches: []
            }
        },
        computed: {

        },
        watch: {
            // 5. 控制固定背景的显示
            scrollY(val) {
                // 滚动距离大于初始时songlist到header下边的距离，就显示固定背景
                this.showFixedBG = Math.abs(val) > this.diff
                // info内容按滚动比例降低opacity
                const percent = Math.abs(val) / this.diff
                this.$refs.info.style[opacity] = 1 - percent
                // 更换title
                if(this.headerScrollTitle) {
                    if(percent > 0.4) {
                        this.curTitle = this.headerScrollTitle
                    } else {
                        this.curTitle = this.headerTitle
                    }
                }
            }
        },
        methods: {
            goback() {
                this.$emit('back')
            },
            search(flag, query) {
                this.searches = []
                if(flag === true) {
                    // 由于selectSong函数需要song的index, 所以这里的结构需要加一个歌曲的index
                    // 要判断query有内容，因为indexOf('')一定大于1， 会把所有内容都搜出来
                    if(query.length) {
                        this.songs.forEach((song, index) => {
                            if(song.name.indexOf(query) > -1) {
                                this.searches.push({
                                    index: index,
                                    song: song
                                })
                            }
                        })
                    }
                    this.searching = true
                } else if(flag === false) {
                    this.searching = false
                }
            },
            selectSong(song, index) {
                this.selectPlay({
                    list: this.songs,
                    index: index
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
            toggleFS(status) {
                this.$emit('toggleFS', status)
            },
            getDesc(song) {
                return song.album ? `${song.singer} - ${song.album}` : `${song.singer} - ${song.name}`
            }
        },
        created() {

        },
        mounted() {
            // 等transition结束后计算, 所以用setTimeout
            setTimeout(() => {
                this.diff = this.$refs.songlist.$el.getBoundingClientRect().top - this.$refs.header.$el.offsetHeight
                this.$refs.scroll.refresh()
            }, 500)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .detail-board
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 4000
        background: $color-background
        &.detail-board-enter-active, &.detail-board-leave-active
            transition: all 0.4s
        &.detail-board-enter, &.detail-board-leave-to
            transform: translate3d(0, 100%, 0)
        .custom-header
            position: fixed
            top: 0
            height: 44px
            width: 100%
            z-index: 8000
            // 1. 给header背景设置为none
            background: none 
        .search-result
            position: fixed
            top: 44px
            bottom: 0
            width: 100%
            z-index: 8000
            background: $color-background
            overflow: hidden
            .item
                position: relative
                display: flex
                align-items: center
                box-sizing: border-box
                height: 60px
                font-size: $font-size-medium
                &:after
                    content: ''
                    position: absolute 
                    left: 2%
                    bottom: 0
                    right: 0
                    height: 1px
                    background: $color-light
                .content
                    position: relative
                    margin-left: 10px
                    line-height: 20px
                    align-items: center
                    overflow: hidden
                    .name
                        margin-top: 4px
                        font-size: $font-size-medium-x
                        no-wrap()
                        color: $color-text
                    .desc
                        no-wrap()
                        font-size: $font-size-small
                        color: $color-text-g
        .scroll
            overflow: hidden
            position: absolute 
            top: 0
            bottom: 0
            width: 100%
            z-index: 5000
            // 2. scroll下增加一个绝对定位的div作为背景, z-index为-10
            .bg
                position: absolute 
                top: 0
                width: 100%
                // 3. 多出10px，为了下面的组件设置border-radius后能显示出来
                height: 210px
                z-index: -10
                overflow: hidden
                .bg-img
                    width: 100%
                    height: 210px
                    &.blur
                        opacity: 0.6
                        filter: blur(80px) brightness(50%)
            .info
                width: 100%
                height: 200px
                position: relative
            .songlist
                width: 100%
                height: 100%
        // 4. 设置一个固定div背景, 绝对定位上移一些，以便置为show时所在位置就是背景的底部
        .fixed-background
            position: absolute 
            // -(200-44)
            top: -156px
            width: 100%
            height: 210px
            // 6. 打底, 防止img模糊后scroll的内容透出来
            background: $color-background
            z-index: 6000
            // 图片裁剪，显示底部的10px
            clip: rect(156px auto 200px auto)
            overflow: hidden
            .bg-img
                width: 100%
                height: 210px
                &.blur
                    opacity: 0.6
                    filter: blur(80px) brightness(50%)
    

</style>