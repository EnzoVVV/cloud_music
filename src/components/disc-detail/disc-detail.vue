<template>
    <detailboard headerTitle='歌单' :subject='discInfo' :creator='creator' :headerScrollTitle='title' :rollingTitle='true' :songs='songs' :showFBtn='showFBtn' :favoriteStatus='favoriteStatus' :cover='cover' :showIndex='true' @toggleFS='toggleFS' @back='goback'>
    </detailboard>
</template>
<script>
    import detailboard from 'components/detail-board/detail-board'
    import { mapActions, mapGetters } from 'vuex'
    import { getDiscDetail } from 'api/disc'
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
                creator: {}
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
            checkFavoriteStatus() {
                this.favoriteStatus = !!this.fdiscs.find(i => i.id === this.discInfo.id)
            },
            toggleFS(status) {
                this.favoriteDisc({
                    disc: this.discInfo, 
                    status: status
                })
                this.favoriteStatus = !this.favoriteStatus
            },
            ...mapActions([
                'favoriteDisc'
            ]),
            getDiscDetails() {
                // 是我创建的歌单
                if(this.discInfo.creator && this.discInfo.creator.name == 'self') {
                    this.showFBtn = false
                    this.disc = this.discInfo
                    this.songs = this.discInfo.songList
                    this.title = this.discInfo.name
                    this.cover = this.discInfo.picUrl
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
            goback() {
                this.$emit('back')
            }
        },
        created() {
            this.getDiscDetails()
            this.checkFavoriteStatus()
        },
        mounted() {

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