<template>
    <div>
        <minilist title='创建的歌单' @hide='hide' v-if='!modalFlag && !restoreFlag' ref='minilist'>
            <ul slot='list'>
                <li class='line' @click='popUpCreateDisc'>
                    <IconImg imgName='list-add' class='icon'></IconImg>
                    <div class='text'>创建新歌单</div>
                </li>
                <li class='line' @click='showSort'>
                    <IconImg imgName='list-manage' class='icon'></IconImg>
                    <div class='text'>歌单管理</div>
                </li>
                <li class='line' @click='showRestoreDisc'>
                    <IconImg imgName='list-restore' class='icon'></IconImg>
                    <div class='text'>恢复歌单</div>
                </li>
            </ul>
        </minilist>
        <createdisc v-if='modalFlag' @hide='hide'></createdisc>
        <sort v-if='sortFlag' :list='discList' :emitDeletedList='true' @back='finish' @deleted='handleDelete'></sort>
        <restoredisc v-if='restoreFlag' @back='hide'></restoredisc>
    </div>
</template>
<script>
    import { discMixin } from '../disc-mixin/disc-mixin'
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    const createdisc = () => import('components/create-disc/create-disc')
    const restoredisc = () => import('components/restore-disc/restore-disc')
    export default {
        name: 'CreatedDiscManage',
        mixins: [discMixin],
        components: {
            createdisc,
            restoredisc
        },
        data() {
            return {
                modalFlag: false,
                discList: [],
                restoreFlag: false
            }
        },
        computed: {
            ...mapGetters([
                'discs'
            ])
        },
        methods: {
            handleDelete(list) {
                list.forEach(disc => {
                    // 把被删除的歌单存起来, 给'恢复歌单'用
                    this.storeDiscardDisc(disc)
                    // 删除歌单
                    this.deleteDisc({
                        disc: disc,
                        type: 0
                    })
                })
            },
            finish(list) {
                if(list !== null) {
                    this.$el.style.display = 'none'
                    this.setDiscs(this.discs.slice(0,1).concat(list))
                }
                this.hide()
            },
            ...mapMutations({
                setDiscs: 'SET_DISCS'
            }),
            ...mapActions([
                'storeDiscardDisc',
                'deleteDisc'
            ]),
            popUpCreateDisc() {
                this.modalFlag = true
            },
            showRestoreDisc() {
                this.restoreFlag = true
            }
        },
        created() {
            // 不包含'我喜欢的音乐'
            this.discList = this.discs.slice(1)
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