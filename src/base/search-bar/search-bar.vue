<template>
    <div class='searchbar'>
        <input class='input' ref='input' v-model='inputValue'></input>
        <div v-show='inputValue' @click='clear'><IconSvg class='clear' icon-class='back'></IconSvg></div>
    </div>
</template>
<script>
    export default {
        name: 'searchbar',
        components: {

        },
        props: {
            value: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                inputValue: this.value
            }
        },
        computed: {

        },
        watch: {
            value(val) {
                this.inputValue = val
            },
            inputValue() {
                this.handleInput()
            }
        },
        methods: {
            handleInput() {
                this.$emit('change', this.inputValue)
                this.$emit('input', this.inputValue)
            },
            focus() {
                this.$refs.input.focus()
            },
            clear() {
                this.inputValue = ''
                this.focus()
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
    .searchbar
        width: 100%
        .input
            position: relative
            background-color: $color-theme
            height: 25px
            width: calc(100% - 25px)
            margin-right: 10px
            color: $color-text-d
            border-bottom: 1px solid $color-text-d
        // 设置input框focus时的样式
        .input:focus
            outline: none
        .clear
            position: absolute 
            top: 10px
            right: 25px
</style>