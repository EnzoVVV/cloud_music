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
    import { ERR_OK } from 'api/config'
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

        },
        watch: {

        },
        methods: {
            getRecommends() {
                getBanner().then(res => {
                    if(res.code === ERR_OK) {
                        this.recommends = res.data.slider
                    }
                })
            },
            getLists() {
                getRecommendList().then( res => {
                    if(res.code === ERR_OK) {
                        this.discLists = res.data
                    }
                })
            },
            imgLoaded() {
                if(!this.loadImg) {
                    this.loadImg = true
                    this.$refs.scroll.refresh()
                }
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
        .loading
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>