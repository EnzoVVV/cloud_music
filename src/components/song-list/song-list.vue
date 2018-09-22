<template>
    <div class='song-list'>
        <ul>
            <li v-for='(song,index) in songs' :key='song.id' class='item' @click='handleClick(song,index)'>
                <p class='count'>{{index + 1}}</p>
                <div class='content'>
                    <h2 class='name'>{{song.name}}</h2>
                    <p class='desc'>{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'songlist',
        components: {

        },
        props: {
            songs: {
                type: Array
            }
        },
        data() {
            return {

            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            getDesc(song) {
                return `${song.singer}-${song.album}`
            },
            handleClick(song,index) {
                this.$emit('click',song,index)
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
        .item
            position: relative
            display: flex
            align-items: center
            box-sizing: border-box
            height: 60px
            border-bottom: 1px solid rgb(228, 228, 228)
            font-size: $font-size-medium
            .count
                flex: 0 0 50px
                width: 50px
                text-align: center
                color: $color-text-g
            .content
                flex: 1
                line-height: 20px
                align-items: center
                overflow: hidden
                .name
                    margin-top: 4px
                    width: 80%
                    no-wrap()
                    color: $color-text
                .desc
                    no-wrap();
                    width: 80%
                    font-size: 12px
                    color: $color-text-g
</style>