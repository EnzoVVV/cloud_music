<template>
    <div>
        <message v-if='messageFlag' :text='messageContent' ref='message'></message>
        <modal v-if='modalFlag' :title='modalInfo.title' :confirmBtnText='modalInfo.confirmBtnText' :cancelBtnText='modalInfo.cancelBtnText' @confirm='modalConfirm' @hide='modalFlag = false'></modal>
        <singerdetail v-if='singerDetailFlag' :showSingerDetail.sync='singerDetailFlag' :zIndex='singerDetailZIndex'></singerdetail>
        <rank v-if='rankFlag' @back='rankFlag = false'></rank>
        <DailyRecommend v-if='dailyFlag' @back='dailyFlag = false'></DailyRecommend>
        <discmanage v-if='discManageFlag' :type='discManageType' @hide='discManageFlag = false'></discmanage>
        <discdetail v-if='discDetailFlag' :discInfo='discInfo' @back='discDetailFlag = false'></discdetail>
        <albumdetail v-if='albumDetailFlag' :album='album' @back='albumDetailFlag=false'></albumdetail>
        <playlist v-if='flags.playlist' @back='flags.playlist = false'></playlist>
        <comment v-if='flags.comment' :type='comment.type' :subject='comment.subject' @back='flags.comment = false'></comment>
        <fm v-if='flags.FM'></fm>
        <collection v-if='flags.collection' @back='flags.collection = false'></collection>
        <songselect v-if='flags.songselect' :songs='songselect.songs' @back='flags.songselect = false'></songselect>
    </div>
</template>
<script>
    import message from 'base/message/message'
    import modal from 'base/modal/modal'
    import Vue from 'vue'
    import singerdetail from 'components/singer-detail/singer-detail'
    import rank from 'components/rank/rank'
    import DailyRecommend from 'components/daily-recommend/daily-recommend'
    import discmanage from 'components/disc-manage/disc-manage'
    import discdetail from 'components/disc-detail/disc-detail'
    const albumdetail = () => import('components/album-detail/album-detail')
    const playlist = () => import('components/play-list/play-list')
    const fm = () => import('components/fm/fm')
    const comment = () => import('components/comment/comment')
    const collection = () => import('components/collection/collection')
    const songselect = () => import('components/song-select/song-select')
    
import { mapMutations } from 'vuex';
    export default {
        name: 'hub',
        components: {
            message,
            modal,
            singerdetail,
            rank,
            DailyRecommend,
            discmanage,
            discdetail,
            albumdetail,
            playlist,
            fm,
            comment,
            collection,
            songselect
        },
        props: {

        },
        data() {
            return {
                singerDetailFlag: false,
                singerDetailZIndex: null,
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
                },
                flags: {
                    playlist: false,
                    FM: false,
                    comment: false,
                    collection: false,
                    songselect: false
                },
                comment: {
                    type: '',
                    subject: {}
                },
                songselect: {
                    songs: []
                }

            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            showSingerDetail(flag = true, zIndex) {
                this.singerDetailFlag = flag
                this.singerDetailZIndex = zIndex
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
            },
            showPlaylist() {
                this.flags.playlist = true
            },
            showFM(flag = true) {
                this.flags.FM = true
                // 记录FM是否开启状态到vuex
                this.setFMSwitch(flag)
            },
            showComment(type, subject) {
                Object.assign(this.comment, {
                    type: type,
                    subject: subject,
                })
                debugger
                this.flags.comment = true
            },
            showCollection() {
                this.flags.collection = true
            },
            showSongSelect(songs) {
                this.flags.songselect = true
                this.songselect.songs = songs
            },
            ...mapMutations({
                'setFMSwitch': 'SET_FM_SWITCH'
            }),
            showComponent() {
                let eventName = arguments[0]
                let payload = []
                for(let i=1;i<arguments.length;i++) {
                    payload.push(arguments[i])
                }
                let func = this.map[eventName]
                func.apply(this, payload)
            }
        },
        created() {
            this.map = {
                singerdetail: this.showSingerDetail,
                rank: this.showRank,
                FM: this.showFM,
                comment: this.showComment,
                collection: this.showCollection,
                playlist: this.showPlaylist,
                songselect: this.showSongSelect
            }
        },
        mounted() {
            this.$bus.on('showComponent', this.showComponent)
            this.$bus.on('showSingerDetail', this.showSingerDetail)
            this.$bus.on('showRank', this.showRank)
            this.$bus.on('showDailyRecommend', this.showDailyRecommend)
            this.$bus.on('showDiscManage', this.showDiscManage)
            this.$bus.on('showDiscDetail', this.showDiscDetail)
            this.$bus.on('unrevealed', this.showUnrevealedMessage)
            this.$bus.on('showMessage', this.showMessage)
            this.$bus.on('showAlbumDetail', this.showAlbumDetail)

            const self = this
            Vue.prototype.showComponent = function() {
                self.$bus.emit('showComponent', ...arguments)
            }
            Vue.prototype.$unrevealed = function() {
                self.$bus.emit('unrevealed')
            }
            Vue.prototype.back = function() {
                this.$emit('back')
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
        }
    }
</script>