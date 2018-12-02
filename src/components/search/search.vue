<template>
    <div>
        <transition name='search'>
            <div class='search' v-show='showSearch'>
                <div class='header'>
                    <div @click='goback'><IconSvg class='back' icon-class='back'></IconSvg></div>
                    <inputbox v-model='inputValue' ref='searchbar' :inputStyle='searchbarStyle'></inputbox>
                </div>
                <result v-if='showResult' class='result'></result>
                <suggest v-if='inputValue' v-show='showSuggest' :query='inputValue' @select='search' class='suggest'></suggest>
                <div class='recommend'>
                    <div class='title'>热门搜索</div>
                    <div class='items'>
                        <div v-for='item in mockRecommend' :key='item' class='item' @click='search(item)'>
                            <div class='container'>{{item}}</div>
                        </div>
                    </div>
                </div>
                <div v-if='searchHistory.length'>
                    <div class='history-header'>
                        <span class='title'>搜索历史</span>
                        <div @click='showConfirm' class='clear'><IconSvg class='back' icon-class='clear'></IconSvg></div>
                    </div>
                    <searchlist :conten='searchHistory' @select='search' @delete='deleteSearchHistory'></searchlist>
                </div>
                <confirm text='是否清空搜索历史' confirmBtnText='清空' @confirm='clearSearchHistory' ref='confirm'></confirm>
            </div>
        </transition>
    </div>
</template>
<script>
    import result from './result'
    import inputbox from 'base/input-box/input-box'
    import suggest from 'base/suggest/suggest'
    import searchlist from 'base/search-list/search-list'
    import confirm from 'base/confirm/confirm'
    import { mapMutations, mapGetters, mapActions } from 'vuex'
    export default {
        name: 'search',
        components: {
            result,
            inputbox,
            suggest,
            searchlist,
            confirm
        },
        props: {
            showSearch: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                inputValue: '',
                mockRecommend: [
                    'abc','ccc','xxxxx','fewfewaf','xgvrgfreaw','greafea'
                ],
                showResult: false,
                showSuggest: true,
                searchbarStyle: {
                    color: 'rgb(228, 228, 228)',
                    background: 'rgb(212, 68, 57)'
                }
            }
        },
        computed: {
            ...mapGetters([
                'searchHistory'
            ])
        },
        watch: {
            showSearch(val) {
                if(val) {
                    this.$nextTick(() => {
                        this.focus()
                    })
                }
            },
            inputValue(val) {
                this.showSuggest = true
            }
        },
        methods: {
            ...mapMutations({
                setQuery: 'SET_QUERY'
            }),
            ...mapActions([
                'saveSearchHistory',
                'deleteSearchHistory',
                'clearSearchHistory',
                'restoreSearchHistory'
            ]),
            search(item) {
                this.inputValue = item
                this.setQuery(this.inputValue)
                this.showResult = true
                this.$nextTick(() => {
                    this.showSuggest = false
                })
                // 保存搜索历史
                this.saveSearchHistory()
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            focus() {
                this.$refs.searchbar.focus()
            },
            goback() {
                // 关闭时清空inputValue, 不显示result页
                this.inputValue = ''
                this.showResult = false
                this.$emit('update:showSearch', false)
            }
        },
        created() {
            // 从localstorage里恢复缓存的历史搜搜记录
            this.restoreSearchHistory()
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .search-enter-active, .search-leave-active
        transition: all 0.3s
    .search-enter, .search-leave-to
        transform: translate3d(0, 100%, 0)
    .search
        position: fixed
        top: 0
        bottom: 0
        left: 0
        right: 0
        background-color: $color-background
        z-index: 1000
        .header
            width: 100%
            height: 44px
            background-color: $color-theme
            display: flex
            align-items: center
            .back
                float: left
                margin: 0 10px
        .suggest
            position: absolute
            top: 44px
            left: 5%
            right: 5%
            z-index: 1200
        .recommend
            width: 100%
            margin: 20px 20px
            .title
                color: $color-text-g
                margin-bottom: 10px
                font-weight: bold
            .items
                margin-right: 10px
                .item
                    display: inline-block
                    .container
                        display: inline-block
                        border: 1px solid rgba(0,0,0,0.2)
                        border-radius: 20px
                        padding: 6px 12px
                        margin-bottom: 10px
                        margin-right: 10px
                        font-size: 15px
        .history-header
            position: relative
            padding: 5px 10px
            display: flex
            align-items: center
            .title
                font-weight: bold
                color: $color-text-g
            .clear
                position: absolute
                left: 90%
</style>