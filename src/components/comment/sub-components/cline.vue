<template>
    <div>
        <liner :hasBorder='false' :circleImg='true' :light='true' :picUrl='info.user.picUrl' :main='info.user.name' :sub='info.time' height='40px'></liner>
        <div class='content'>
            <div class='comment'>{{content}}</div>
            <div class='reply' v-if='info.reply'>
                <span class='author'>{{info.reply.user.name}}: </span>
                <span>{{info.reply.content}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import liner from 'base/liner/liner'
    export default {
        name: 'cline',
        components: {
            liner
        },
        props: {
            content: {
                type: String,
                default: ''
            },
            info: {
                type: Object,
                default: () => {}
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

        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .content
        margin-left: 45px
        padding: 10px 0
        display: flex
        flex-direction: column
        border-bottom: 1px solid $color-light
        .reply
            width: 85%
            padding: 10px
            margin-top: 10px
            border: 1px solid $color-light
            border-radius: 3px
            .author
                color: $color-text-h
</style>