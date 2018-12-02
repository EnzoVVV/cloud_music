<template>
    <detailboard :headerTitle='headerTitle' :headerScrollTitle='headerScrollTitle' :rollingTitle='true' :songs='songs' :favoriteStatus='favoriteStatus' @toggleFS='toggleFS'>
        <div slot='info'>
            <img class='img' :src='mockImg'></img>
            <div class='title'>{{title}}</div>
        </div>
    </detailboard>
</template>
<script>
    import { mockImg } from 'common/js/config'
    import detailboard from 'components/detail-board/detail-board'
    import { createSong } from 'common/js/song' 
    export default {
        name: 'discdetail',
        components: {
            detailboard
        },
        props: {

        },
        data() {
            return {
                mockImg: mockImg,
                songs: [],
                title: '世间好物不坚牢 彩云易散琉璃翠',
                headerTitle: '歌单',
                headerScrollTitle: '世间好物不坚牢 彩云易散琉璃翠 永远的乌托邦',
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
                } else {
                    // 取消收藏
                }
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
            // TODO, 传进来的是一个歌单，从中提取出来歌曲列表，生成song class， push进this.songs
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .img
        width: 100%
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