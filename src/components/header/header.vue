<template>
    <div class='header'>
        <IconSvg icon-class='sortlight'></IconSvg>
        <Tabs :content='content' class='header-tabs'></Tabs>
        <IconSvg icon-class='search'></IconSvg>
    </div>
</template>
<script>

    import Tabs from 'components/tabs/tabs'
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
                        icon: 'yinfu',
                        to: 'recommend'
                    },
                    {
                        icon: 'music',
                        to: 'friend'
                    },
                    {
                        icon: 'bofang',
                        to: 'radio'
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
.header
    display: flex
    padding-top: 10px
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