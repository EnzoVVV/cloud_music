<template>
    <div>
        <div>
            <Header @clickTab='clickTab' :defaultIndex='defaultIndex'></Header>
            <swiper :componentList='componentList' :defaultIndex='defaultIndex' :height='swiperHeight' ref='swiper'></swiper>
        </div>
        <hub></hub>
    </div>
</template>
<script>
    import Header from 'components/header/header'
    import music from 'components/music/music'
    import mine from 'components/mine/mine'
    import video from 'components/video/video'
    import swiper from 'base/swiper/swiper'
    import { findComponentDownward } from 'common/js/tools'
    import { mapActions, mapMutations } from 'vuex'
    import hub from 'components/hub/hub'
    import { getUserPlaylist } from 'api/user'
    import { getDiscDetail } from 'api/disc'
    import { login } from 'api/login'
    import storage from 'good-storage'
    import { DISC_KEY, DISC_F_KEY, setDiscs } from 'common/js/cache'
    const componentList = [
        {
            component: mine,
            name: 'mine'
        },
        {
            component: music,
            name: 'music'
        },
        {
            component: video,
            name: 'video'
        }
    ]
    export default {
        name: 'portal',
        components: {
            swiper,
            Header,
            hub
        },
        data() {
            return {
                componentList: componentList,
                swiperHeight: window.innerHeight - 44,
                defaultIndex: 1,
                curIndex: 1,
                tabs: null,
                userId: null
            }
        },
        methods: {
            clickTab(index) {
                this.curIndex = index
                this.$refs.swiper.swipeTo(index)
            },
            touchend(diff) {
                const direction = Math.sign(diff)
                this.curIndex = this.curIndex - direction
                this.tabs.setActiveStyle(this.curIndex)
            },
            getTabs() {
                this.tabs = findComponentDownward(this,'tabs')
            },
            ...mapActions([
                'restoreDisc',
                'restoreAlbums',
                'restoreSingers'
            ]),
            ...mapMutations({
                setUser: 'SET_LOGIN_USER'
            })
        },
        created() {
            login().then(res => {
                this.setUser(res)
                this.userId = res.id
            }).then(() => {
                if(!storage.get(DISC_KEY, null) || !storage.get(DISC_F_KEY, null)) {
                    getUserPlaylist(this.userId).then(playlists => {
                        let promises = playlists.map(playlist => getDiscDetail(playlist.id))
                        Promise.all(promises).then(discs => {
                            let createdDiscs = []
                            let favoriteDiscs = []
                            discs.forEach(disc => {
                                if(disc.creator && disc.creator.id == this.userId) {
                                    createdDiscs.push(disc)
                                } else {
                                    favoriteDiscs.push(disc)
                                }
                            })
                            setDiscs(createdDiscs, 0)
                            setDiscs(favoriteDiscs, 1)
                            this.restoreDisc()
                        })
                    })
                } else {
                    this.restoreDisc()
                }
            })
            this.curIndex = this.defaultIndex
            // this.restoreDisc()
            this.restoreAlbums()
            this.restoreSingers()
        },
        mounted() {
            this.$refs.swiper.$on('updatetouchend',this.touchend)
            this.getTabs()
        }
    }
</script>