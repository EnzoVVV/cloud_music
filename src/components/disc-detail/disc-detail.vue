<template>
    <detailboard headerTitle='歌单' :subject='discInfo' :creator='creator' :headerScrollTitle='title' :rollingTitle='true' :songs='songs' :showFBtn='showFBtn' :favoriteStatus='favoriteStatus' :cover='cover' :showIndex='true' :showDelete='mine' @toggleFS='toggleFS' @back='goback'>
    </detailboard>
</template>
<script>
    import detailboard from 'components/detail-board/detail-board'
    import { mapActions, mapGetters } from 'vuex'
    import { getDiscDetail, favoriteDisc } from 'api/disc'
    export default {
        name: 'discdetail',
        components: {
            detailboard
        },
        props: {
            discInfo: {
                type: Object
            }
        },
        data() {
            return {
                disc: null,
                songs: [],
                title: '',
                cover: '',
                favoriteStatus: false,
                showFBtn: true,
                creator: {},
                // 是自创的歌单
                mine: false
            }
        },
        computed: {
            ...mapGetters([
                'fdiscs',
                'loginUser',
                'discs'
            ])
        },
        watch: {

        },
        methods: {
            checkFavoriteStatus() {
                this.favoriteStatus = !!this.fdiscs.find(i => i.id === this.discInfo.id)
            },
            toggleFS(status) {
                this.favoriteDisc({
                    disc: this.disc, 
                    status: status
                })
                this.favoriteStatus = status
                const text = status ? '已收藏' : '已取消收藏'
                this.$message(text)
            },
            ...mapActions([
                'favoriteDisc'
            ]),
            getDiscDetails() {
                // 是我创建的歌单
                if(this.isMyDisc()) {
                    this.showFBtn = false
                    this.mine = true
                    this.disc = this.discInfo
                    this.songs = this.discInfo.songList
                    this.title = '我喜欢的音乐'
                    this.cover = this.discInfo.picUrl
                    this.creator = this.loginUser
                } else {
                    getDiscDetail(this.discInfo.id).then(res => {
                        this.disc = res
                        this.songs = this.disc.songList
                        this.title = this.disc.name
                        this.cover = this.disc.picUrl
                        this.creator = this.disc.creator
                    })
                }
            },
            isMyDisc() {
                const creator = this.discInfo.creator
                return (creator && (creator.id === this.loginUser.id || creator.marker === 'self'))
            },
            goback() {
                this.$emit('back')
            }
        },
        created() {
            this.getDiscDetails()
            this.checkFavoriteStatus()
        },
        mounted() {
            this.$emit('mountedCalled')
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .img
        width: 100px
        height: 100px
        overflow: hidden
        position: absolute 
        left: 20px
        top: 60px
        border-radius: 5px
    .title
        position: absolute 
        left: 140px
        top: 70px
        color: $color-text-a
</style>