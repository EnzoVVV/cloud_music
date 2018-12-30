<template>
    <div class='musiclist' ref='musiclist'>
        <div class='header' ref='header'>
            <div @click='goBack'><IconSvg class='header-back' icon-class='back'></IconSvg></div>
            <div class='header-title'>{{title}}</div>
            <ibutton v-if='!singerFS && reachTop' icon='add' text='收藏' :ref='true' size='small' class='header-favorite' @click='favoriteSinger(singer, true)'></ibutton>
            <IconSvg icon-class='share' size='23px' class='header-share'></IconSvg>
        </div>
        <div class='bg-img' :style='bgStyle' ref='img'></div>
        <div class='info' ref='info'>
            <div class='text'>
                <div class='name'>{{singer.name}}</div>
                <div class='other'>test</div>
                <ibutton icon='person' text='个人主页'></ibutton>
                <ibutton v-if='!singerFS' icon='add' text='收藏' :ref='true' class='favorite' @click='favoriteSinger(singer, true)'></ibutton>
                <ibutton v-else icon='bingo-light' text='已收藏' class='favorite' @click='favoriteSinger(singer, false)'></ibutton>
            </div>
        </div>
        <div class='fixed-tab' v-show='showFixedTab'>
            <div v-for='(tab,index) in tabs' :key='tab' class='fixed-tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                <p class='fixed-tab-text'>{{tab}}</p>
            </div>
        </div>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' :bounce='true' class='list' @scroll='handleScroll' ref='scroll'>
            <div class='wrapper'>
                <div class='tab' ref='tab'>
                    <div v-for='(tab,index) in tabs' :key='tab' class='tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                        <p class='tab-text'>{{tab}}</p>
                    </div>
                </div>
                <songlist :songs='songs' ref='songlist' v-show='activeTab == 0' @click='selectSong' :showIndex='true'></songlist>
                <albumlist :albums='albums' ref='albumlist' v-show='activeTab == 1'></albumlist>
                <div v-show='activeTab == 2'>
                </div>
                <brief v-show='activeTab == 3' ref='brief'>
                </brief>
            </div>
        </scroll>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import ibutton from 'base/button/button'
    import songlist from 'components/song-list/song-list'
    import albumlist from 'components/album-list/album-list'
    import brief from 'components/brief/brief'
    import { transform, translate } from 'common/js/dom'
    import { mapActions } from 'vuex'
    import { getSongsUrl } from 'api/song'
    import { playlistMixin } from 'common/js/mixins'
    const radius = 10
    export default {
        name: 'musiclist',
        mixins: [playlistMixin],
        components: {
            scroll,
            ibutton,
            songlist,
            albumlist,
            brief
            
        },
        props: {
            songs: {
                type: Array
            },
            albums: {
                type: Array
            },
            singer: {
                type: Object
            }
        },
        data() {
            return {
                probeType: 3,
                listenScroll: true,
                tabs: ['热门演唱','专辑','视频','艺人信息'],
                activeTab: 0,
                showFixedTab: false,
                headerHeight: 44,
                imgHeight: 0,
                bgStyle: null,
                headerHeight: 0,
                minHeight: 0,
                heightCheck: [
                    {
                        ref: 'songlist',
                        checked: false
                    },
                    {
                        ref: 'albumlist',
                        checked: false
                    }
                ],
                reachTop: false,
                singerFS: false
            }
        },
        computed: {
            title() {
                return this.reachTop ? this.singer.name : ''
            },
            ...mapGetters([
                'fsingers'
            ])
        },
        watch: {

        },
        methods: {
            checkSingerFS() {
                return !!this.fsingers.find(i => i.id === this.singer.id)
            },
            goBack() {
                this.$emit('goback')
            },
            selectTab(tab) {
                this.activeTab = this.tabs.indexOf(tab)
                // 组件v-show为false时，display:none， clientHeight高度为0
                // 组件v-show为true时，nextTick才能获取到真实clientHeight
                this.$nextTick(() => this.checkHeight(this.activeTab))
            },
            handleScroll(pos) {
                let scrollY = pos.y
                if(scrollY > 0) {
                    // 下滑
                    const scale = 1 + scrollY/this.imgHeight
                    this.$refs.img.style[transform] = `scale(${scale})`
                    translate(this.$refs.info, 0, scrollY)
                    this.reachTop = false
                } else {
                    //上滑
                    if(-scrollY <= this.imgHeight -radius - this.headerHeight) {
                        this.reachTop = false
                        let distance = scrollY * 0.3
                        let bright = (1 - (Math.abs(scrollY) / this.scrollDistance) * 0.7) * 100
                        translate(this.$refs.img, 0, distance)
                        Object.assign(this.$refs.img.style, {
                            'clip-path': 'none',
                            'filter': `brightness(${bright}%)`,
                            'z-index': -1
                        })
                        let opacity = 1 - (Math.abs(scrollY) / this.scrollDistance)
                        translate(this.$refs.info, 0, scrollY)
                        Object.assign(this.$refs.info.style, {
                            opacity: opacity
                        })
                        this.showFixedTab = false
                    } else {
                        // 触顶
                        this.reachTop = true
                        let distance = this.scrollDistance * 0.3
                        let percent = Math.ceil((distance + 44 + radius) / this.imgHeight * 100)
                        this.$refs.img.style[transform] = `translate3d(0,0,0)`
                        Object.assign(this.$refs.img.style, {
                            'clip-path': `polygon(0% 0%, 100% 0%, 100% ${percent}%, 0% ${percent}%)`,
                            'z-index': 1
                        })
                        this.showFixedTab = true
                    }
                }
            },
            loadImg() {
                let img = new Image()
                img.src = this.singer.picUrl
                img.onload = () => {
                    this.bgStyle = `background-image: url(${this.singer.picUrl})`
                    this.$nextTick(() => {
                        this.imgHeight = this.$refs.img.clientHeight
                        // $refs.name如果取的是组件，那么是获取到了vue实例，取得dom还要$refs.name.$el
                        // 如果取的是element，那么直接$refs.name.style就行
                        let scrollTop = this.imgHeight - radius
                        this.$refs.scroll.$el.style.top = `${scrollTop}px`
                        let infoTop = this.imgHeight - 80
                        this.$refs.info.style.top = `${infoTop}px`
                    })
                }
            },
            checkHeight(tabIndex) {
                if(this.heightCheck[tabIndex].checked) {
                    return
                }
                // albumlist高度小于minHeight，则无法上移到顶部，改变最小高度，使之可以上移到顶部
                let el = this.$refs[this.heightCheck[tabIndex].ref].$el
                if(el.clientHeight < this.minHeight) {
                    el.style.height = this.minHeight + 'px'
                }
                this.heightCheck[tabIndex].checked = true
            },
            getHeight() {
                this.headerHeight = this.$refs.header.clientHeight
                let viewerHeight = this.$refs.musiclist.clientHeight
                let tabHeight = this.$refs.tab.clientHeight
                this.minHeight = viewerHeight - this.headerHeight - tabHeight + 1
            },
            selectSong(song,index) {
                if(!song.picUrl) {
                    getSongPicUrl(song)
                }
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            ...mapActions([
                'selectPlay',
                'favoriteSinger'
            ])
        },
        created() {
            this.loadImg()
            this.singerFS = this.checkSingerFS()
        },
        mounted() {
            this.getHeight()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .musiclist
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 5000
        background: $color-background
        .header
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 44px
            display: flex
            align-items: center
            z-index: 150
            margin-left: 10px
            &-back
                color: $color-text-a
                float: left 
            &-title
                flex: 1
                color: $color-text-a
                padding-left: 10px
            &-favorite
                margin-right: 15px
            &-share
                margin-right: 25px
        .bg-img
            position: absolute
            width: 100%
            height: 30%
            overflow: hidden
        .info
            position: absolute
            left: 15px
            right: 15px
            display: flex
            align-items: flex-end
            .text
                flex: 1
                .name
                    color: $color-text-a
                    font-size: 32px
                    padding-bottom: 5px
                .other
                    color: $color-text-ll
            .favorite
                margin-left: 10px
        .list
            position: fixed
            top: 0
            bottom: 0
            width: 100%
            .wrapper
                position: relative
                .tab
                    display: flex
                    flex-direction: row
                    height: 30px
                    line-height: 30px
                    padding: 0 20px
                    font-size: $font-size-small
                    .tab-item
                        flex: 1
                        text-align: center
                        .tab-text
                            color: $color-text
                            margin: 0 15px
                        &.active
                            .tab-text
                                color: $color-theme
                                border-bottom: 1px solid $color-theme
        .fixed-tab
            position: absolute
            top: 44px
            left: 0
            width: 90%
            z-index: 200
            background: $color-background
            border-top-left-radius: 10px
            border-top-right-radius: 10px
            display: flex
            flex-direction: row
            height: 30px
            line-height: 30px
            padding: 0 20px
            font-size: $font-size-small
            .fixed-tab-item
                flex: 1
                text-align: center
                .fixed-tab-text
                    color: $color-text
                    margin: 0 15px
                &.active
                    .fixed-tab-text
                        color: $color-theme
                        border-bottom: 1px solid $color-theme        
</style>