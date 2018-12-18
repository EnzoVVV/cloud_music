<template>
    <detailboard headerTitle='歌单' :headerScrollTitle='title' :rollingTitle='true' :songs='songs' :favoriteStatus='favoriteStatus' :cover='cover' @toggleFS='toggleFS' @back='goback'>
        <div slot='info'>
            <img class='img' :src='cover'></img>
            <div class='title'>{{title}}</div>
        </div>
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
                favoriteStatus: false
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
                getDiscDetail(this.discInfo.id).then(res => {
                    this.disc = res
                    this.songs = this.disc.songList
                    this.title = this.disc.name
                    this.cover = this.disc.picUrl
                })
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
    .title
        position: absolute 
        left: 140px
        top: 70px
        color: $color-text-a
</style>