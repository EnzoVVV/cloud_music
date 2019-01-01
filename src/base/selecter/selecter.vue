<template>
    <div class='selecter'>
        <div class='header'>
            <div class='selected'>{{selected}}</div>
            <div @click='toggle' class='icon'><IconSvg icon-class='down-arrow' size='18px'></IconSvg></div>
        </div>
        <transition-group name='lists' tag='ul' class='lists'>
            <li class='list' v-for='option in options' :key='option' v-show='!fold' @click='select(option)'>
                <div class='text'>{{option}}</div>
                <IconSvg icon-class='bingo' size='18px' class='icon' v-if='option === selected'></IconSvg>
            </li>
        </transition-group>
    </div>
</template>
<script>
    export default {
        name: 'selecter',
        components: {

        },
        props: {
            options: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                fold: true,
                selected: null
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            toggle() {
                this.fold = !this.fold
            },
            select(option) {
                this.selected = option
                this.fold = true
            }
        },
        created() {
            this.selected = this.options[0]
        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .selecter
        width: 100%
        position: relative
        .header
            height: 30px
            display: flex
            align-items: center
            padding: 0 10px
            background: $color-background
            .selected
                flex: 1
            .icon
                width: 20px
        .lists
            position: absolute 
            top: 30px
            z-index: 4000
            background: $color-background
            width: 100%
            box-shadow: 0 5px 20px rgba(0,0,0,0.3)
            .list
                height: 30px
                display: flex
                align-items: center
                padding: 0 10px
                &.lists-enter-active, &.lists-leave-active
                    transition: all 0.1s
                &.lists-enter, &.lists-leave-to
                    height: 0
                    opacity: 0
                .text
                    flex: 1
                .icon
                    width: 20px
</style>