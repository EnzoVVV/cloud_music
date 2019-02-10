<template>
    <div>
        <transition name='rank'>
            <div class='rank' ref='rank'>
                <div class='header'>
                    <div @click='goback' class='header-back'><IconSvg icon-class='back'></IconSvg></div>
                    <div class='header-title'>排行榜</div>
                </div>
                <scroll class='scroll' ref='scroll'>
                    <div>
                        <div class='title'>官方榜</div>
                        <ul>
                            <li class='item' v-for='item in officialList' :key='item.id' @click='selectRank(item)'>
                                <div class='icon'>
                                    <img :src='item.picUrl' width='100' height='100'>
                                </div>
                                <ul class='songlist'>
                                    <li class='song' v-for='(song, index) in item.tracks' :key='song.id || index'>
                                        <div class='index'>{{index + 1}}.</div>
                                        <div class='text'>{{song.name}} - {{song.singer}}</div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class='title'>推荐榜</div>
                        <ul class='list'>
                            <li class='list-item' v-for='item in recommendList' :key='item.id' @click='selectRank(item)'>
                                <img :src='item.picUrl' class='list-item-img'>
                                <div class='list-item-title'>{{item.name}}</div>
                            </li>
                        </ul>
                        <div class='title'>更多榜单</div>
                        <ul class='list'>
                            <li class='list-item' v-for='item in moreList' :key='item.id' @click='selectRank(item)'>
                                <img :src='item.picUrl' class='list-item-img'>
                                <div class='list-item-title'>{{item.name}}</div>
                            </li>
                        </ul>
                    </div>
                </scroll>
            </div>
        </transition>
        <rankdetail v-if='showRankDetail' :rankinfo='rankinfo' @back='showRankDetail = false'></rankdetail>
    </div>
</template>
<script>
    import { getTopList } from 'api/rank'
    import scroll from 'base/scroll/scroll'
    import { mapMutations } from 'vuex'
    import { playlistMixin } from 'common/js/mixins'
    const rankdetail = () => import('components/rank-detail/rank-detail')
    export default {
        name: 'rank',
        mixins: [playlistMixin],
        components: {
            scroll,
            rankdetail
        },
        props: {

        },
        data() {
            return {
                officialList: [],
                recommendList: [],
                moreList: [],
                showRankDetail: false,
                rankinfo: null
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            selectRank(item) {
                this.showRankDetail = true
                this.rankinfo = item
            },
            getTopLists() {
                getTopList().then(res => {
                    this.officialList = res.official
                    this.recommendList = res.recommend
                    this.moreList = res.more
                    // mounted时这些list还是空，list对应的dom还没渲染出来，所以需要updated后将scroll refresh
                })
            },
            goback() {
                this.$emit('back')
            }
        },
        updated() {
            this.$refs.scroll.refresh()
        },
        created() {
            this.getTopLists()
        },
        mounted() {
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .rank
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 4000
        background: $color-background
        &.rank-enter-active, &.rank-leave-active
            transition: all 0.4s
        &.rank-enter, &.rank-leave-to
            transform: translate3d(0, 100%, 0)
        .header
            height: 44px
            display: flex
            align-items: center
            background: $color-theme
            &-back
                margin-left: 10px
                float: left 
            &-title
                margin-left: 15px
                color: $color-text-a
        .scroll
            position: absolute
            top: 44px
            // scroll要用定位, 将bottom设置为0，不然有heaqder时滚动不到最底部
            bottom: 0
            left: 0
            right: 0
            overflow: hidden
            .title
                padding: 10px
                height: 30px
                line-height: 30px
                font-weight: bold
            .item
                display: flex
                margin: 0 10px
                padding: 3px 0 
                height: 100px
                &:last-child
                    padding-bottom: 20px
                .icon
                    flex: 0 0 100px
                    width: 100px
                    height: 100px
                    img 
                        border-radius: 5px
                .songlist
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    margin-left: 15px
                    height: 100px
                    overflow: hidden
                    color: $color-text
                    font-size: $font-size-small-s
                    border-bottom: 1px solid $color-light
                    .song
                        line-height: 30px
                        font-size: $font-size-medium
                        .index
                            float: left
                        .text
                            // 文字超出部分显示省略号
                            // text-overflow使用注意点: 用于块级元素, 需要配合overflow和white-space
                            text-overflow: ellipsis 
                            overflow: hidden
                            white-space: nowrap
            .list
                // 清除浮动 
                &:after 
                    clear:both
                    content:'.'
                    display:block
                    width: 0
                    height: 0
                    visibility:hidden
                &-item
                    float: left
                    width: 33%
                    display: inline-block
                    box-sizing: border-box
                    padding: 0 1%
                    &-img
                        width: 100%
                        height: 100%
                        display: block
                        border-radius: 5px
                    &-title
                        font-size: $font-size-medium
                        display: flex
                        justify-content: center
                        line-height: 14px
                        height: 28px
                        padding: 10px 0 5px 0
</style>