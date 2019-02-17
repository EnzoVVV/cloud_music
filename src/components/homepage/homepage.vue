<template>
    <div class='homepage' ref='homepage'>
        <div class='header' ref='header'>
            <div @click='goBack'><IconSvg class='header-back' icon-class='back'></IconSvg></div>
            <div class='header-title'>{{title}}</div>
            <ibutton v-if='!isSelf && !followed && reachTop' icon='add' text='关注' :red='true' size='small' class='header-favorite'></ibutton>
            <IconSvg icon-class='share' size='23px' class='header-share'></IconSvg>
        </div>
        <div class='bg-img' :style='bgStyle' ref='img'></div>
        <div class='info' ref='info'>
            <div class='wrapper'>
                <img :src='info.picUrl' class='avatar'/>
                <div class='empty'></div>
                <ibutton v-if='!isSelf && !followed' icon='add' text='关注' :red='true' class='favorite' @click='toggleFollow'></ibutton>
                <ibutton v-else-if='!isSelf && followed' icon='bingo-light' text='已关注' class='favorite' @click='toggleFollow'></ibutton>
            </div>
            <div class='name'>{{info.name}}</div>
            <div class='follow'>
                <div @click='showFollowing'>关注 {{info.followings}}  |</div>
                <div @click='showFollower'>  粉丝 {{info.followers}}</div>
            </div>
            <div class='info-wrapper'>
                <div class='info-item' v-if='info.birthday' :style='genderInfoStyle'>
                    <IconImg v-if='info.gender != undefined' :imgName='genderImg' size='10px'></IconImg>
                    <p class='age'>{{age}}</p>
                </div>
                <div class='info-level info-item' v-if='level'>{{level}}</div>
            </div>
        </div>
        <div class='fixed-tab' v-show='showFixedTab'>
            <div v-for='(tab,index) in tabs' :key='tab' class='fixed-tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                <p class='fixed-tab-text'>{{tab}}</p>
            </div>
        </div>
        <scroll :listen-scroll='listenScroll' :probe-type='probeType' :bounce='true' class='list' @scroll='handleScroll' ref='scroll'>
            <div class='wrapper'>
                <div class='tab' ref='tab'>
                    <div v-for='(tab,index) in tabs' :key='tab' class='tab-item' @click='selectTab(tab)' :class="{'active': activeTab == index}">
                        <p class='tab-text'>{{tab}}</p>
                    </div>
                </div>
                <div v-show='activeTab == 0' ref='music' class='list-music'>
                    <div class='music-header'>
                        <div class='music-header-text'>歌单({{createdPlaylists.length}})</div>
                        <div class='music-header-info'>共被收藏{{subscribedCount}}次</div>
                    </div>
                    <liner v-if='info' picUrl='static\images\play2.png' :main='recordMain' :sub='recordSub' :showImg='true' :selectable='true' @select='showRecord'></liner>
                    <liner v-for='playlist in createdPlaylists' :key='playlist.id' :picUrl='playlist.picUrl' :main='playlist.name' :sub='sub(playlist)' :showImg='true' :selectable='true' @select='selectPlaylist(playlist)'></liner>
                    <div class='music-header'>
                        <div class='music-header-text'>收藏的歌单({{favoritePlaylists.length}})</div>
                    </div>
                    <liner v-for='playlist in favoritePlaylists' :key='playlist.id' :picUrl='playlist.picUrl' :main='playlist.name' :sub='sub(playlist)' :showImg='true' :selectable='true' @select='selectPlaylist(playlist)'></liner>
                </div>
                <div v-show='activeTab == 1' ref='event' class='list-event'>
                    <event :events='events' v-if='events.length'></event>
                    <div v-else class='event-empty'>暂无动态</div>
                </div>
                <div v-show='activeTab == 2' ref='brief' class='list-brief'>
                    <div class='brief-title'>信息</div>
                    <div class='brief-content' v-if='info.level != undefined'>等级: {{info.level}}</div>
                    <div class='brief-content' v-if='info.birthday != undefined'>年龄: {{age}}</div>
                    <div class='brief-content' v-if='info.gender != undefined'>性别: {{gender}}</div>
                    <div class='brief-title'>介绍</div>
                    <div class='brief-content' v-if='info.signature'>{{info.signature}}</div>
                    <div class='brief-content' v-else>暂无介绍</div>
                </div>
            </div>
        </scroll>
        <record v-if='recordFlag' :title='recordMain' @back='recordFlag = false'></record>
        <follow v-if='followFlag' :defaultIndex='followIndex' @back='followFlag = false'></follow>
    </div>
