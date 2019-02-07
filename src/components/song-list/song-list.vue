<template>
    <div>
        <div class='song-list' :style='computedStyle'>
            <div class='header' v-if='showHeader'>
                <div class='header-wrapper' @click='clickHeader'>
                    <IconSvg :icon-class='icon' class='icon'></IconSvg>
                    <span class='title'>{{title}}</span>
                    <span class='count'>{{count}}</span>
                </div>
                <div class='empty'></div>
                <span class='favorite-status' v-if='showFBtn' @click.stop='toggleFS'>{{favoriteBtn}}</span> 
            </div>
            <ul>
                <li v-for='(song,index) in songs' :key='song.id' class='item' @click='handleClick(song,index)'>
                    <liner :showImg='showImg' :showIndex='showIndex' :picUrl='song.picUrl' :main='song.name' :sub='getDesc(song)' :index='index+1' :speaker='speaker' :itemId='song.id' :icon='settingIcon' @iconClick='iconClick'></liner>
                </li>
            </ul>
        </div>
        <confirm class='confirm' ref='confirm' text='确定取消收藏吗' confirmBtnText='不再收藏' @confirm='cancelFavorite'></confirm>
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import confirm from 'base/confirm/confirm'
    import { getSongPicUrl } from 'common/js/song'
    import liner from 'base/liner/liner'
    export default {
        name: 'songlist',
        components: {
            confirm,
            liner
        },
        props: {
            songs: {
                type: Array
            },
            showIndex: {
                type: Boolean,
                default: false
            },
            showImg: {
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
            // 显示收藏按钮
            showFBtn: {
                type: Boolean,
                default: true
            },
            favoriteStatus: {
                type: Boolean,
                default: false
            },
            // 控制是否有边缘圆角, singer-detail里不需要圆角
            radius: {
                type: Boolean,
                default: true
            },
            // 显示歌曲设置按钮
            setting: {
                type: Boolean,
                default: false
            },
            speaker: {
                type: Boolean,
                default: true
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
                return this.favoriteStatus ? '- 取消收藏' : '+ 收藏全部'
            },
            computedStyle() {
                if(this.radius) {
                    return {
                        'border-top-left-radius': '10px',
                        'border-top-right-radius': '10px'
                    }
                }
                return ''
            },
            settingIcon() {
                return this.setting ? 'um' : ''
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
                if(!this.favoriteStatus) {
                    // 添加收藏
                    this.$emit('toggleFS', true)
                } else {
                    // 请求取消收藏
                    this.$refs.confirm.show()
                }
            },
            iconClick(itemId) {
                if(!this.setting) {
                    return
                }
                const selectedSong = this.songs.find(song => song.id == itemId)
                this.$emit('iconClick', selectedSong)
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
        .header
            height: 44px
            border-bottom: 1px solid $color-light
            display: flex
            align-items: center
            &-wrapper
                display: flex
                align-items: center
                .icon
                    margin: 0 15px
                .count
                    padding-left: 5px
                    color: $color-text-light
                    font-size: $font-size-small
            .empty
                flex: 1
            .favorite-status
                padding: 0 10px
                color: $color-text-ii
        .item
            display: flex
            align-items: center
            box-sizing: border-box
            height: 60px
            font-size: $font-size-medium
</style>