<template>
    <div>
        <singerdetail v-if='singerDetailFlag' :showSingerDetail.sync='singerDetailFlag'></singerdetail>
        <rank v-if='rankFlag' @back='rankFlag = false' @select='selectRank'></rank>
        <DailyRecommend v-if='dailyFlag' @back='dailyFlag = false'></DailyRecommend>
        <discmanage v-if='discManageFlag' :type='discManageType' @hide='discManageFlag = false'></discmanage>
        <discdetail v-if='discDetailFlag' :disc='disc' @back='discDetailFlag = false'></discdetail>
    </div>
</template>
<script>
    import rank from 'components/rank/rank'
    import DailyRecommend from 'components/daily-recommend/daily-recommend'
    import discmanage from 'components/disc-manage/disc-manage'
    import discdetail from 'components/disc-detail/disc-detail'
    export default {
        name: 'hub',
        components: {
            rank,
            DailyRecommend,
            discmanage,
            discdetail
        },
        props: {

        },
        data() {
            return {
                singerDetailFlag: false,
                rankFlag: false,
                dailyFlag: false,
                discManageFlag: false,
                discManageType: 0,
                discDetailFlag: false,
                disc: null

            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            showSingerDetail() {
                this.singerDetailFlag = true
            },
            showRank() {
                this.rankFlag = true
            },
            showDailyRecommend() {
                this.dailyFlag = true
            },
            showDiscManage(rankinfo) {
                this.discManageFlag = true
                this.rankinfo = rankinfo
            },
            showDiscDetail(disc) {
                this.discDetailFlag = true
                this.disc = disc
            }
        },
        created() {

        },
        mounted() {
            this.$bus.on('showSingerDetail', this.showSingerDetail)
            this.$bus.on('showRank', this.showRank)
            this.$bus.on('showDailyRecommend', this.showDailyRecommend)
            this.$bus.on('showDiscManage', this.showDiscManage)
            this.$bus.on('showDiscDetail', this.showDiscDetail)
        }
    }
</script>