<template>
    <div class='discList'>
        <h1 class='title'>推荐歌单</h1>
        <!-- 需要给ul清除浮动才能滚动 -->
        <!-- li是浮动元素，脱离文档流，所以ul没有高度，外层的recommend也会没法scroll -->
        <ul class='items'>
            <li v-for='disc in discList' :key='disc.dissid' class='item' @click='selectDisc(disc)'>
                <div class='cover'>
                    <div class='gradients'></div>
                    <img v-lazy='disc.imgurl' class='img needsclick'></img>
                    <p class='play-count'>
                        <IconSvg icon-class='yinle' class='play-count-icon'></IconSvg>
                        <span class='play-count-text'>{{disc.listennum}}</span>
                    </p>
                </div>
                <div class='text'>{{disc.dissname}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'discList',
        components: {

        },
        props: {
            discList: {
                type: Array
            }

        },
        data() {
            return {
                mockImg: require('./mockimg.jpg')
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            selectDisc(disc) {
                this.$bus.emit('showDiscDetail', disc)
            }
        },
        created() {

        },
        mounted() {

        }
    }
</script>


<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .discList
        width: 100%
        height: 100%
        box-sizing: border-box
        text-align: center
        .title
            height: 65px
            line-height: 65px
            padding-left: 1.5%
            text-align: left
            font-size: $font-size-medium
            font-weight: bold
            color: $color-text
        .items
            // 清除浮动 
            &:after 
                clear:both
                content:'.'
                display:block
                width: 0
                height: 0
                visibility:hidden
            .item
                display: inline-block
                box-sizing: border-box
                width: 33%
                float: left
                padding: 0 1%
                position: relative
                margin-bottom: 20px
                .cover
                    position: relative
                    display: inline-block
                    width: 100%
                    .gradients
                        position: absolute
                        top: 0
                        width: 100%
                        height: 35px
                        border-radius: 3px
                        background: linear-gradient(rgba(109, 109, 109, 0.4),rgba(255, 255, 255, 0))
                    .img
                        width: 100%
                        height: 100%
                        display: block
                    .play-count
                        position: absolute 
                        top: 5px
                        right: 8px
                        &-icon
                            width: 12px
                            height: 12px
                            color: $color-text-l
                        &-text
                            font-size: $font-size-small-s
                            color: $color-text-l
                .text
                    padding-top: 10px
                    font-size: $font-size-small
                    text-overflow: ellipsis 
                    overflow: hidden
                    white-space: nowrap
</style>
