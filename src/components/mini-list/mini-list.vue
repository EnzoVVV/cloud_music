<template>
    <div class='mini-list'>
        <div class='empty'>
        </div>
        <div class='header'>
        </div>
        <scroll class='scroll'>
            <div class='list'>
                <ul>
                    <li v-for='(item,index) in list' :key='item.id || index' class='item'>
                        {{item.name || index}}
                    </li>
                </ul>
            </div>
        </scroll>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    export default {
        name: 'minilist',
        components: {
            scroll
        },
        props: {
            list: {
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
    .mini-list
        position: fixed
        top: 0
        bottom: 0
        left: 0
        right: 0
        z-index: 3000
        .empty
            position: fixed
            top: 0
            left: 0
            right: 0
            height: 400px
            background: $color-background
        .scroll
            position: relative
            height: 100%
            width: 100%
            background: $color-background
            overflow: hidden
            .list
                width: 100%
                .item
                    height: 40px
                    line-height: 40px
</style>