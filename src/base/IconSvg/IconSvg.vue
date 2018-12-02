<template>
    <svg class='svg-icon' aria-hidden='true' :style='computedStyle'>
        <use :xlink:href='iconName'></use>
    </svg>
</template>

<script>
export default {
    name: 'icon-svg',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: '25px'
        }
    },
    computed: {
        iconName() {
            return `#icon-${this.iconClass}`
        },
        computedStyle() {
            return {
                width: this.size,
                height: this.size
            }
        }
    }
}
</script>

<style lang='stylus' scoped>
.svg-icon
    width: 25px
    height: 25px
    vertical-align: -0.15em
    fill: currentColor
    overflow: hidden
</style>