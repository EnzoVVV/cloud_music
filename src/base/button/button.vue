<template>
    <div class='button' :style='computedStyle' @click='handleClick'>
        <IconSvg :icon-class='icon' :size='iconSize'></IconSvg>
        <span class='text'>{{text}}</span>
    </div>
</template>
<script>
    export default {
        name: 'ibutton',
        components: {

        },
        props: {
            icon: {
                type: String,
                default: ''
            },
            text: {
                type: String,
                default: ''
            },
            red: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'normal',
                validator: (value) => {
                    return ['small', 'normal', 'large'].indexOf(value) !== -1
                }
            }
        },
        data() {
            return {

            }
        },
        computed: {
            computedStyle() {
                let result = {}
                if(this.red) {
                    Object.assign(result, {
                        'background-color': 'rgb(212, 68, 57)'
                    })
                } else {
                    Object.assign(result, {
                        border: '1px solid rgb(255,255,255)'
                    })
                }
                if(this.size === 'normal') {
                    Object.assign(result, {
                        height: '30px',
                        minWidth: '90px'
                    })
                } else if(this.size === 'small') {
                    Object.assign(result, {
                        height: '20px',
                        minWidth: '60px'
                    })
                }
                return result
            },
            iconSize() {
                let size = '18px'
                if(this.size === 'small') {
                    size = '12px'
                }
                return size
            }
        },
        watch: {

        },
        methods: {
            handleClick() {
                this.$emit('click')
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
    .button
        display: inline-block
        border-radius: 20px
        color: $color-text-a
        font-size: $font-size-small
        display: flex
        align-items: center
        justify-content: center
        .text
            padding: 0 3px
</style>