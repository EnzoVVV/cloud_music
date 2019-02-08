<template>
    <div>
        <modal v-if='modalFlag' :title='modalInfo.title' :confirmBtnText='modalInfo.confirmBtnText' :cancelBtnText='modalInfo.cancelBtnText' @confirm='modalConfirm' @hide='modalFlag = false'></modal>
        <rank v-if='rankFlag' @back='rankFlag = false'></rank>
        <DailyRecommend v-if='dailyFlag' @back='dailyFlag = false'></DailyRecommend>
        <discmanage v-if='discManageFlag' :type='discManageType' @hide='discManageFlag = false'></discmanage>
        <playlist v-if='flags.playlist' @back='flags.playlist = false'></playlist>
        <fm v-if='flags.FM' ref='fm'></fm>
        <follow v-if='flags.follow' :title='follow.title'></follow>
    </div>
</template>
<script>
    const modal = () => import('base/modal/modal')
    const rank = () => import('components/rank/rank')
    const DailyRecommend = () => import('components/daily-recommend/daily-recommend')
    const discmanage = () => import('components/disc-manage/disc-manage')
    const playlist = () => import('components/play-list/play-list')
    const fm = () => import('components/fm/fm')
    const follow = () => import('components/homepage/sub/follow/follow')
    import Vue from 'vue'
    import builder from 'common/js/comp-builder'
    import { mapMutations } from 'vuex'

    export default {
        name: 'hub',
        components: {
            modal,
            rank,
            DailyRecommend,
            discmanage,
            playlist,
            fm,
            follow
        },
        props: {

        },
        data() {
            return {
                rankFlag: false,
                dailyFlag: false,
                discManageFlag: false,
                discManageType: 0,
                modalFlag: false,
                modalInfo: {
                    title: '',
                    confirmBtnText: '',
                    cancelBtnText: ''
                },
                flags: {
                    playlist: false,
                    FM: false,
                    follow: false
                },
                follow: {
                    title: 'TA的好友'
                }

            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            showSingerDetail() {
                builder('singerdetail')
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
                builder('discdetail', {
                    discInfo: discInfo
                })
            },
            showAlbumDetail(album) {
                builder('albumdetail', {
                    album: album
                })
            },
            showMessage(messageContent) {
                builder('message', {
                    text: messageContent
                }, false)
            },
            showPlaylist() {
                this.flags.playlist = true
            },
            showFM(flag = true) {
                if(this.flags.FM) {
                    // FM已开时, 再点击FM入口按钮，则全屏并播放
                    this.$refs.fm.show()
                } else {
                    // FM未开，则开启
                    this.flags.FM = flag
                    // 记录FM是否开启状态到vuex
                    this.setFMSwitch(flag)
                }
            },
            showComment(type, subject) {
                builder('comment', {
                    type: type,
                    subject: subject
                })
            },
            showCollection() {
                builder('collection')
            },
            showSongSelect(songs) {
                builder('songselect', {
                    songs: songs
                })
            },
            showHomepage(id, self = false) {
                builder('homepage', {
                    userId: id,
                    self: self
                })
            },
            showFollow(title) {
                this.flags.follow = true
                this.follow.title = title
            },
            showComponent() {
                let eventName = arguments[0]
                let payload = []
                for(let i=1;i<arguments.length;i++) {
                    payload.push(arguments[i])
                }
                let func = this.map[eventName]
                func.apply(this, payload)
            },
            showUnrevealedMessage() {
                this.showMessage('暂未开放此功能')
            },
            modalConfirm() {
                this.modalCallerInstance[this.modalCallerOnConfirm]()
            },
            ...mapMutations({
                'setFMSwitch': 'SET_FM_SWITCH'
            }),
        },
        created() {
            this.map = {
                singerdetail: this.showSingerDetail,
                rank: this.showRank,
                FM: this.showFM,
                comment: this.showComment,
                collection: this.showCollection,
                playlist: this.showPlaylist,
                songselect: this.showSongSelect,
                discdetail: this.showDiscDetail,
                homepage: this.showHomepage,
                follow: this.showFollow,
                dailyrecommend: this.showDailyRecommend,
                discmanage: this.showDiscManage,
                albumdetail: this.showAlbumDetail
            }
        },
        mounted() {
            const self = this
            Vue.prototype.showComponent = function() {
                self.showComponent(...arguments)
            }
            Vue.prototype.$unrevealed = function() {
                self.showUnrevealedMessage()
            }
            Vue.prototype.$message = function(content) {
                self.showMessage(content)
            }
            Vue.prototype.$modal = function(instance, content, onConfirm, onCancel) {
                Object.assign(self.modalInfo, content)
                self.modalFlag = true
                self.modalCallerInstance = instance
                self.modalCallerOnConfirm = onConfirm
                self.modalCallerOnCancel = onCancel
            }

            // 为了js文件中能emit事件, 添加vue-bus到全局
            window.$bus = this.$bus
        }
    }
</script>