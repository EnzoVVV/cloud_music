<template>
    <div>
        <div class='background' @click='back' ref='bg'>
        </div>
        <div class='menu' @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend' ref='menu'>
            <scroll class='scroll' ref='scroll' :listen-scroll='listenScroll' :probe-type='probeType'>
                <div>
                    <div class='header' ref='header'>
                        <div class='header-wrapper'>
                            <img class='avatar' :src='userInfo.picUrl'></img>
                            <div class='info'>
                                <span @click='showHomepage'>{{userInfo.name}}</span>
                            </div>
                        </div>
                    </div>
                    <ul>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的会员</span>
                        </li>
                        <li class='line' @click='showFollow'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的好友</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                        <li class='line'>
                            <IconSvg icon-class='setting'></IconSvg>
                            <span>我的消息</span>
                        </li>
                    </ul>
                </div>
            </scroll>
            <div class='bottom'>
                <div class='item'>
                    <IconImg imgName='night'></IconImg>
                    <span>夜间模式</span>
                </div>
                <div class='item'>
                    <IconImg imgName='setting'></IconImg>
                    <span>设置</span>
                </div>
                <div class='item'>
                    <IconImg imgName='exit'></IconImg>
                    <span>退出</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { scrollMixin } from 'common/js/mixins'
    import { translate, changeOpacity, opacity } from 'common/js/dom'
    import { loginStatus } from 'api/login'
    import { getUserInfo } from 'api/user'
    import { mapGetters, mapMutations} from 'vuex'
    export default {
        name: 'leftmenu',
        mixins: [scrollMixin],
        components: {

        },
        props: {
        },
        data() {
            return {
                showLeftMenu: false,
                touch: {},
                userInfo: {
                    picUrl: 'static/images/default-avatar.png',
                    name: '未登录'
                }
            }
        },
        computed: {
            ...mapGetters([
                'loginUser'
            ])
        },
        watch: {
        },
        methods: {
            showHomepage() {
                if(!this.login) {
                    return
                }
                this.fold()
                setTimeout(() => {
                    this.showComponent('homepage', this.userInfo.id, true)
                    this.hide()
                }, 300)
            },
            showFollow() {
                this.fold()
                this.setHomepage(this.userInfo)
                setTimeout(() => {
                    this.showComponent('follow', '我的好友')
                    this.hide()
                }, 300)
            },
            fold() {
                translate(this.$refs.menu, -100, 0, {
                    transitionDuration: '0.3s',
                    percent: true
                })
                changeOpacity(this.$refs.bg, 0, 300)
            },
            hide() {
                this.$emit('hide')
            },
            back() {
                this.fold()
                setTimeout(() => {
                    this.hide()
                }, 300)
            },
            touchstart(e) {
                this.touch.initiated = true
                const touch = e.touches[0]
                this.touch.startX = touch.pageX
            },
            touchmove(e) {
                if(!this.touch.initiated) {
                    return
                }
                const touch = e.touches[0]
                const deltaX = touch.pageX - this.touch.startX
                this.touch.totalDiff = deltaX < 0 ? deltaX : 0
                if(this.touch.totalDiff < 0) {
                    translate(this.$refs.menu, this.touch.totalDiff, 0)
                    this.$refs.bg.style[opacity] = 0.5 * (1 + this.touch.totalDiff / this.maxMoveDistance)
                }
            },
            touchend(e) {
                if(!this.touch.initiated) {
                    return 
                }
                if(this.touch.totalDiff < 0) {
                    let moveDistance = 0
                    if(Math.abs(this.touch.totalDiff) > this.maxMoveDistance / 2) {
                        moveDistance = -this.maxMoveDistance
                    } else {
                        moveDistance = this.touch.totalDiff = 0
                    }
                    translate(this.$refs.menu, moveDistance, 0, {
                        transitionDuration: duration + 'ms'
                    })
                    changeOpacity(this.$refs.bg, 0.5, duration)
                    if(moveDistance < 0) {
                        setTimeout(() => {
                            this.hide()
                        }, duration)
                    }
                }
                this.touch = {}
            },
            getUserInfo() {
                loginStatus().then(res => {
                    if(res) {
                        this.userInfo = res
                        this.getUserBG()
                        this.login = true
                    }
                })
            },
            getUserBG() {
                getUserInfo(this.userInfo.id).then(res => {
                    this.userInfo.bgUrl = res.bgUrl
                    this.setUser(this.userInfo)
                    this.setBG()
                })
            },
            setBG() {
                this.$nextTick(() => {
                    this.$refs.header.style.backgroundImage = `url(${this.userInfo.bgUrl})`
                }) 
            },
            ...mapMutations({
                setUser: 'SET_LOGIN_USER',
                setHomepage: 'SET_HOMEPAGE'
            })
        },
        created() {
            if(!this.loginUser) {
                this.getUserInfo()
            } else {
                this.userInfo = this.loginUser
                this.login = true
                if(this.userInfo.bgUrl) {
                    this.setBG()
                }
            }
        },
        mounted() {
            this.showLeftMenu = true
            this.maxMoveDistance = window.innerWidth * 0.85
            translate(this.$refs.menu, 0, 0, {
                transitionDuration: '0.3s',
                percent: true
            })
            changeOpacity(this.$refs.bg, 0.5, 300)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .background
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: $color-text
        opacity: 0
        z-index: 5900
    .menu
        position: fixed
        left: 0
        top: 0
        right: 15%
        bottom: 0
        z-index: 6000
        transform: translate3d(-100%, 0, 0)
        background: $color-theme-l
        overflow: hidden
        .scroll
            position: absolute 
            left: 0
            top: 0
            right: 0
            bottom: 44px
            overflow: hidden
            .header
                width: 100%
                height: 130px
                overflow: hidden
                background-image: 'static\images\default-bg.png'
                position: relative
                &-wrapper
                    position: absolute 
                    left: 15px
                    bottom: 15px
                    width: 100%
                    .avatar
                        width: 60px
                        height: 60px
                        padding-bottom: 15px
                        border-radius: 50%
            .line
                padding-left: 5px
                line-height: 44px
                height: 44px
                width: 100%
                display: flex
                align-items: center
                span 
                    margin-left: 5px
        .bottom
            position: absolute 
            left: 0
            top: calc(100% - 44px)
            right: 0
            bottom: 0
            display: flex
            align-items: center
            justify-content: center
            .item
                flex: 1
                display: flex
                justify-content: center
                align-items: center
                span 
                    margin-left: 5px
</style>