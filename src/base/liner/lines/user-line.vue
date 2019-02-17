<template>
    <liner class='line' :picUrl='user.picUrl' :main='user.name' :sub='user.signature' :showImg='true' :circleImg='true' :selectable='true' @select='select'>
        <div slot='button' class='line-button' :class='buttonClass' @click.stop='toggleFollow'>
            <IconImg :imgName='icon' size='12px'></IconImg>
            <span class='text'>{{text}}</span>
        </div>
    </liner>
</template>
<script>
    import { followUser } from 'api/user'
    import liner from 'base/liner/liner'
    export default {
        name: 'userline',
        components: {
            liner
        },
        props: {
            user: {
                type: Object
            }
        },
        data() {
            return {
                followed: this.user.followed
            }
        },
        computed: {
            buttonClass(user) {
                return this.followed ? 'line-button-light' : ''
            },
            icon(user) {
                return this.followed ? 'bingo-light' : 'add-red'
            },
            text(user) {
                return this.followed ? '已关注' : '关注'
            }
        },
        watch: {

        },
        methods: {
            toggleFollow() {
                this.followed = !this.followed
                followUser(this.user.id, this.followed)
                const text = this.followed ? '已关注' : '已取消关注'
                this.$message(text)
            },
            select() {
                this.showComponent('homepage', this.user.id)
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .line
        height: 60px
        display: flex
        align-items: center
        padding-left: 5px
        &-button
            display: inline-block
            border-radius: 20px
            color: $color-text-a
            font-size: $font-size-small
            display: flex
            align-items: center
            justify-content: center
            height: 25px
            min-width: 60px
            border: 1px solid $color-theme
            margin-right: 10px
            .text
                padding: 0 3px
                color: $color-theme
        &-button-light
            border: 1px solid $color-text-ii !important
            .text
                color: $color-text-ii !important
</style>