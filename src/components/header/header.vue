<template>
<div>
    <div class='header'>
        <div @click='toggleLeftMenu'><IconSvg icon-class='sortlight'></IconSvg></div>
        <div class='empty'></div>
        <tabs :content='content' class='header-tabs' ref='tabs' :defaultIndex='defaultIndex' @click='clickTab'></tabs>
        <div class='empty'></div>
        <div @click='popupSearch'><IconSvg icon-class='search'></IconSvg></div>
    </div>
    <search v-if='showSearchFlag' v-show='showSearch' :showSearch.sync='showSearch'></search>
    <leftmenu v-if='showLeftMenu' @hide='hideLeftMenu'></leftmenu>
</div>
</template>
<script>
    import tabs from 'base/tabs/tabs'
    const search = () => import('components/search/search')
    const leftmenu = () => import('components/left-menu/left-menu')
    export default {
        name: 'Header',
        components: {
            tabs,
            search,
            leftmenu
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
                        img: 'mine'
                    },
                    {
                        img: 'music'
                    },
                    {
                        icon: 'video'
                    }
                ],
                showSearch: false,
                showSearchFlag: false,
                showLeftMenu: false
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            clickTab(index) {
                this.$emit('clickTab',index)
            },
            popupSearch() {
                this.showSearchFlag = true
                this.$nextTick(() => {
                    this.showSearch = true
                })
            },
            toggleLeftMenu() {
                this.showLeftMenu = true
            },
            hideLeftMenu() {
                this.showLeftMenu = false
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
    align-items: center
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
    .empty
        width: 25%
</style>