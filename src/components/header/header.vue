<template>
    <div class='header'>
        <IconSvg icon-class='sortlight'></IconSvg>
        <Tabs :content='content' class='header-tabs'></Tabs>
        <IconSvg icon-class='search'></IconSvg>
    </div>
</template>
<script>

    import Tabs from 'base/tabs/tabs'
    export default {
        name: 'Header',
        components: {
            Tabs
        },
        props: {

        },
        data() {
            return {
                content: [
                    {
                        icon: 'yinle1',
                        to: '/mine'
                    },
                    {
                        icon: 'kefu',
                        to: '/music'
                    },
                    {
                        icon: 'yinlemoshi',
                        to: '/video'
                    }
                ]

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
.header
    display: flex
    padding: 10px 5px 0 5px
    background: $color-theme
    &-left
        width: 25px !important
        height: 25px !important
        float: left
        line-height: 44px
        margin-left: 30px
    &-tabs
        flex: 1
        float: left
    &-right
        width: 25px !important
        height: 25px !important 
        line-height: 44px
        margin-right: 30px 
</style>