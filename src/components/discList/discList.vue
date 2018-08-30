<template>
    <div class='discList'>
        <h1 class='title'>推荐歌单</h1>
        <ul>
            <li v-for='disc in discList' :key='disc.id' class='item'>
                <div class='cover'>
                    <div class='gradients'></div>
                    <img v-lazy='mockImg' class='img needsclick'></img>
                    <p class='play-count'>
                        <IconSvg icon-class='yinle' class='play-count-icon'></IconSvg>
                        <span class='play-count-text'>{{disc.playCount}}</span>
                    </p>
                </div>
                <p class='text'>
                    <a class='discription'>{{disc.discription}}</a>
                </p>
            </li>
        </ul>
    </div>
</template>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    // @import '~common/stylus/mixin'
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
        .item
            display: inline-block
            box-sizing: border-box
            width: 33%
            float: left
            padding: 0 1%
            position: relative
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
                    &-text
                        font-size: $font-size-small-s
                        color: $color-text-l
                .info
                    position: absolute 
                    top: 5px
                    right: 30px
                .text
                    // float: left
                    // line-height: 16px
                    padding-bottom: 10px
                    // text-align: left 
                    font-size: $font-size-small               
</style>
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

        },
        created() {

        },
        mounted() {

        }
    }
</script>