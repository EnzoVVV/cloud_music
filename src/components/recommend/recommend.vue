<template>
    <div class='recommend'>
        <scroll ref='scroll' class='recommend-content'>
            <div>
                <div v-if='recommends.length'>
                    <div class='decorate'></div>
                    <slider>
                        <div v-for='item in recommends' :key='item.id' class='slider-content'>
                            <a>
                                <img :src='item.picUrl' class='needsclick' @load='imgLoaded'/>
                            </a>
                        </div>
                    </slider>
                </div>
                <div class='features'>
                    <div class='feature fm' @click='showPersonalFM'>
                        <IconImg imgName='fm' size='60px' class='img'></IconImg>
                        <span class='title'>私人FM</span>
                    </div>
                    <div class='feature today' @click='showDailyRecommend'>
                        <span class='date'>{{day}}</span>
                        <IconImg imgName='calendar' size='60px' class='img'></IconImg>
                        <span class='title'>每日推荐</span>
                    </div>
                    <div class='feature playlist' @click='showPlaylist'>
                        <IconImg imgName='playlist' size='60px' class='img'></IconImg>
                        <span class='title'>歌单</span>
                    </div>
                    <div class='feature rankboard' @click='showRank'>
                        <IconImg imgName='rank' size='60px' class='img'></IconImg>
                        <span class='title'>排行榜</span>
                    </div>
                </div>
                <div class='border'></div>
                <discList :discList='discLists' v-if='discLists.length'></discList>
            </div>
            <div class='loading' v-if='!discLists.length'>
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import { getRecommendList, getBanner } from 'api/recommend'
    import slider from 'base/slider/slider'
    import discList from 'components/discList/discList'
    import scroll from 'base/scroll/scroll'
    import { getPersonalFM } from 'api/fm'
    import { playlistMixin } from 'common/js/mixins'
    export default {
        name: 'recommend',
        mixins: [ playlistMixin ],
        components: {
            slider,
            discList,
            scroll
        },
        props: {

        },
        data() {
            return {
                recommends: [],
                discLists: [],
                loadImg: false
            }
        },
        computed: {
            day() {
                return (new Date()).getDate()
            }
        },
        watch: {

        },
        methods: {
            getRecommends() {
                getBanner().then(res => {
                    this.recommends = res
                })
            },
            getLists() {
                getRecommendList().then( res => {
                    this.discLists = res
                })
            },
            imgLoaded() {
                if(!this.loadImg) {
                    this.loadImg = true
                    this.$refs.scroll.refresh()
                }
            },
            showRank() {
                this.showComponent('rank')
            },
            showDailyRecommend() {
                this.showComponent('dailyrecommend')
            },
            showPlaylist() {
                this.showComponent('playlist')
            },
            showPersonalFM() {
                this.showComponent('FM')
            }
        },
        created() {
            this.getRecommends()
            this.getLists()
        }
    }
</script>

<style scoped lang='stylus'>
    @import '~common/stylus/variable'
    .recommend
        position: absolute
        width: 100%
        height: 100%
        top: 0
        bottom: 0
        &-content
            width: 100%
            position: absolute
            top: 0
            bottom: 0
            overflow: hidden
            .decorate
                position: absolute
                top: -30vh
                z-index: -10
                background: $color-theme
                width: 100%
                height: 43vh
                vertical-align: inherit
            .slider-content
                padding: 0 5px
                img
                    border-radius: 5px
            .features
                display: flex
                align-items: center
                height: 100px
                // 为了看起来上下空白间距一样
                margin-top: -5px
                margin-bottom: 10px
                .feature
                    flex: 1
                    display: flex
                    justify-content: center
                    position: relative
                    height: 80px
                    margin-top: 10px
                    .img
                        background: $color-theme
                        border-radius: 50%
                    .title
                        position: absolute
                        bottom: 0
                        font-size: $font-size-small
                .today
                    position: relative
                    .date
                        position: absolute 
                        top: 29px
                        font-size: $font-size-small
                        color: $color-text-a
            .border
                height: 1px
                transform: scaleY(0.3)
                transform-origin: 50% 100%
                background: $color-text-light
        .loading
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>