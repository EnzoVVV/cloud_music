<template>
    <div>
        <scroll class='scroll' ref='scroll' v-if='follows.length'>
            <ul>
                <li v-for='follow in follows' :key='follow.id' @click='showHomepage(follow.id)'>
                    <liner :picUrl='follow.picUrl' :main='follow.name' :sub='follow.signature' :showImg='true' :circleImg='true'></liner>
                </li>
            </ul>
        </scroll>
        <p v-else class='empty'>暂无内容</p>
    </div>
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
                getUserFollowing(this.homepage.id, 1).then(res => {
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
    .empty
        margin-top: 100px
        text-align: center
        color: $color-text-ii
</style>