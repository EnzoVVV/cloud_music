<template>
    <div class='header'>
        <IconSvg icon-class='sortlight'></IconSvg>
        <tabs :content='content' class='header-tabs' refs='tabs' :defaultIndex='defaultIndex' @click='clickTab'></tabs>
        <IconSvg icon-class='search'></IconSvg>
    </div>
</template>
<script>
    import tabs from 'base/tabs/tabs'
    export default {
        name: 'Header',
        components: {
            tabs
        },
        props: {
            defaultIndex: {
                type: Number
            }
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
            clickTab(index) {
                this.$emit('clickTab',index)
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
        color: $color-text-i
    &-right
        width: 25px !important
        height: 25px !important 
        line-height: 44px
        margin-right: 30px 
</style>