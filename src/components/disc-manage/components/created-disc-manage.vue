<template>
    <div>
        <minilist title='创建的歌单' @hide='hide' v-if='!modalFlag' ref='minilist'>
            <ul slot='list'>
                <li class='line' @click='popUpCreateDisc'>
                    <IconImg imgName='list-add' class='icon'></IconImg>
                    <div class='text'>创建新歌单</div>
                </li>
                <li class='line' @click='showSort'>
                    <IconImg imgName='list-manage' class='icon'></IconImg>
                    <div class='text'>歌单管理</div>
                </li>
                <li class='line'>
                    <IconImg imgName='list-restore' class='icon'></IconImg>
                    <div class='text'>恢复歌单</div>
                </li>
            </ul>
        </minilist>
        <createdisc v-if='modalFlag' @hide='hide'></createdisc>
        <sort v-if='sortFlag' :list='discList' :emitDeletedList='true' @back='finish' @deleted='handleDelete'></sort>
    </div>
</template>
<script>
    import { discMixin } from '../disc-mixin/disc-mixin'
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import createdisc from 'components/create-disc/create-disc'
    import { favoriteDisc } from 'api/disc'
    export default {
        name: 'CreatedDiscManage',
        mixins: [discMixin],
        components: {
            createdisc
        },
        props: {

        },
        data() {
            return {
                modalFlag: false,
                discList: []
            }
        },
        computed: {
            ...mapGetters([
                'discs'
            ])
        },
        watch: {

        },
        methods: {
            handleDelete(list) {
                list.forEach(disc => {
                    // 把被删除的歌单存起来, 给'恢复歌单'用
                    this.storeDiscardDisc(disc)
                    // 本地删除歌单
                    this.deleteDisc({
                        disc: disc,
                        type: 0
                    })
                    // 服务端删除歌单
                    favoriteDisc(disc.id, false)
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
            }
        },
        created() {
            // 不包含'我喜欢的音乐'
            this.discList = this.discs.slice(1)
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