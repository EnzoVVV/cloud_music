<template>
    <detailboard headerTitle='歌单' :headerScrollTitle='title' :rollingTitle='true' :songs='songs' :favoriteStatus='favoriteStatus' :cover='cover' @toggleFS='toggleFS' @back='goback'>
        <div slot='info'>
            <img class='img' v-lazy='cover'></img>
            <div class='title'>{{title}}</div>
        </div>
    </detailboard>
</template>
<script>
    import detailboard from 'components/detail-board/detail-board'
    import { mapActions } from 'vuex'
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

        },
        watch: {

        },
        methods: {
            toggleFS(status) {
                if(status) {
                    // 添加收藏
                    this.favoriteDisc()
                } else {
                    // 取消收藏
                }
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