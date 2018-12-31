<template>
    <div>
        <minilist title='收藏的歌单' @hide='hide'>
            <ul slot='list'>
                <li class='line'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>歌单管理</div>
                </li>
            </ul>
        </minilist>
        <sort v-if='sortFlag' :list='fdiscs' @back='finish'></sort>
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
            finish(list) {
                if(list != null) {
                    this.$el.style.display = 'none'
                    this.setFDisc(list)
                }
                this.hide()
            },
            ...mapMutations({
                setFDisc: 'SET_F_DISCS'
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