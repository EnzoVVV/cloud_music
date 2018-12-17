<template>
    <div class='musiclist' ref='musiclist'>
        <div class='header' ref='header'>
            <div @click='goBack'><IconSvg class='header-back' icon-class='back'></IconSvg></div>
            <div class='header-title'>{{singer.name}}</div>
        </div>
        <div class='bg-img' :style='bgStyle' ref='img'></div>
        <div class='fixed-tab' v-show='showFixedTab'>
            <div v-for='(tab,index) in tabs' :key='tab' class='fixed-tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                <p class='fixed-tab-text'>{{tab}}</p>
            </div>
        </div>
        <div class='bg-layer' ref='layer'>
        </div>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' class='list' @scroll='handleScroll' ref='scroll'>
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
                <div v-show='activeTab == 3'>
                </div>
            </div>
        </scroll>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import songlist from 'components/song-list/song-list'
    import albumlist from 'components/album-list/album-list'
    import { transform } from 'common/js/dom'
    import { mapActions } from 'vuex'
    import { getSongsUrl } from 'api/song'
    import { playlistMixin } from 'common/js/mixins'
    export default {
        name: 'musiclist',
        mixins: [playlistMixin],
        components: {
            scroll,
            songlist,
            albumlist
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
                ]
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
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
                    this.$refs.img.style.zIndex = (this.$refs.scroll.$el.style.zIndex || 0) + 10
                    this.$refs.img.style[transform] = `scale(${scale})`
                } else {
                    //上滑
                    if(-scrollY <= this.imgHeight - this.headerHeight) {
                        this.$refs.layer.style[transform] = `translate3d(0,${scrollY}px,0)`
                        this.$refs.img.style.zIndex = 0
                        this.$refs.img.style.paddingTop = '75%'
                        this.$refs.img.style.height = 0
                        let distance = scrollY * 0.3
                        this.$refs.img.style[transform] = `translate3d(0,${distance}px,0)`
                        this.showFixedTab = false
                    } else {
                        // 触顶
                        this.$refs.img.style[transform] = `translate3d(0,0,0)`
                        Object.assign(this.$refs.img.style, {
                            zIndex: 10,
                            paddingTop: 0,
                            height: this.headerHeight + 'px'
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
                        this.$refs.scroll.$el.style.top = `${this.imgHeight}px`
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
                'selectPlay'
            ])
        },
        created() {
            this.loadImg()
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
            &-back
                color: $color-text-a
                float: left 
            &-title
                color: $color-text-a
                padding-left: 10px
        .bg-img
            position: relative
            width: 100%
            height: 0
            padding-top: 75%
            transform-origin: top
            background-size: cover
            background-position: 0 30%
        .bg-layer
            position: relative
            height: 100%
            background: $color-background
        .list
            position: fixed
            top: 0
            bottom: 0
            width: 100%
            background: $color-background
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