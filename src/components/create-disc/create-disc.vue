<template>
    <!-- input框没输入时禁用确认按钮 -->
    <modal v-if='modalFlag' title='新建歌单' confirmBtnText='提交' @confirm='confirm' @cancel='cancel' :disableConfirm='discName.length === 0'>
        <inputbox class='inputbox' v-model='discName'></inputbox>
    </modal>
</template>
<script>
    import modal from 'base/modal/modal'
    import { mapActions } from 'vuex'
    import inputbox from 'base/input-box/input-box'
    export default {
        name: 'createdisc',
        components: {
            modal,
            inputbox
        },
        props: {
            // song有值时确认，创建歌单并添加歌曲, 否则仅创建歌单
            song: {
                // class类型是Function
                type: Function
            }
        },
        data() {
            return {
                discName: '',
                modalFlag: true
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            confirm() {
                this.modalFlag = false
                if(this.song && this.song.id !== undefined && this.song.id !== null) {
                    // 创建歌单并添加歌曲
                    this.createDiscAndAddSong({
                        song: this.song, 
                        discName: this.discName
                    })
                    this.$message('已收藏')
                } else {
                    // 仅收藏
                    this.createDisc(this.discName)
                    this.$message('歌单已创建')
                }
                this.$emit('confirm')
                this.hide()
            },
            cancel() {
                this.modalFlag = false
            },
            hide() {
                // 确定/取消后， 要一直上传到hub将flag置为false，不然discManage只能弹出一次
                this.$emit('hide')
            },
            ...mapActions([
                'createDisc',
                'createDiscAndAddSong'
            ])
        },
        created() {

        },
        mounted() {

        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .inputbox
        margin-left: 15px
        width: calc(100% - 30px)
</style>