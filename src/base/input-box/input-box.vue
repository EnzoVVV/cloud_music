<template>
    <div class='input-box'>
        <input class='input-box-input' ref='input' v-model='inputValue' :style='inputStyle' :placeholder='placeholder' @keyup.enter='handleEnter'></input>
        <div v-show='inputValue' @click='clear' class='input-box-clear'><IconSvg icon-class='delete-bright' size='20px'></IconSvg></div>
    </div>
</template>
<script>
    export default {
        name: 'inputbox',
        components: {

        },
        props: {
            value: {
                type: String,
                default: ''
            },
            inputStyle: {
                type: Object
            },
            placeholder: {
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
            inputValue(val) {
                this.handleInput()
            }
        },
        methods: {
            handleEnter() {
                this.handleInput()
                this.$emit('enter')
            },
            handleInput() {
                this.$emit('change', this.inputValue)
                this.$emit('input', this.inputValue)
            },
            focus() {
                this.$refs.input.focus()
            },
            clear() {
                this.inputValue = ''
                console.log('clear, inputValue is ',this.inputValue)
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
    .input-box
        position: relative
        width: 100%
        &-input
            background-color: $color-background
            height: 25px
            width: 100%
            border-bottom: 1px solid $color-light
        &-input:focus
            outline: none 
        &-input::placeholder
            color: $color-light
        &-clear
            position: absolute
            bottom: 3px
            right: 2%
</style>