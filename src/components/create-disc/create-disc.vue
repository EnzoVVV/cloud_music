<template>
    <modal title='新建歌单' confirmBtnText='提交' @confirm='confirm' @cancel='cancel' v-if='modalFlag'>
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
                this.createDisc(this.discName)
            },
            cancel() {
                this.modalFlag = false
            },
            ...mapActions([
                'createDisc'
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