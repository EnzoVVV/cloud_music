<template>
    <div v-if='content.length'>
        <ul>
            <li v-for='item in content' :key='item' class='item' @click='handleSelect(item)'>
                <div class='header'>
                    <span>{{item}}</span>
                    <div @click.stop='handleDelete(item)' class='clear'><IconSvg icon-class='delete'></IconSvg></div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'searchlist',
        components: {

        },
        props: {
            content: {
                type: Array,
                default: []
            }
        },
        data() {
            return {

            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            handleSelect(item) {
                this.$emit('select', item)
            },
            handleDelete(item) {
                this.$emit('delete', item)
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
        position: relative
        padding: 5px 10px
        display: flex
        align-items: center
        .clear
            position: absolute
            left: 90%
</style>