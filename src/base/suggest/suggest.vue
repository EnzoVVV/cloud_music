<template>
    <div class='searchpanel'>
        <div class='searchpanel-header border line' @click='select(query)'>{{headerContent}}</div>
        <div v-for='(result, index) in results' :key='index' class='searchpanel-item line' :class='borderClass(index)' @click='select(result)'>
            <IconSvg icon-class='search-light' class='icon'></IconSvg>
            <div class='text'>{{result}}</div>
        </div>
    </div>
</template>
<script>
    import { suggest } from 'api/search'
    export default {
        name: 'suggest',
        components: {

        },
        props: {
            query: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                results: []
            }
        },
        computed: {
            headerContent() {
                return `搜索"${this.query}"`
            }
        },
        watch: {
            query(val) {
                this.getSuggest()
            }
        },
        methods: {
            getSuggest() {
                if(!this.query || this.query.length === 0) {
                    this.results = []
                    return
                }
                suggest(this.query).then(res => {
                    this.results = res
                })
            },
            select(item) {
                this.$emit('select', item)
            },
            borderClass(index) {
                return index != this.results.length -1 ? 'border' : ''
            }
        },
        created() {
            this.getSuggest()
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
            height: 30px
            line-height: 30px
            padding: 5px 12px
            border-bottom: 1px solid rgba(0,0,0,0.05)
        &-item
            color: $color-text-ii
            height: 30px
            display: flex
            align-items: center
            padding: 5px 12px
            border-bottom: 1px solid rgba(0,0,0,0.05)
            .icon
                width: 15px
                height: 15px
            .text
                margin-left: 12px
                text-overflow: ellipsis 
                overflow: hidden
                white-space: nowrap
</style>