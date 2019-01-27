<template>
    <scroll class='scroll' ref='scroll'>
        <ul>
            <li v-for='follow in follows' :key='follow.id'>
                <liner :picUrl='follow.picUrl' :main='follow.name' :sub='follow.signature' :showImg='true' :circleImg='true' :selectable='true'></liner>
            </li>
        </ul>
    </scroll>
</template>
<script>
    import { playlistMixin, homepageMixin, followMixin } from 'common/js/mixins'
    import { getUserFollowing } from 'api/user'
    export default {
        name: 'following',
        mixins: [ playlistMixin, homepageMixin, followMixin ],
        components: {

        },
        props: {

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
            getFollows() {
                getUserFollowing(this.homepage.id).then(res => {
                    this.follows = res
                })
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
    .scroll
        position: absolute
        left: 0
        top: 0
        right: 0
        bottom: 0
</style>