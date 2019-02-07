<template>
    <div class='user'>
        <scroll class='list' ref='scroll'>
            <div>
                <div v-if='users.length'>
                    <userline v-for='user in users' :key='user.id' :user='user'></userline>
                </div>
                <loading v-else class='loading'></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
    import { searchUser } from 'api/search'
    import { resultMixin, playlistMixin } from 'common/js/mixins'
    import userline from 'base/liner/lines/user-line'
    export default {
        name: 'searchUser',
        mixins: [resultMixin, playlistMixin],
        components: {
            userline
        },
        props: {
        },
        data() {
            return {
                users: []
            }
        },
        computed: {
            
        },
        watch: {

        },
        methods: {
            searchUsers() {
                if(this.query === undefined || this.query === null || this.query === '') {
                    return
                }
                searchUser(this.query).then(res => {
                    this.users = res
                })
            }
        },
        created() {
            this.searchUsers()
        },
        mounted() {
            this.$bus.on('research', this.searchUsers)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .user
        width: 100%
        height: 100%
        overflow: hidden
        .list
            position: absolute
            left: 0
            top: 0
            right: 0
            bottom: 60px
            .loading
                position: fixed
                top: 50%
</style>