<template>
    <detailboard headerTitle='歌单' :blur='false' :songs='songs' @toggleFS='toggleFS'>
    </detailboard>
</template>
<script>
    import { mapActions } from 'vuex'
    import { getMusicList } from 'api/rank'
    import { ERR_OK } from 'api/config'
    import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
    import detailboard from 'components/detail-board/detail-board'
    import { mockImg } from 'common/js/config'
    export default {
        name: 'rankdetail',
        components: {
            detailboard
        },
        props: {
            rankinfo: {
                type: Object
            }
        },
        data() {
            return {
                songs: [],
                node: null,
                headerTitle: '',
                mockImg: mockImg
            }
        },
        computed: {
            updateTime() {
                if(this.rankinfo.upateTime) {
                    let time = new Date(this.rankinfo.updateTime)
                    let month = time.getMonth() + 1
                    let day = time.getDate()
                    return `最近更新: ${month}月${day}日`
                }
                return ''
            }
        },
        watch: {

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
            toggleFS(status) {

            },
            goback() {
                this.$emit('back')
            }
        },
        created() {
            // mock
            for(let i=0;i<30;i++) {
                const songData = {
                    id: i,
                    mid: i,
                    songname: '翅膀',
                    singer: [{name: '肆喜'}],
                    album: 'TV WATCH TV',
                    duration: 3,
                    img: mockImg,
                    url: ''
                }
                this.songs.push(createSong(songData))
            }
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    // 覆盖引用的detail-board组件内的样式
    &.detail-board-enter, &.detail-board-leave-to
        transform: translate3d(100%, 0, 0) !important
</style>