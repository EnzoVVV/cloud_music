<template>
    <div>
        <scroll class='scroll' ref='scroll'>
            <div class='mine'>
                <div class='user-info' @click='showHomepage'>
                    <img :src='avatar' class='avatar'></img>
                    <div class='user-name'>{{userName}}</div>
                </div>
                <div class='decorate'></div>
                <div class='basic'>
                    <ul>
                        <li class='item'>
                            <IconImg imgName='mine-local' class='icon'></IconImg>
                            <div class='text'>本地音乐</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine-recent' class='icon'></IconImg>
                            <div class='text'>最近播放</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine-download' class='icon'></IconImg>
                            <div class='text'>下载管理</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine-radio' class='icon'></IconImg>
                            <div class='text'>我的电台</div>
                        </li>
                        <li class='item' @click.stop='showCollection'>
                            <IconImg imgName='mine-collection' class='icon'></IconImg>
                            <div class='text'>我的收藏</div>
                        </li>
                    </ul>
                </div>
                <div class='user-list'>
                    <div class='user-list-header'>
                        <div @click='toggleCList' class='icon-arrow'><IconSvg icon-class='down-arrow' size='18px' ref='clistArrow'></IconSvg></div>
                        <div class='text'>创建的歌单</div>
                        <div @click='showCListSetting' class='icon-setting'><IconSvg icon-class='setting' size='18px'></IconSvg></div>
                    </div>
                    <transition-group name='lists' tag='ul' class='lists'>
                        <li class='list' v-for='(disc, index) in discs' :key='disc.id' v-show='!clistFold' @click='showDiscDetail(disc)'>
                            <liner :picUrl='disc.picUrl' :main='clistMain(disc, index)' :sub='clistInfo(disc)' :showImg='true' :icon='clistIcon(index)' @iconClick='showListControl(disc,0)'></liner>
                        </li>
                    </transition-group>
                </div>
                <div class='user-list'>
                    <div class='user-list-header'>
                        <div @click='toggleFList' class='icon-arrow'><IconSvg icon-class='down-arrow' size='18px' ref='flistArrow'></IconSvg></div>
                        <div class='text'>收藏的歌单</div>
                        <div @click='showFListSetting' class='icon-setting'><IconSvg icon-class='setting' size='18px'></IconSvg></div>
                    </div>
                    <transition-group name='lists' tag='ul' class='lists'>
                        <li class='list' v-for='disc in fdiscs' :key='disc.id' v-show='!flistFold' @click='showDiscDetail(disc)'>
                            <liner :picUrl='disc.picUrl' :main='disc.name' :sub='flistInfo(disc)' :showImg='true' icon='um' @iconClick='showListControl(disc,1)'></liner>
                        </li>
                    </transition-group>
                </div>
            </div>
        </scroll>
        <!-- 我喜欢的音乐，没有这个， 创建的歌单，有编辑歌单信息 -->
        <minilist :title='listControl.title' v-if='listControl.show' @hide='listControl.show = false'>
            <ul slot='list'>
                <!-- <li class='line' v-if='listControl.type === 0'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div class='text'>编辑歌单信息</div>
                </li> -->
                <li class='line' @click='requestDeleteList'>
                    <IconImg imgName='list-delete' class='icon'></IconImg>
                    <div class='text'>删除</div>
                </li>
            </ul>
        </minilist>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import minilist from 'base/mini-list/mini-list'
    import liner from 'base/liner/liner'
    import { rotate } from 'common/js/dom'
    import { playlistMixin } from 'common/js/mixins'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'mine',
        mixins: [playlistMixin],
        components: {
            scroll,
            minilist,
            liner
        },
        props: {

        },
        data() {
            return {
                clistFold: false,
                flistFold: false,
                CreatedDiscManageFlag: false,
                listControl: {
                    show: false,
                    title: '',
                    // 0是'创建的歌单', 1是'收藏的歌单'
                    type: 0
                },
                modalFlag: false
            }
        },
        computed: {
            userName() {
                return (this.loginUser && this.loginUser.name) ? this.loginUser.name : '未登录用户'
            },
            avatar() {
                return (this.loginUser && this.loginUser.picUrl) ? this.loginUser.picUrl : 'static/images/default-avatar.png'
            },
            ...mapGetters([
                'discs',
                'fdiscs',
                'loginUser'
            ])
        },
        watch: {
        },
        methods: {
            clistIcon(index) {
                return index == 0 ? null : 'um'
            },
            // TODO，精简
            toggleCList() {
                const clistArrow = this.$refs.clistArrow.$el
                if(this.clistFold) {
                    rotate(clistArrow, 0)
                } else {
                    rotate(clistArrow, -90)
                }
                this.clistFold = !this.clistFold
            },
            toggleFList() {
                const arrow = this.$refs.flistArrow.$el
                if(this.flistFold) {
                    rotate(arrow, 0)
                } else {
                    rotate(arrow, -90)
                }
                this.flistFold = !this.flistFold
            },
            clistMain(disc, index) {
                return index == 0 ? '我喜欢的音乐' : disc.name
            },
            clistInfo(list) {
                return `${list.songList.length}首`
            },
            flistInfo(list) {
                return `${list.songList.length}首 by ${list.creator.name}`
            },
            showCListSetting() {
                this.showComponent('discmanage', 0)
            },
            showFListSetting() {
                this.showComponent('discmanage', 1)
            },
            showListControl(disc, type) {
                Object.assign(this.listControl, {
                    show: true,
                    title: disc.name,
                    type: type,
                    disc: disc
                })
            },
            requestDeleteList() {
                this.$modal(this, {
                    title: '确认删除此歌单吗',
                    confirmBtnText: '删除'
                }, 'deleteList')
            },
            deleteList() {
                const disc = this.listControl.disc
                this.deleteDisc({
                    disc: disc,
                    type: this.listControl.type
                })
                this.listControl.show = false
                this.$message('已删除')
                if(this.listControl.type == 0) {
                    // 恢复歌单，暂存删除的自创歌单
                    this.storeDiscardDisc(disc)
                }
            },
            showDiscDetail(disc) {
                this.showComponent('discdetail', disc)
            },
            showCollection() {
                this.showComponent('collection')
            },
            showHomepage() {
                this.showComponent('homepage', this.loginUser.id, true)
            },
            ...mapActions([
                'deleteDisc',
                'storeDiscardDisc'
            ])
        },
        created() {
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .scroll
        position: absolute
        width: 100%
        top: 0
        bottom: 0
        overflow: hidden
        .mine
            overflow: hidden
            .decorate
                position: absolute
                top: -30vh
                background: $color-theme
                width: 100%
                height: 35vh
                vertical-align: inherit
                z-index: -10
            .user-info
                background: $color-background
                height: 70px
                margin: 0 5px
                box-shadow: 0 0 20px rgba(0,0,0,0.3)
                border-radius: 7px
                display: flex
                align-items: center
                .avatar
                    margin: 0 15px
                    width: 50px
                    height: 50px
            .basic
                margin-top: 15px
                .item
                    height: 44px
                    display: flex
                    align-items: center
                    position: relative
                    .icon
                        margin-left: 10px
                        margin-right: 15px
                    &:after
                        content: ''
                        position: absolute 
                        left: 12%
                        bottom: 0
                        right: 0
                        height: 1px
                        background: $color-light
            .user-list
                width: 100%
                .user-list-header
                    height: 20px
                    background: $color-light
                    display: flex
                    align-items: center
                    .icon-arrow
                        padding-left: 15px
                        padding-right: 10px
                    .text
                        font-size: $font-size-small
                        color: $color-text-ii
                        flex: 1
                    .icon-setting
                        padding-right: 15px
                .lists
                    .list
                        margin-left: 5px
                        height: 60px
                        display: flex
                        align-items: center
                        position: relative
                        &.lists-enter-active, &.lists-leave-active
                            transition: all 0.1s
                        &.lists-enter, &.lists-leave-to
                            height: 0
                            opacity: 0
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