<template>
    <div>
        <modal v-if='modalFlag' :title='modalInfo.title' :confirmBtnText='modalInfo.confirmBtnText' :cancelBtnText='modalInfo.cancelBtnText' @confirm='modalConfirm' @hide='modalFlag = false'></modal>
        <rank v-if='rankFlag' @back='rankFlag = false'></rank>
        <DailyRecommend v-if='dailyFlag' @back='dailyFlag = false'></DailyRecommend>
        <discmanage v-if='discManageFlag' :type='discManageType' @hide='discManageFlag = false'></discmanage>
        <playlist v-if='flags.playlist' @back='flags.playlist = false'></playlist>
        <fm v-if='flags.FM'></fm>
        <collection v-if='flags.collection' @back='flags.collection = false'></collection>
        <songselect v-if='flags.songselect' :songs='songselect.songs' @back='flags.songselect = false'></songselect>
        <follow v-if='flags.follow' :title='follow.title'></follow>
    </div>
</template>
<script>
    import Vue from 'vue'
    import modal from 'base/modal/modal'
    import rank from 'components/rank/rank'
    import DailyRecommend from 'components/daily-recommend/daily-recommend'
    import discmanage from 'components/disc-manage/disc-manage'
    const playlist = () => import('components/play-list/play-list')
    const fm = () => import('components/fm/fm')
    const collection = () => import('components/collection/collection')
    const songselect = () => import('components/song-select/song-select')
    const follow = () => import('components/homepage/sub/follow/follow')

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
            collection,
            songselect,
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
                    collection: false,
                    songselect: false,
                    follow: false
                },
                songselect: {
                    songs: []
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
                this.flags.FM = flag
                // 记录FM是否开启状态到vuex
                this.setFMSwitch(flag)
            },
            showComment(type, subject) {
                builder('comment', {
                    type: type,
                    subject: subject
                })
            },
            showCollection() {
                this.flags.collection = true
            },
            showSongSelect(songs) {
                this.flags.songselect = true
                this.songselect.songs = songs
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
                follow: this.showFollow
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

            // 为了js文件中能emit事件, 添加一个轻量bus到全局
            new Vue({
                render() {
                    return ''
                },
                mounted() {
                    window.hub = this
                }
            }).$mount()
        }
    }
</script>