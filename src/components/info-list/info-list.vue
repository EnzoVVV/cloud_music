<template>
    <div>
        <minilist :title='title' :headerBorder='false' @hide='hide' v-if='!modalFlag' ref='minilist'>
            <ul slot='list'>
                <li class='line' @click='popUpCreateDisc'>
                    <IconImg imgName='list-save' class='icon'></IconImg>
                    <div class='text'>收藏到歌单</div>
                </li>
                <li class='line'>
                    <IconImg imgName='list-singer' class='icon'></IconImg>
                    <div class='text'>{{singerLine}}</div>
                </li>
                <li class='line'>
                    <IconImg imgName='list-album' class='icon'></IconImg>
                    <div class='text'>{{albumLine}}</div>
                </li>
                <li class='line' v-if='showDelete' @click='popUpDelete'>
                    <IconImg imgName='list-delete' class='icon'></IconImg>
                    <div class='text'>删除</div>
                </li>
            </ul>
        </minilist>
        <SaveToDisc v-if='modalFlag' :song='song' @hide='hide'></SaveToDisc>
        <modal v-if='deleteSongFlag' confirmBtnText='删除' title='确认将所选音乐从列表中删除?' @confirm='deleteSong' @hide='deleteSongFlag = false'></modal>
    </div>
</template>
<script>
    import minilist from 'base/mini-list/mini-list'
    const SaveToDisc = () => import('components/save-to-disc/save-to-disc')
    const modal = () => import('base/modal/modal')
    export default {
        name: 'infolist',
        components: {
            minilist,
            SaveToDisc,
            modal
        },
        props: {
            song: {
                type: Object
            },
            // 显示infolist中的删除项
            showDelete: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                modalFlag: false,
                deleteSongFlag: false
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
            popUp(variable) {
                this.callBackVariable = variable
                this.isHideCallBack = true
                // 执行mini list的hide函数，包含了动画的时间，动画完成后minilist触发hide事件，触发此vm的hide函数，防callback并将modal的modalFlag更改
                this.$refs.minilist.hide()
            },
            hide() {
                if(this.isHideCallBack) {
                    this.isHideCallBack = false
                    // minilist的隐藏动画执行完成后，再将modalFlag改变
                    this[this.callBackVariable] = true
                    return
                }
                this.$emit('hide')
            },
            popUpCreateDisc() {
                this.popUp('modalFlag')
            },
            popUpDelete() {
                this.popUp('deleteSongFlag')
            },
            deleteSong() {
                // 连续emit两个事件，父组件执行完第一个事件的处理函数后，再执行第二个事件的处理函数
                this.$emit('deleteSong')
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
            .icon
                margin: 0 8px
            .text
                font-size: $font-size-medium
                color: $color-text-dark
                height: 100%
                width: 100%
                display: flex
                align-items: center
                border-bottom: 1px solid $color-light
</style>