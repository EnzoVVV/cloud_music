<template>
    <div>
        <scroll class='scroll' ref='scroll'>
            <div class='mine'>
                <div class='user-info'>
                    <IconImg imgName='default-avatar' class='avatar' size='50px'></IconImg>
                    <div class='user-name'>{{userName}}</div>
                </div>
                <div class='decorate'></div>
                <div class='basic'>
                    <ul>
                        <li class='item'>
                            <IconImg imgName='mine' class='icon'></IconImg>
                            <div class='text'>本地音乐</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine' class='icon'></IconImg>
                            <div class='text'>最近播放</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine' class='icon'></IconImg>
                            <div class='text'>下载管理</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine' class='icon'></IconImg>
                            <div class='text'>我的电台</div>
                        </li>
                        <li class='item'>
                            <IconImg imgName='mine' class='icon'></IconImg>
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
                        <li class='list' v-for='list in discs' :key='list.name' v-show='!clistFold'>
                            <img class='img' v-lazy='list.picUrl'></img>
                            <div class='text'>
                                <div class='name'>{{list.name}}</div>
                                <p class='info'>{{clistInfo(list)}}</p>
                            </div>
                            <!-- TODO，搞个图标 -->
                            <div class='icon' @click='showListControl(list,1)' v-if='list.id != 1'><IconImg img-name='music'></IconImg></div>
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
                        <li class='list' v-for='list in fdiscs' :key='list.name' v-show='!flistFold'>
                            <img class='img' v-lazy='list.picUrl'></img>
                            <div class='text'>
                                <div class='name'>{{list.name}}</div>
                                <p class='info'>{{flistInfo(list)}}</p>
                            </div>
                            <div class='icon' @click='showListControl(list,2)'><IconImg img-name='music'></IconImg></div>
                        </li>
                    </transition-group>
                </div>
            </div>
        </scroll>
        <!-- 我喜欢的音乐，没有这个， 创建的歌单，有编辑歌单信息 -->
        <minilist :title='listControl,title' v-if='listControl.show' @hide='listControl.show = false'>
            <ul>
                <li class='line' v-if='listControl.isCList'>
                    <IconSvg icon-class='video' class='icon'></IconSvg>
                    <div>编辑歌单信息</div>
                </li>
                <li class='line' @click='requestDeleteList'>
                    <IconSvg icon-class='clear' class='icon'></IconSvg>
                    <div>删除</div>
                </li>
            </ul>
        </minilist>
    </div>
</template>
<script>
    const mockUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4o0FN1T9tJYFQsg6VS_ABXxB1tIvndE7cwipQH79XaxxAMZ5f'
    import scroll from 'base/scroll/scroll'
    import minilist from 'base/mini-list/mini-list'
    import { rotate } from 'common/js/dom'
    import { playlistMixin } from 'common/js/mixins'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'mine',
        mixins: [playlistMixin],
        components: {
            scroll,
            minilist
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
                    id: null,
                    title: '',
                    isCList: false,
                    isDefaultCList: false
                },
                modalFlag: false
            }
        },
        computed: {
            userName() {
                return '用户名'
            },
            ...mapGetters([
                'discs',
                'fdiscs'
            ])
        },
        watch: {
        },
        methods: {
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
            clistInfo(list) {
                return `${list.count}首`
            },
            flistInfo(list) {
                return `${list.count}首 by ${list.creator}`
            },
            showCListSetting() {
                this.$bus.emit('showDiscManage', 0)
            },
            showFListSetting() {
                this.$bus.emit('showDiscManage', 1)
            },
            showListControl(list, type) {
                Object.assign(this.listControl, {
                    show: true,
                    id: list.id,
                    title: list.name,
                    isCList: type === 1,
                    idDefaultCList: type === 0
                })
            },
            requestDeleteList() {
                this.$modal(this, {
                    title: '确认删除此歌单吗',
                    confirmBtnText: '删除'
                }, 'deleteList')
            },
            deleteList() {
                this.deleteDisc(this.listControl)
                this.listControl.show = false
                this.$message('已删除')
            },
            ...mapActions([
                'deleteDisc'
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
                height: 100%
                .user-list-header
                    height: 30px
                    background: $color-light
                    display: flex
                    align-items: center
                    .icon-arrow
                        position: absolute
                        left: 10px
                    .text
                        position: absolute
                        left: 40px
                        font-size: $font-size-small
                    .icon-setting
                        position: absolute
                        right: 15px
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
                        &:after
                            content: ''
                            position: absolute 
                            left: 14%
                            bottom: 0
                            right: 0
                            height: 1px
                            background: $color-light
                        .img
                            width: 50px
                            height: 50px
                            border-radius: 5px
                            overflow: hidden
                        .text
                            margin-left: 10px
                            width: calc(100% - 100px)
                            .name
                                padding-bottom: 6px
                            .info
                                color: $color-text-g
                                font-size: $font-size-small
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