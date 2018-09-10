<template>
    <div class='musiclist'>
        <div class='header' ref='header'>
            <IconSvg class='header-back' :icon-class='fanhui' @click='goback'></IconSvg>
            <div class='header-title'>{{singer.name}}</div>
        </div>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' class='list' @scroll='handleScroll'>
            <div class='wrapper'>
                <div class='bg-img' :style='bgStyle' ref='img'>
                </div>
                <div class='tab'>
                    <div v-for='(tab,index) in tabs' :key='tab' class='tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                        <p class='tab-text'>{{tab}}</p>
                    </div>
                </div>
                <songlist :songs='songs' v-show='activeTab == 0'></songlist>
                <albumlist :albums='albums' v-show='activeTab == 1'></albumlist>
                <div v-show='activeTab == 2'>
                </div>
                <div v-show='activeTab == 3'>
                </div>
            </div>
        </scroll>
        <div class='fixed-tab' v-show='showFixedTab'>
            <div v-for='(tab,index) in tabs' :key='tab' class='fixed-tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                <p class='fixed-tab-text'>{{tab}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import songlist from 'components/song-list/song-list'
    import albumlist from 'components/album-list/album-list'
    export default {
        name: 'musiclist',
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
                probType: 3,
                listenScroll: true,
                tabs: ['热门演唱','专辑','视频','艺人信息'],
                activeTab: 0,
                showFixedTab: false,
                headerHeight: 44,
                imgHeight: 0,
                bgStyle: null
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            goBack() {
                this.$router.push('/music/singer')
            },
            selectTab(tab) {
                this.activeTab = this.tabs.indexOf(tab)
            },
            handleScroll(pos) {
                let scrollY = pos.y
                if(scrollY > 0) {
                    //TODO，放大图片
                    return
                }
                if(-scrollY >= this.imgHeight - this.headerHeight) {
                    this.showFixedTab = true
                } else {
                    this.showFixedTab = false
                }
            },
            loadImg() {
                let img = new Image()
                img.src = this.singer.imgUrl
                img.onload = () => {
                    this.bgStyle = `background-image: url(${this.singer.imgUrl})`
                    this.$nextTick(() => {
                        this.imgHeight = this.$refs.img.clientHeight
                    }) 
                }
            }
        },
        created() {
            this.loadImg()
        },
        mounted() {

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
        z-index: 100
        background: $color-background
        .header
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 44px
            z-index: 150
            &-back
                float: left 
            &-title
                padding-left: 50px
        .list
            position: fixed
            top: 0
            bottom: 0
            width: 100%
            background: $color-background
            .wrapper
                position: relative
                .bg-img
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 75%
                    transform-origin: top
                    background-size: cover
                    background-position: 0 30%
                    z-index: 120
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
                            margin: 0 20px
                        &.active
                            .tab-text
                                color: $color-theme
                                border-bottom: 1px solid $color-theme
        .fixed-tab
            position: relative
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
                    margin: 0 20px
                &.active
                    .fixed-tab-text
                        color: $color-theme
                        border-bottom: 1px solid $color-theme


                    
</style>