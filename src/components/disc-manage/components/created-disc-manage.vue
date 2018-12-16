<template>
    <div>
        <minilist title='创建的歌单' @hide='hide' v-if='!modalFlag'>
            <ul>
                <li class='line' @click='popUpCreateDisc'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>创建新歌单</div>
                </li>
                <li class='line'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>歌单管理</div>
                </li>
                <li class='line'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>恢复歌单</div>
                </li>
            </ul>
        </minilist>
        <createdisc v-if='modalFlag' @hide='hide'></createdisc>
    </div>
</template>
<script>
    import minilist from 'base/mini-list/mini-list'
    import createdisc from 'components/create-disc/create-disc'
    export default {
        name: 'CreatedDiscManage',
        components: {
            minilist,
            createdisc
        },
        props: {

        },
        data() {
            return {
                modalFlag: false
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            hide() {
                this.$emit('hide')
            },
            popUpCreateDisc() {
                this.$bus.emit('showModal')
                this.modalFlag = true
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
            // 半边框，用伪类
            &:after
                content: ''
                position: absolute 
                left: 13%
                bottom: 0
                right: 0
                height: 1px
                background: $color-light
</style>