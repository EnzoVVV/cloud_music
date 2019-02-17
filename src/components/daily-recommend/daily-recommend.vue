<template>
    <detailboard headerTitle='每日推荐' :blur='true' :songs='songs' :showImg='true' :cover='cover' :cusInfo='true' :showFunc='false' :showFBtn='false' :showSearch='false' @back='back'>
        <div class='bg' slot='info'>
            <IconSvg icon-class='calendar' class='calendar' size='150px'></IconSvg>
            <span class='date'>{{day}}</span>
            <span class='tip'>根据你的音乐口味生成, 每天6:00更新</span>
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
        data() {
            return {
                songs: [],
                cover: 'static/images/default-bg.png'
            }
        },
        computed: {
            day() {
                return (new Date()).getDate()
            }
        },
        methods: {
            back() {
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
        .calendar
            position: absolute
            left: 0
            top: 15px
        .date
            position: absolute 
            left: 52px
            top: 77px
            font-size: $font-size-large-e
            color: $color-text-a
        .tip
            width: 100%
            color: $color-text-d
            font-size: $font-size-small-s
            position: absolute
            left: 43px
            bottom: 0
</style>