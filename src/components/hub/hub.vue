<template>
    <div>
        <singerdetail v-if='singerDetailFlag' :showSingerDetail.sync='singerDetailFlag' :zIndex='singerDetailZIndex'></singerdetail>
        <rank v-if='rankFlag' @back='rankFlag = false'></rank>
        <DailyRecommend v-if='dailyFlag' @back='dailyFlag = false'></DailyRecommend>
        <discmanage v-if='discManageFlag' :type='discManageType' @hide='discManageFlag = false'></discmanage>
        <discdetail v-if='discDetailFlag' :discInfo='discInfo' @back='discDetailFlag = false'></discdetail>
        <albumdetail v-if='albumDetailFlag' :album='album' @back='albumDetailFlag=false'></albumdetail>
        <message v-if='messageFlag' :text='messageContent' ref='message'></message>
        <modal v-if='modalFlag' :title='modalInfo.title' :confirmBtnText='modalInfo.confirmBtnText' :cancelBtnText='modalInfo.cancelBtnText' @confirm='modalConfirm' @hide='modalFlag = false'></modal>
    </div>
</template>
<script>
    import singerdetail from 'components/singer-detail/singer-detail'
    import rank from 'components/rank/rank'
    import DailyRecommend from 'components/daily-recommend/daily-recommend'
    import discmanage from 'components/disc-manage/disc-manage'
    import discdetail from 'components/disc-detail/disc-detail'
    const albumdetail = () => import('components/album-detail/album-detail') 
    import message from 'base/message/message'
    import modal from 'base/modal/modal'
    import Vue from 'vue'
    export default {
        name: 'hub',
        components: {
            singerdetail,
            rank,
            DailyRecommend,
            discmanage,
            discdetail,
            albumdetail,
            message,
            modal
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
                discInfo: null,
                albumDetailFlag: false,
                album: null,
                messageFlag: false,
                messageContent: '',
                modalFlag: false,
                modalInfo: {
                    title: '',
                    confirmBtnText: '',
                    cancelBtnText: ''
                }

            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            showSingerDetail(flag = true) {
                this.singerDetailFlag = flag
            },
            showRank() {
                this.rankFlag = true
            },
            showDailyRecommend() {
                this.dailyFlag = true
            },
            showDiscManage(type) {
                this.discManageFlag = true
                this.discManageType = type
            },
            showDiscDetail(discInfo) {
                this.discDetailFlag = true
                this.discInfo = discInfo
            },
            showAlbumDetail(album) {
                this.albumDetailFlag = true
                this.album = album
            },
            showMessage(messageContent) {
                this.messageContent = messageContent
                if(this.messageFlag) {
                    this.$refs.message.show()
                } else {
                    this.messageFlag = true
                    this.$nextTick(() => {
                        this.$refs.message.show()
                    })
                }
            },
            showUnrevealedMessage() {
                this.showMessage('暂未开放此功能')
            },
            modalConfirm() {
                this.modalCallerInstance[this.modalCallerOnConfirm]()
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
            this.$bus.on('unrevealed', this.showUnrevealedMessage)
            this.$bus.on('showMessage', this.showMessage)
            this.$bus.on('showAlbumDetail', this.showAlbumDetail)

            const self = this
            Vue.prototype.$unrevealed = function() {
                self.$bus.emit('unrevealed')
            }
            Vue.prototype.$message = function(content) {
                self.$bus.emit('showMessage', content)
            }
            Vue.prototype.$modal = function(instance, content, onConfirm, onCancel) {
                Object.assign(self.modalInfo, content)
                self.modalFlag = true
                self.modalCallerInstance = instance
                self.modalCallerOnConfirm = onConfirm
                self.modalCallerOnCancel = onCancel
            }
            Vue.prototype.back = function() {
                this.$emit('back')
            }
        }
    }
</script>