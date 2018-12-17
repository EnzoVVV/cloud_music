<template>
    <div class='recommend'>
        <scroll ref='scroll' class='recommend-content'>
            <div>
                <div v-if='recommends.length'>
                    <div class='decorate'></div>
                    <slider>
                        <div v-for='item in recommends' :key='item.id' class='slider-content'>
                            <a>
                                <img :src='item.picUrl' class='needsclick' @load='imgLoaded'></img>
                            </a>
                        </div>
                    </slider>
                </div>
                <div class='features'>
                    <div class='feature fm'>
                        <IconImg imgName='fm' size='80px'></IconImg>
                        <span class='title'>私人FM</span>
                    </div>
                    <div class='feature today' @click='showDailyRecommend'>
                        <span class='date'>{{day}}</span>
                        <IconImg imgName='today' size='80px'></IconImg>
                        <span class='title'>每日推荐</span>
                    </div>
                    <div class='feature rankboard' @click='showRank'>
                        <IconImg imgName='rankboard' size='80px'></IconImg>
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
    import loading from 'base/loading/loading'
    export default {
        name: 'recommend',
        components: {
            slider,
            discList,
            scroll,
            loading
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
                this.$bus.emit('showRank', true)
            },
            showDailyRecommend() {
                this.$bus.emit('showDailyRecommend', true)
            }

        },
        created() {
            this.getRecommends()
            this.getLists()
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .recommend
        position: absolute
        width: 100%
        height: 100%
        top: 0
        bottom: 0
        &-content
            width: 100%
            height: 100%
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
                    .title
                        position: absolute
                        bottom: 0
                        font-size: $font-size-small-s
                .today
                    position: relative
                    .date
                        position: absolute 
                        top: 36px
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