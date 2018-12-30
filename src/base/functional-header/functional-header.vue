<template>
    <div class='header custom-header'>
        <div @click='goback' class='header-back' ref='back'><IconSvg icon-class='back'></IconSvg></div>
        <div v-show='!searchFlag' class='header-wrapper'>
            <div class='title' v-if='!longTitle'>{{title}}</div>
            <roller class='title' v-else :content='title'></roller>
            <div @click='search' ref='search' class='search' v-if='showSearch'><IconSvg icon-class='search'></IconSvg></div>
        </div>
        <inputbox v-if='searchFlag' v-model='query' class='header-search-bar' :inputStyle='searchbarStyle' :placeholder='sbph'></inputbox>
    </div>
</template>
<script>
    import roller from 'base/roller/roller'
    import inputbox from 'base/input-box/input-box'
    export default {
        name: 'FunctionalHeader',
        components: {
            roller,
            inputbox
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            // 是否滚动标题
            rollingTitle: {
                type: Boolean,
                default: false
            },
            // 是否显示搜索
            showSearch: {
                type: Boolean,
                default: false
            },
            // 搜索框的placeholder
            sbph: {
                type: String,
                default: ''
            },
            searchbarStyle: {
                type: Object,
                default: () => {
                    return {
                        background: 'none',
                        color: 'rgb(228, 228, 228)'
                    }
                }
            }
        },
        data() {
            return {
                longTitle: false,
                searchFlag: false,
                query: ''
            }
        },
        computed: {

        },
        watch: {
            title(val) {
                if(this.rollingTitle) {
                    const width = this.title.length * 14
                    const maxWidth = this.$el.offsetWidth * 0.65
                    if(width > maxWidth) {
                        this.longTitle = true
                        return
                    }
                }
                this.longTitle = false
            },
            query(val) {
                this.$emit('search', true, val)
            }
        },
        methods: {
            goback() {
                if(this.searchFlag) {
                    // 搜索时点击返回, 则隐藏搜索
                    this.searchFlag = false
                    this.$emit('search', false, '')
                } else {
                    this.$emit('back')
                }
            },
            search() {
                // 第一个参数flag是是否在搜索, 第二个参数是搜索内容
                this.$emit('search', true, '')
                this.searchFlag = true
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
        height: 44px
        width: 100%
        display: flex
        align-items: center
        background: $color-theme
        &-back
            margin-left: 10px
            float: left 
        &-wrapper
            width: 100%
            float: left 
            display: flex
            align-items: center
            .title
                // 加个important防止被roller里的宽度设置覆盖, 此处必须固定宽度
                width: calc(100% - 80px) !important 
                margin-left: 15px
                color: $color-text-a
            .search
                margin-left: 10px
        &-search-bar
            margin: 0 15px
</style>