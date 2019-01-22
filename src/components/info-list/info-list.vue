<template>
    <div>
        <minilist :title='title' @hide='hide' v-if='!modalFlag' ref='minilist'>
            <ul slot='list'>
                <li class='line' @click='popUpCreateDisc'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>收藏到歌单</div>
                </li>
                <li class='line'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>{{singerLine}}</div>
                </li>
                <li class='line'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>{{albumLine}}</div>
                </li>
            </ul>
        </minilist>
        <SaveToDisc v-if='modalFlag' :song='song' @hide='hide'></SaveToDisc>
    </div>
</template>
<script>
    import minilist from 'base/mini-list/mini-list'
    const SaveToDisc = () => import('components/save-to-disc/save-to-disc')
    export default {
        name: 'infolist',
        components: {
            minilist,
            SaveToDisc
        },
        props: {
            song: {
                type: Object
            }
        },
        data() {
            return {
                modalFlag: false
            }
        },
        computed: {
            singerLine() {
                return `歌手: ${this.song.singer}`
            },
            albumLine() {
                return `专辑: ${this.song.album}`
            },
            title() {
                return `歌曲: ${this.song.name}`
            }
        },
        watch: {

        },
        methods: {
            popUpCreateDisc() {
                this.isHideCallBack = true
                // 执行mini list的hide函数，包含了动画的时间，动画完成后minilist触发hide事件，触发此vm的hide函数，防callback并将modal的modalFlag更改
                this.$refs.minilist.hide()
            },
            hide() {
                if(this.isHideCallBack) {
                    this.isHideCallBack = false
                    // minilist的隐藏动画执行完成后，再将modalFlag改变
                    this.modalFlag = true
                    return
                }
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