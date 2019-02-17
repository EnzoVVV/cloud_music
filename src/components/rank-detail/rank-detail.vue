<template>
    <detailboard headerTitle='歌单' :headerScrollTitle='headerScrollTitle' :subTitle='updateTime' :rollingTitle='true' :blur='true' :songs='songs' :subject='subject' :showIndex='true' :cover='cover' :favoriteStatus='favoriteStatus' @toggleFS='toggleFS' @back='back'>
    </detailboard>
</template>
<script>
    import { getMusicList } from 'api/rank'
    import { ERR_OK } from 'api/config'
    import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
    import detailboard from 'components/detail-board/detail-board'
    import { getRankDetail } from 'api/rank'
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: 'rankdetail',
        components: {
            detailboard
        },
        props: {
            rankinfo: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                songs: [],
                favoriteStatus: false,
                cover: '',
                subject: {}
            }
        },
        computed: {
            updateTime() {
                if(this.rankinfo && this.rankinfo.upateTime) {
                    let time = new Date(this.rankinfo.updateTime)
                    let month = time.getMonth() + 1
                    let day = time.getDate()
                    return `最近更新: ${month}月${day}日`
                }
                return ''
            },
            headerScrollTitle() {
                if(this.rankinfo && this.rankinfo.name) {
                    return this.rankinfo.name
                }
                return '歌单'
            },
            ...mapGetters([
                'fdiscs'
            ])
        },
        methods: {
            getMusicLists() {
                getMusicList(this.rankinfo.id).then((res) => {
                    if (res.code === ERR_OK) {
                        processSongsUrl(this.normalizeSongs(res.songlist)).then((songs) => {
                            this.songs = songs
                        })
                    }
                })
            },
            normalizeSongs(list) {
                let ret = []
                list.forEach((item) => {
                    const musicData = item.data
                    if (isValidMusic(musicData)) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            },
            back() {
                this.$emit('back')
            },
            getDetail() {
                const idx = this.rankinfo.idx
                getRankDetail(idx).then(res => {
                    this.songs = res.songs
                    this.cover = res.picUrl
                    Object.assign(this.subject, {
                        id: res.id,
                        picUrl: res.picUrl,
                        name: res.name,
                        creator: res.creator
                    })
                })
            },
            checkFS() {
                this.favoriteStatus = !!this.fdiscs.find(i => i.id === this.rankinfo.id)
            },
            toggleFS(status) {
                this.favoriteDisc({
                    disc: this.rankinfo,
                    status: status
                })
                this.favoriteStatus = status
                const text = status ? '已收藏' : '已取消收藏'
                this.$message(text)
            },
            ...mapActions([
                'favoriteDisc'
            ])
        },
        created() {
            this.getDetail()
            this.checkFS()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    // 覆盖引用的detail-board组件内的样式
    &.detail-board-enter, &.detail-board-leave-to
        transform: translate3d(100%, 0, 0) !important
</style>