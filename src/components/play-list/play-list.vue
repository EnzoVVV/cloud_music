<template>
    <detailboard headerTitle='歌单' :cover='cover' :cusList='true' :cusInfo='true' :showSearch='false' :showFunc='false' @back='goback' class='playlist'>
        <div slot='info'>
            <img class='img' :src='cover'/>
            <div class='title'>推荐歌单</div>
        </div>
        <div slot='list'>
            <discList :discList='discLists' v-if='discLists.length'></discList>
        </div>
    </detailboard>
</template>
<script>
    import detailboard from 'components/detail-board/detail-board'
    import discList from 'components/discList/discList'
    import { getRecommendList } from 'api/recommend'
    export default {
        name: 'playlist',
        components: {
            detailboard,
            discList
        },
        data() {
            return {
                discLists: [],
                cover: '',
            }
        },
        methods: {
            getLists() {
                getRecommendList().then(res => {
                    this.discLists = res
                    this.cover = res[0].picUrl
                })
            },
            goback() {
                this.$emit('back')
            }
        },
        created() {
            this.getLists()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .playlist
        z-index: 3800 !important
        .img
            width: 100px
            height: 100px
            overflow: hidden
            position: absolute 
            left: 20px
            top: 60px
            border-radius: 5px
        .title
            position: absolute 
            left: 140px
            top: 70px
            color: $color-text-a
</style>