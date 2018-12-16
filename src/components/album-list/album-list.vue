<template>
    <div class='album-list'>
        <ul>
            <li v-for='album in albums' :key='album.id' class='item'>
                <img class='img' :src='album.img'></img>
                <div class='content'>
                    <p class='name'>{{album.name}}</p>
                    <p class='desc'>{{album.date}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'albumlist',
        components: {

        },
        props: {
            albums: {
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

        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .album-list
        .item
            position: relative
            display: flex
            align-items: center
            box-sizing: border-box
            height: 60px
            border-bottom: 1px solid rgb(228, 228, 228)
            font-size: $font-size-medium
            .img
                float: left
                width: 50px
                height: 50px
                border-radius: 10%
            .content
                flex: 1
                line-height: 20px
                align-items: center
                overflow: hidden
                padding-left: 20px
                .name
                    margin-top: 4px
                    no-wrap()
                    color: $color-text
                .desc
                    no-wrap();
                    width: 80%
                    font-size: 12px
                    color: $color-text-g
</style>