<template>
    <div>
        <minilist title='创建的歌单' @hide='hide' v-if='!modalFlag'>
            <ul slot='list'>
                <li class='line' @click='popUpCreateDisc'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>创建新歌单</div>
                </li>
                <li class='line' @click='showSort'>
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
        <sort v-if='sortFlag' :list='discList' :emitDeletedList='true' @back='finish' @deleted='handleDelete'></sort>
    </div>
</template>
<script>
    import { discMixin } from '../disc-mixin/disc-mixin'
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import createdisc from 'components/create-disc/create-disc'
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
                // 把被删除的歌单存起来, 给'恢复歌单'用
                list.forEach(disc => {
                    this.storeDiscardDisc(disc)
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
                'storeDiscardDisc'
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