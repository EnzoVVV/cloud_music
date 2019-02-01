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
                        <img :src='cover' class='bg-img' :class='{"blur": blur}' ref='bgImg'></img>
                    </div>
                    <div class='info' ref='info'>
                        <slot v-if='cusInfo' name='info'></slot>
                        <div v-else>
                            <img class='info-img' :src='cover'></img>
                            <div class='info-title-wrapper'>
                                <div class='info-main-title'>{{headerScrollTitle}}</div>
                                <div class='info-sub-title' v-if='subTitle.length'>{{subTitle}}</div>
                                <div class='info-creator' v-if='type == "disc" && creator' @click='showHomepage'>
                                    <img class='info-creator-avatar' :src='creator.picUrl'></img>
                                    <span class='info-creator-name'>{{creator.name}} ></span>
                                </div>
                                <div class='info-album' v-if='type == "album" && subject'>
                                    <p class='info-album-singer'>歌手: {{subject.singer}}</p>
                                    <p class='info-album-date'>发行时间: {{subject.date}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='func' v-if='showFunc' ref='func'>
                        <div class='btn' @click='showComment'>
                            <IconImg imgName='comment' ></IconImg>
                            <div class='text'>评论</div>
                        </div>
                        <div class='btn'>
                            <IconImg imgName='share'></IconImg>
                            <div class='text'>分享</div>
                        </div>
                        <div class='btn' @click='showSongSelect'>
                            <IconImg imgName='uj'></IconImg>
                            <div class='text'>多选</div>
                        </div>
                    </div>
                    <songlist v-if='!cusList' :songs='songsCopy' @click='selectSong' @clickHeader='playAll' :showHeader='showHeader' :showIndex='showIndex' :showImg='showImg' :showFBtn='showFBtn' :favoriteStatus='favoriteStatus' :setting='true' @iconClick='showInfoList' @toggleFS='toggleFS' ref='songlist' class='songlist'></songlist>
                    <div v-else ref='slot'><slot name='list'></slot></div>
                </div>
            </scroll>
            <div class='fixed-background' v-show='showFixedBG' ref='fbg'>
                <img :src='cover' class='bg-img' :class='{"blur": blur}' ref='fbgImg'></img>
            </div>
            <infolist v-if='infoListFlag' :song='infoSong' :showDelete='showDelete' @deleteSong='deleteSong' @hide='infoListFlag = false'></infolist>
        </div>
    </transition>
</template>
<script>
    import { playlistMixin, scrollMixin } from 'common/js/mixins'
    import FunctionalHeader from 'base/functional-header/functional-header'
    import songlist from 'components/song-list/song-list'
    import { mapActions } from 'vuex'
    import { createSong } from 'common/js/song'
    import { opacity, clipPath } from 'common/js/dom'
    const infolist = () => import('components/info-list/info-list')
    import Song from 'common/js/song'
    export default {
        name: 'detailboard',
        mixins: [playlistMixin, scrollMixin],
        components: {
            FunctionalHeader,
            songlist,
            infolist
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
                default: false
            },
            showImg: {
                type: Boolean,
                default: false
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
            // 显示收藏按钮
            showFBtn: {
                type: Boolean,
                default: true
            },
            // 歌单收藏状态
            favoriteStatus: {
                type: Boolean,
                default: false
            },
            // 自定义list
            cusList: {
                type: Boolean,
                default: false
            },
            // 自定义info
            cusInfo: {
                type: Boolean,
                default: false
            },
            // info区次标题
            subTitle: {
                type: String,
                default: ''
            },
            // 显示评论分享等功能按钮
            showFunc: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                default: 'disc',
                validator: (value) => {
                    return ['song', 'album', 'disc'].indexOf(value) > -1
                }
            },
            subject: {
                type: Object
            },
            // 歌单页的creator信息
            creator: {
                type: Object
            },
            // 显示infolist中的删除项
            showDelete: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                songsCopy: this.songs,
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
                searches: [],
                infoListFlag: false,
                infoSong: null
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
                if(this.showFunc) {
                    this.$refs.func.style[opacity] = 1 - percent
                }
                // 更换title
                if(this.headerScrollTitle) {
                    if(percent > 0.4) {
                        this.curTitle = this.headerScrollTitle
                    } else {
                        this.curTitle = this.headerTitle
                    }
                }
            },
            songs() {
                // props的songs是调服务异步获取的, 需要watch，与songsCopy同步
                this.setSongs()
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
                        this.songsCopy.forEach((song, index) => {
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
                    list: this.songsCopy,
                    index: index
                })
            },
            playAll() {
                this.selectPlay({
                    list: this.songsCopy,
                    index: 0
                })
            },
            ...mapActions([
                'selectPlay',
                'deleteSongFromDisc'
            ]),
            toggleFS(status) {
                this.$emit('toggleFS', status)
            },
            getDesc(song) {
                return song.album ? `${song.singer} - ${song.album}` : `${song.singer} - ${song.name}`
            },
            showComment() {
                this.showComponent('comment', this.type, this.subject)
            },
            showSongSelect() {
                this.showComponent('songselect', this.songsCopy)
            },
            showHomepage() {
                this.showComponent('homepage', this.creator.id)
            },
            showInfoList(song) {
                this.infoSong = song
                this.infoListFlag = true
            },
            deleteSong() {
                this.deleteSongFromDisc({
                    song: this.infoSong,
                    disc: this.subject
                })
                const index = this.songsCopy.findIndex(song => song.id === this.infoSong.id)
                // 无法响应外层, 在自己的作用域中删除该项
                this.songsCopy.splice(index, 1)
            },
            setSongs() {
                // infolist中不删除歌曲时， 无需deepCopy songs
                this.songsCopy = this.showDelete ? this.songs.map(song => new Song(song)) : this.songs
            }
        },
        created() {

        },
        mounted() {
            // 等transition结束后计算, 所以用setTimeout
            setTimeout(() => {
                const el = this.cusList ? this.$refs.slot : this.$refs.songlist.$el
                this.diff = el.getBoundingClientRect().top - this.$refs.header.$el.offsetHeight
                this.$refs.scroll.refresh()
            }, 500)
            // 没有func区域时高度不一样
            if(!this.showFunc) {
                this.$refs.bg.style.height = this.$refs.bgImg.style.height = '190px'
                this.$refs.fbg.style.top = '-136px'
                this.$refs.fbg.style.height = this.$refs.fbgImg.style.height = '190px'
                this.$refs.fbg.style[clipPath] = 'polygon(0% 71.5789%, 100% 71.5789%, 100% 94.736%, 0% 94.736%)'
            }
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
                // info高度180, func高度实为50(高度60，margin -10),bg区域高度为230，加上radius = 10后是240
                height: 240px
                z-index: -10
                overflow: hidden
                // 设置一个背景色, 背景图片失效时自动换成背景色
                background-color: $color-background
                .bg-img
                    width: 100%
                    height: 100%
                    &.blur
                        opacity: 0.6
                        filter: blur(80px) brightness(50%)
            .info
                width: 100%
                height: 180px
                position: relative
                &-img
                    width: 100px
                    height: 100px
                    overflow: hidden
                    position: absolute 
                    left: 20px
                    top: 60px
                    border-radius: 5px
                &-title-wrapper
                    position: absolute 
                    left: 140px
                    top: 70px
                    height: 70px
                    // 140是left值, 右侧再留10px空间
                    width: calc(100% - 140px - 10px)
                    .info-main-title
                        font-size: $font-size-medium-x
                        font-weight: bold
                        color: $color-text-a
                    .info-sub-title
                        padding-top: 10px
                        font-size: $font-size-small
                        color: $color-light
                    .info-creator
                        position: absolute
                        bottom: 0
                        height: 25px
                        display: flex
                        align-items: center
                        &-avatar
                            height: 25px
                            width: 25px
                            border-radius: 50%
                        &-name
                            padding-left: 10px
                            color: $color-text-ht
                            font-size: $font-size-medium
                    .info-album
                        padding-top: 20px
                        p
                            color: $color-text-ll
                            font-size: $font-size-medium
                        &-date
                            padding-top: 5px
            .func
                height: 60px
                margin-top: -10px
                display: flex
                align-items: center
                .btn
                    flex: 1
                    display: flex
                    flex-direction: column
                    align-items: center 
                    .text
                        color: $color-text-ll
                        font-size: $font-size-small
                        padding-top: 5px
            .songlist
                width: 100%
                height: 100%
        // 4. 设置一个固定div背景, 绝对定位上移一些，以便置为show时所在位置就是背景的底部
        .fixed-background
            position: absolute 
            // -(230-44)
            top: -186px
            width: 100%
            height: 240px
            // 6. 打底, 防止img模糊后scroll的内容透出来
            background: $color-background
            z-index: 6000
            // 图片裁剪，显示底部的10px
            // 显示图片186px - 230px的部分, 77.5% = 186/240
            clip-path: polygon(0% 77.5%, 100% 77.5%, 100% 95.83333%, 0% 95.83333%)
            overflow: hidden
            .bg-img
                width: 100%
                height: 100%
                &.blur
                    opacity: 0.6
                    filter: blur(80px) brightness(50%)
    

</style>