</template>
<script>
    import ibutton from 'base/button/button'
    import { transform, translate } from 'common/js/dom'
    import { playlistMixin, homepageMixin } from 'common/js/mixins'
    import { getUserInfo, getUserDetail, getUserPlaylist, getUserEvent, followUser } from 'api/user'
    import { mapGetters, mapMutations } from 'vuex'
    const record = () => import('./sub/record/record')
    const follow = () => import('./sub/follow/follow')
    const event = () => import('components/event/event')

    const radius = 10
    export default {
        name: 'homepage',
        mixins: [ playlistMixin, homepageMixin ],
        components: {
            ibutton,
            record,
            follow,
            event
        },
        props: {
            userId: {
                type: Number
            },
            self: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                probeType: 3,
                listenScroll: true,
                tabs: ['音乐','动态','关于'],
                activeTab: 0,
                showFixedTab: false,
                headerHeight: 44,
                imgHeight: 0,
                bgStyle: {
                    backgroundImage: "static/images/default-bg.png"
                },
                headerHeight: 0,
                minHeight: 0,
                heightCheck: [
                    {
                        ref: 'music',
                        checked: false
                    },
                    {
                        ref: 'event',
                        checked: false
                    },
                    {
                        ref: 'brief',
                        checked: false
                    }
                ],
                reachTop: false,
                info: {},
                createdPlaylists: [],
                favoritePlaylists: [],
                events: [],
                recordFlag: false,
                followFlag: false,
                followIndex: 0,
                followed: false,
                isSelf: false
            }
        },
        computed: {
            title() {
                return this.reachTop ? this.info.name : ''
            },
            genderImg() {
                return this.info.gender == 'boy' ? 'boy' : 'girl'
            },
            genderInfoStyle() {
                return {
                    background: this.info.gender == 'boy' ? '#99ccff' : '#ff99cc',
                    width: '50px'
                }
            },
            gender() {
                return this.info.gender == 'boy' ? '男' : '女'
            },
            age() {
                if(this.info.birthday) {
                    const decade = this.info.birthday.slice(2,3)
                    return `${decade}0后`
                }
            },
            level() {
                return this.info.level != undefined ? `Lv.${this.info.level}` : null
            },
            recordMain() {
                return this.isSelf ? '我的听歌排行' : `${this.info.name}的听歌排行`
            },
            recordSub() {
                return `累计听歌${this.info.listenSongs}首`
            },
            subscribedCount() {
                let count = 0
                this.createdPlaylists.forEach(playlist => {
                    count += playlist.subscribedCount
                })
                return count
            },
            ...mapGetters([
                'loginUser'
            ])
        },
        watch: {
            activeTab() {
                // 不同tab下组件高度不同，需要refresh scroll
                this.$nextTick(() => {
                    this.$refs.scroll.refresh()
                }) 
            }
        },
        methods: {
            getInfo() {
                getUserInfo(this.userId).then(res => {
                    this.info = res
                    this.followed = res.followed
                    this.setHomepage(this.info)
                    this.loadImg()
                })
            },
            getPlaylist() {
                getUserPlaylist(this.userId).then(playlists => {
                    playlists.forEach(playlist => {
                        if(playlist.creator && playlist.creator.id == this.userId) {
                            this.createdPlaylists.push(playlist)
                        } else {
                            this.favoritePlaylists.push(playlist)
                        }
                    })
                    this.$nextTick(() => {
                        this.checkHeight(0)
                    })
                    if(this.isSelf) {
                        this.createdPlaylists[0].name = '我喜欢的音乐'
                    }
                })
            },
            getEvent() {
                getUserEvent(this.userId).then(res => {
                    this.events = res.filter(i => i)
                })
            },
            showRecord() {
                this.recordFlag = true
            },
            sub(playlist) {
                return `${playlist.trackCount}首, 播放${playlist.playCount}次`
            },
            eventMain(event) {
                let text = ''
                if(event.song) {
                    text = '分享单曲'
                }
                return `${this.info.name} ${text}:`
            },
            showFollowing() {
                this.followFlag = true
                this.followIndex = 0
            },
            showFollower() {
                this.followFlag = true
                this.followIndex = 1
            },
            selectPlaylist(playlist) {
                this.showComponent('discdetail', playlist)
            },
            toggleFollow() {
                this.followed = !this.followed
                followUser(this.userId, this.followed)
                const text = this.followed ? '已关注' : '已取消关注'
                this.$message(text)
            },
            goBack() {
                this.$emit('back')
            },
            selectTab(tab) {
                this.activeTab = this.tabs.indexOf(tab)
                // 组件v-show为false时，display:none， clientHeight高度为0
                // 组件v-show为true时，nextTick才能获取到真实clientHeight
                this.$nextTick(() => this.checkHeight(this.activeTab))
            },
            // TODO, 可以复用
            handleScroll(pos) {
                let scrollY = pos.y
                if(scrollY > 0) {
                    // 下滑
                    const scale = 1 + scrollY / (this.imgHeight - 100)
                    this.$refs.img.style[transform] = `scale(${scale})`
                    translate(this.$refs.info, 0, scrollY)
                    this.reachTop = false
                } else {
                    //上滑
                    if(-scrollY <= this.imgHeight -radius - this.headerHeight) {
                        this.reachTop = false
                        const distance = scrollY * 0.3
                        const bright = (1 - (Math.abs(scrollY) / this.scrollDistance) * 0.7) * 100
                        translate(this.$refs.img, 0, distance)
                        Object.assign(this.$refs.img.style, {
                            'clip-path': 'none',
                            'filter': `brightness(${bright}%)`,
                            'z-index': -1
                        })
                        const opacity = 1 - (Math.abs(scrollY) / this.scrollDistance)
                        translate(this.$refs.info, 0, scrollY)
                        Object.assign(this.$refs.info.style, {
                            opacity: opacity
                        })
                        this.showFixedTab = false
                    } else {
                        // 触顶
                        this.reachTop = true
                        const distance = this.scrollDistance * 0.3
                        const percent = Math.ceil((distance + 44 + radius) / this.imgHeight * 100)
                        Object.assign(this.$refs.img.style, {
                            'clip-path': `polygon(0% 0%, 100% 0%, 100% ${percent}%, 0% ${percent}%)`,
                            'z-index': 1
                        })
                        this.showFixedTab = true
                    }
                }
            },
            loadImg() {
                let img = new Image()
                img.src = this.info.bgUrl
                img.onload = () => {
                    this.bgStyle = `background-image: url(${this.info.bgUrl})`
                    this.$nextTick(() => {
                        this.imgHeight = this.$refs.img.clientHeight
                        // $refs.name如果取的是组件，那么是获取到了vue实例，取得dom还要$refs.name.$el
                        // 如果取的是element，那么直接$refs.name.style就行
                        let scrollTop = this.imgHeight - radius
                        this.$refs.scroll.$el.style.top = `${scrollTop}px`
                        this.scrollDistance = this.imgHeight - radius - this.headerHeight
                    })
                }
            },
            checkHeight(tabIndex) {
                if(this.heightCheck[tabIndex].checked) {
                    this.$refs.scroll.refresh()
                    return
                }
                // albumlist高度小于minHeight，则无法上移到顶部，改变最小高度，使之可以上移到顶部
                let el = this.$refs[this.heightCheck[tabIndex].ref]
                if(el.clientHeight < this.minHeight) {
                    el.style.height = this.minHeight + 'px'
                    // 更改height, 浏览器回流后刷新scroll
                    setTimeout(() => {
                        this.$refs.scroll.refresh()
                    }, 200)
                }
                this.heightCheck[tabIndex].checked = true
            },
            getHeight() {
                this.headerHeight = this.$refs.header.clientHeight
                let viewerHeight = this.$refs.homepage.clientHeight
                let tabHeight = this.$refs.tab.clientHeight
                this.minHeight = viewerHeight - this.headerHeight - tabHeight + 1
            },
            checkSelf() {
                if(this.self) {
                    this.isSelf = true
                }
                this.isSelf = this.userId === this.loginUser.id
            },
            ...mapMutations({
                'setHomepage': 'SET_HOMEPAGE'
            })
        },
        created() {
            this.getInfo()
            this.getPlaylist()
            this.getEvent()
            this.checkSelf()
        },
        mounted() {
            this.$emit('mountedCalled')
            this.getHeight()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .homepage
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 7800
        background: $color-background
        .header
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 44px
            display: flex
            align-items: center
            z-index: 150
            margin-left: 10px
            &-back
                color: $color-text-a
                float: left 
            &-title
                flex: 1
                color: $color-text-a
                padding-left: 10px
            &-favorite
                margin-right: 15px
            &-share
                margin-right: 25px
        .bg-img
            position: absolute
            width: 100%
            height: 35%
            overflow: hidden
            transform-origin: top
            background-size: cover
            background-position: 0 35%
        .info
            position: absolute
            left: 15px
            right: 15px
            top: 8%
            .wrapper
                display: flex
                align-items: center
                .avatar
                    height: 80px
                    width: 80px
                    border-radius: 50%
                .empty
                    flex: 1
                .favorite
                    border-radius: 3px
            .name
                color: $color-text-a
                font-size: $font-size-large
                padding-top: 15px
                padding-bottom: 5px
            
            .follow
                padding-bottom: 10px
                div
                    font-size: $font-size-small
                    color: $color-text-ll
                    display: inline-block
            .info-wrapper
                display: flex
                align-items: center
                margin-left: -5px
                .info-item
                    border-radius: 10px
                    height: 15px
                    width: 40px
                    display: flex
                    align-items: center
                    justify-content: center
                    font-size: $font-size-small-s
                    background: $color-text-ht
                    color: $color-text-gg
                    margin-left: 5px
                    .age
                        padding-left: 5px
            .favorite
                margin-left: 10px
        .list
            position: fixed
            top: 0
            bottom: 0
            width: 100%
            .wrapper
                position: relative
                .tab
                    display: flex
                    flex-direction: row
                    height: 30px
                    line-height: 30px
                    padding: 0 20px 5px 20px
                    background: $color-background
                    border-top-left-radius: 10px
                    border-top-right-radius: 10px
                    font-size: $font-size-small
                    .tab-item
                        flex: 1
                        text-align: center
                        position: relative
                        .tab-text
                            color: $color-text
                            margin: 0 15px
                        &.active
                            .tab-text
                                color: $color-theme
                            &:after
                                content: ''
                                position: absolute 
                                left: 50%
                                bottom: 0
                                height: 1px
                                transform: translate3d(-50%, 0, 0)
                                width: 30px
                                background: $color-theme
                .list-music
                    background: $color-background
                    .music-header
                        height: 20px
                        background: $color-light
                        display: flex
                        align-items: center
                        padding: 0 10px
                        div
                            color: $color-text-ii
                            font-size: $font-size-small
                        &-text
                            flex: 1
                .list-event
                    background: $color-background
                    .event
                        border-bottom: 1px solid $color-light
                        .msg
                            font-size: 13px
                            line-height: 20px
                            margin: 5px 5px 5px 50px
                        .song-wrapper
                            background: rgba(144,144,144,0.1)
                            margin: 0 10px 10px 50px
                            border-radius: 5px
                    .event-empty
                        font-size: $font-size-medium-x
                        color: $color-text-ii
                        display: flex
                        justify-content: center
                        padding-top: 50px
                .list-brief
                    background: $color-background
                    padding: 0 10px
                    .brief-title
                        font-weight: bold
                        padding-top: 20px
                    .brief-content
                        padding-top: 10px
        .fixed-tab
            position: absolute
            top: 44px
            left: 0
            width: 90%
            z-index: 200
            background: $color-background
            border-top-left-radius: 10px
            border-top-right-radius: 10px
            display: flex
            flex-direction: row
            height: 30px
            line-height: 30px
            padding: 0 20px 5px 20px
            font-size: $font-size-small
            .fixed-tab-item
                flex: 1
                text-align: center
                position: relative
                .fixed-tab-text
                    color: $color-text
                    margin: 0 15px
                &.active
                    .fixed-tab-text
                        color: $color-theme
                    &:after
                        content: ''
                        position: absolute 
                        left: 50%
                        bottom: 0
                        height: 1px
                        transform: translate3d(-50%, 0, 0)
                        width: 30px
                        background: $color-theme       
</style>