<template>
    <div class='searchpanel'>
        <div class='searchpanel-header border line' @click='select(query)'>{{headerContent}}</div>
        <div v-for='(result, index) in results' :key='result' class='searchpanel-item line' :class='borderClass(index)' @click='select(result)'>
            <IconSvg icon-class='search-light' class='icon'></IconSvg>
            <span>{{result}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'suggest',
        components: {

        },
        props: {
            query: {
                type: String,
                default: Boolean
            }
        },
        data() {
            return {
                results: ['abc','ccc','xxxxx','fewfewaf','xgvrgfreaw','greafea']
            }
        },
        computed: {
            headerContent() {
                return `搜索${this.query}`
            }
        },
        watch: {
            query(val) {
                // 调服务
                // 最多取15条
            }
        },
        methods: {
            select(item) {
                this.$emit('select', item)
            },
            borderClass(index) {
                return index != this.results.length -1 ? 'border' : ''
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
    .searchpanel
        background-color: $color-background
        // 边缘阴影
        box-shadow: 0 0 20px rgba(0,0,0,0.3)
        &-header
            color: rgb(65,105,225)
            padding-left: 12.5px
        &-item
            color: $color-text-ii
            .icon
                margin: 12.5px
                width: 15px
                height: 15px
            .border
                border-bottom: 1px solid rgba(0,0,0,0.5)
            .line
                height: 40px
                display: flex
                align-items: center
</style>