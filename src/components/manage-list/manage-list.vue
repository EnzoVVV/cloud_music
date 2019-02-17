<template>
    <div>
        <minilist :title='title' :headerBorder='false' @hide='hide' v-if='!modalFlag' ref='minilist'>
            <ul slot='list'>
                <li class='line' @click='popUpDelete'>
                    <IconImg imgName='list-delete' class='icon'></IconImg>
                    <div class='text'>删除</div>
                </li>
            </ul>
        </minilist>
        <modal v-if='deleteFlag' confirmBtnText='删除' :title='modalTitle' @confirm='deleteOne' @hide='deleteFlag = false'></modal>
    </div>
</template>
<script>
    import minilist from 'base/mini-list/mini-list'
    const modal = () => import('base/modal/modal')
    export default {
        name: 'infolist',
        components: {
            minilist,
            modal
        },
        props: {
            title: {
                type: String
            },
            modalTitle: {
                type: String
            }
        },
        data() {
            return {
                modalFlag: false,
                deleteFlag: false
            }
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
            popUpDelete() {
                this.popUp('deleteFlag')
            },
            deleteOne() {
                // 连续emit两个事件，父组件执行完第一个事件的处理函数后，再执行第二个事件的处理函数
                this.$emit('deleteOne')
                this.$emit('hide')
            }
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