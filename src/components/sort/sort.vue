<template>
    <div class='sort'>
        <div class='header'>
            <div @click='back' class='back'><IconSvg icon-class='back'></IconSvg></div>
            <span class='title'>{{title}}</span>
            <span class='check' @click='toggleCheckAll'>{{checkAllText}}</span>
        </div>
        <sortlist class='sortlist' :list='list' ref='sortlist' @check='check'></sortlist>
        <div class='bottom'>
            <div @click='requestDelete'>
                <IconSvg icon-class='clear' size='35px'></IconSvg>
                <div class='text'>删除</div>
            </div>
        </div>
    </div>
</template>
<script>
    import sortlist from 'base/sort-list/sort-list'
    export default {
        name: 'sort',
        components: {
            sortlist
        },
        props: {
            list: {
                type: Array,
                default: () => []
            },
            emitDeletedList: {
                type: Boolean,
                default: false
            },
            messageText: {
                type: String,
                default: '未选择歌单'
            },
            modalText: {
                type: String,
                default: '是否删除歌单'
            }
        },
        data() {
            return {
                checkedItemCount: 0
            }
        },
        computed: {
            title() {
                return `已选${this.checkedItemCount}项`
            },
            allChecked() {
                return this.checkedItemCount === this.list.length
            },
            checkAllText() {
                return this.allChecked ? '取消全选' : '全选'
            }
        },
        methods: {
            check(count) {
                this.checkedItemCount = count
            },
            toggleCheckAll() {
                this.$refs.sortlist.toggleCheckAll()
            },
            requestDelete() {
                if(this.checkedItemCount === 0) {
                    this.$message(this.messageText)
                } else {
                    this.$modal(this, {
                        title: this.modalText,
                        confirmBtnText: '删除',
                        cancelBtnText: '取消'
                    }, 'handleDelete')
                }
            },
            handleDelete() {
                this.$refs.sortlist.doDelete()
                if(this.emitDeletedList) {
                    // 传出被删除的项
                    const deletedList = this.$refs.sortlist.getDeletedList()
                    this.$emit('deleted', deletedList)
                }
                this.checkedItemCount = 0
            },
            back() {
                // 没有行重新排列时，sortedList为null，外部无需更改
                const sortedList = this.$refs.sortlist.getSortedList()
                this.$emit('back', sortedList)
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .sort
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 6000
        background: $color-background
        .header
            position: fixed
            top: 0
            height: 44px
            width: 100%
            display: flex
            align-items: center
            background: $color-theme
            color: $color-text-a
            z-index: 1
            .back
                margin: 0 10px
            .title
                color: $color-text-a
                flex: 1
            .check
                margin-right: 15px
        .sortlist
            position: absolute
            left: 0
            right: 0
            top: 44px
            bottom: 60px
        .bottom
            position: fixed
            bottom: 0
            height: 60px
            width: 100%
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            background: $color-background
            border-top: 1px solid $color-light
            .text
                color: $color-text-ii
</style>