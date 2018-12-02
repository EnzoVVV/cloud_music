<template>
    <div>
        <minilist title='收藏的歌单' @hide='hide'>
            <ul>
                <li class='line'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>歌单管理</div>
                </li>
            </ul>
        </minilist>
    </div>
</template>
<script>
    import minilist from 'base/mini-list/mini-list'
    export default {
        name: 'FavoriteDiscManage',
        components: {
            minilist
        },
        props: {

        },
        data() {
            return {
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            hide() {
                this.$emit('hide')
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
        .line
            height: 44px
            display: flex
            align-items: center
            position: relative
            .icon
                margin: 0 15px
            &:after
                content: ''
                position: absolute 
                left: 13%
                bottom: 0
                right: 0
                height: 1px
                background: $color-light
</style>