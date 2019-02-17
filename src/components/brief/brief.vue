<template>
    <scroll class='brief'>
        <div class='title'>简介</div>
        <div class='content'>{{brief}}</div>
        <div class='title'>相似歌手</div>
        <scroll class='similar' :scrollX='true' ref='slider'>
            <div class='wrapper' ref='wrapper'>
                <div v-for='singer of similarSingers' :key='singer.id' class='singer' @click='handleClick(singer)'>
                    <img v-lazy='singer.picUrl' class='img'/>
                    <span class='text'>{{singer.name}}</span>
                </div>
            </div>
        </scroll>
    </scroll>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import { getSimilarSingers } from 'api/singer'
    import { mapMutations } from 'vuex'
    export default {
        name: 'brief',
        components: {
            scroll
        },
        props: {
            brief: {
                type: String,
                default: ''
            },
            singer: {
                type: Object
            }
        },
        data() {
            return {
                similarSingers: []
            }
        },
        methods: {
            getSimiSingers() {
                getSimilarSingers(this.singer.id).then(res => {
                    this.similarSingers = res
                    // wrapper子元素是float,这里手动设置宽度
                    this.$refs.wrapper.style.width = this.similarSingers.length * 100 + 'px'
                    this.$nextTick(() => {
                        this.$refs.slider.refresh()
                    })
                })
            },
            handleClick(singer) {
                this.setSinger(singer)
                this.showComponent('singerdetail')
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        created() {
            this.getSimiSingers()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .brief
        background: $color-background
        padding: 15px 10px
        .title
            font-weight: bold 
        .content
            color: $color-text-g
            margin: 10px 0
            line-height: 20px
            font-size: $font-size-medium
        .similar
            overflow: hidden
            margin-top: 10px
            .wrapper
                height: 100px
                .singer
                    width: 80px
                    float: left 
                    display: flex
                    flex-direction: column
                    justify-content: center
                    align-items: center
                    margin-right: 20px
                    .img
                        height: 80px
                        width: 80px
                        overflow: hidden
                        border-radius: 5px
                    .text
                        width: 100%
                        color: $color-text-ii
                        font-size: $font-size-small
                        padding-top: 8px
                        overflow: hidden
</style>