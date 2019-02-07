<template>
    <div>
        <minilist title='收藏的歌单' @hide='hide' ref='minilist'>
            <ul slot='list'>
                <li class='line' @click='showSort'>
                    <IconImg imgName='list-manage' class='icon'></IconImg>
                    <div class='text'>歌单管理</div>
                </li>
            </ul>
        </minilist>
        <sort v-if='sortFlag' :list='fdiscs' @back='finish' @deleted='handleDelete'></sort>
    </div>
</template>
<script>
    import { discMixin } from '../disc-mixin/disc-mixin'
    import { mapGetters, mapMutations } from 'vuex'
    export default {
        name: 'FavoriteDiscManage',
        mixins: [discMixin],
        components: {
        },
        props: {

        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'fdiscs'
            ])
        },
        watch: {

        },
        methods: {
            handleDelete(list) {
                list.forEach(disc => {
                    // 把被删除的歌单存起来, 给'恢复歌单'用
                    this.storeDiscardDisc(disc)
                    // 删除歌单
                    this.deleteDisc({
                        disc: disc,
                        type: 1
                    })
                })
            },
            finish(list) {
                if(list !== null) {
                    this.$el.style.display = 'none'
                    this.setFDiscs(list)
                }
                this.hide()
            },
            ...mapMutations({
                setFDiscs: 'SET_F_DISCS'
            })
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