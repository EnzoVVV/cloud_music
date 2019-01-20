<template>
    <detailboard headerTitle='每日推荐' :blur='true' :songs='songs' :showImg='true' :cover='cover' :cusInfo='true' :showFunc='false' :showFBtn='false' :showSearch='false'>
        <div class='bg' slot='info'>
            <div class='info'>
                <IconSvg icon-class='calendar' class='calendar' size='150px'></IconSvg>
                <span class='date'>{{day}}</span>
            </div>
        </div>
    </detailboard>
</template>
<script>
    import { mapActions } from 'vuex'
    import { getDailyRecommend } from 'api/recommend'
    import { createSong } from 'common/js/song'
    import detailboard from 'components/detail-board/detail-board'
    export default {
        name: 'DailyRecommend',
        components: {
            detailboard
        },
        props: {

        },
        data() {
            return {
                songs: [],
                cover: ''
            }
        },
        computed: {
            day() {
                return (new Date()).getDate()
            }
        },
        watch: {

        },
        methods: {
            goback() {
                this.$emit('back')
            },
            selectSong(song, index) {
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            playAll() {
                this.selectPlay({
                    list: this.songs,
                    index: 0
                })
            },
            ...mapActions([
                'selectPlay'
            ]),
            getRecommend() {
                getDailyRecommend().then(res => {
                    this.songs = res
                })
            }
        },
        created() {
            this.getRecommend()
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .bg
        position: relative 
        width: 100%
        height: 160px
        overflow: hidden
        .info
            position: absolute 
            left: -20px
            bottom: 0
            .date
                position: absolute 
                left: 62px
                bottom: 45px
                font-size: $font-size-large-e
                color: $color-text-a
</style>