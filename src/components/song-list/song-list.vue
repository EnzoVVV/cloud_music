<template>
    <div>
        <div class='song-list'>
            <div class='header' v-if='showHeader' @click='clickHeader'>
                <IconSvg :icon-class='icon' class='icon'></IconSvg>
                <span class='title'>{{title}}</span>
                <span class='count'>{{count}}</span>
                <span class='favorite-status' @click.stop='toggleFS'>{{favoriteBtn}}</span> 
            </div>
            <ul>
                <li v-for='(song,index) in songs' :key='song.id' class='item' @click='handleClick(song,index)'>
                    <div class='img-wrapper' v-if='!showIndex'><img :src='mockImg' class='img'></img></div>
                    <p class='index' v-if='showIndex'>{{index + 1}}</p>
                    <div class='content'>
                        <h2 class='name'>{{song.name}}</h2>
                        <p class='desc'>{{getDesc(song)}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <confirm class='confirm' ref='confirm' text='确定取消收藏吗' confirmBtnText='不再收藏' @confirm='cancelFavorite'></confirm>
    </div>
</template>
<script>
    import { mockImg } from 'common/js/config'
    import confirm from 'base/confirm/confirm'
    export default {
        name: 'songlist',
        components: {
            confirm
        },
        props: {
            songs: {
                type: Array
            },
            showIndex: {
                type: Boolean,
                default: false
            },
            showHeader: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '播放全部'
            },
            icon: {
                type: String,
                default: 'start-play'
            },
            favoriteStatus: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {

            }
        },
        computed: {
            count() {
                return `(共${this.songs.length}首)`
            },
            favoriteBtn() {
                return this.favoriteStatus ? '-取消收藏' : '+收藏全部'
            }
        },
        watch: {

        },
        methods: {
            getDesc(song) {
                return song.album ? `${song.singer} - ${song.album}` : `${song.singer} - ${song.name}`
            },
            handleClick(song,index) {
                this.$emit('click',song,index)
            },
            clickHeader() {
                this.$emit('clickHeader')
            },
            cancelFavorite() {
                this.$emit('toggleFS', false)
            },
            toggleFS() {
                if(this.favoriteStatus) {
                    // 添加收藏
                    this.$emit('toggleFS', true)
                } else {
                    // 请求取消收藏
                    this.$refs.confirm.show()
                }
                
            }
        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .song-list
        background: $color-background
        border-top-left-radius: 10px
        border-top-right-radius: 10px
        .header
            height: 44px
            border-bottom: 1px solid $color-light
            display: flex
            align-items: center
            .icon
                margin: 0 15px
            .count
                padding-left: 5px
                color: $color-text-light
                font-size: $font-size-small
            .favorite-status
                margin-left: 35%
                color: $color-text-ii
        .item
            position: relative
            display: flex
            align-items: center
            box-sizing: border-box
            height: 60px
            font-size: $font-size-medium
            &:after
                content: ''
                position: absolute 
                left: 13%
                bottom: 0
                right: 0
                height: 1px
                background-color: $color-light
            .index
                float: left 
                width: 50px
                height: 50px
                display: flex
                align-items: center
                justify-content: center
                color: $color-text-g
            .img-wrapper
                width: 50px
                height: 50px
                display: flex
                align-items: center
                justify-content: center
                .img
                    width: 40px
                    height: 40px
                    overflow: hidden
            .content
                margin-left: 10px
                line-height: 20px
                align-items: center
                overflow: hidden
                .name
                    margin-top: 4px
                    font-size: $font-size-medium-x
                    no-wrap()
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-g
</style>