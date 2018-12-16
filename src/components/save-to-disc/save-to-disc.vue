<template>
    <div>
        <modal :hideBtn='true' title='收藏到歌单' width='95%' @hide='hide'>
            <ul class='lists'>
                <li class='list' @click='showCreateDisc = true'>
                    <IconImg class='img' imgName='add'></IconImg>
                    <div class='text'>新建歌单</div>
                </li>
                <li class='list' v-for='list in discs' :key='list.name' @click='add(list)'>
                    <img class='img' v-lazy='list.picUrl'></img>
                    <div class='text'>
                        <p class='name'>{{list.name}}</p>
                        <p class='info'>{{clistInfo(list)}}></p>
                    </div>
                </li>
            </ul>
        </modal>
        <createdisc v-if='showCreateDisc' @hide='hideCreateDisc' @confirm='confirm' :song='song'></createdisc>
    </div>
</template>
<script>
    import modal from 'base/modal/modal'
    import createdisc from 'components/create-disc/create-disc'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'SaveToDisc',
        components: {
            modal,
            createdisc
        },
        props: {
            song: {
                type: Function
            }
        },
        data() {
            return {
                showCreateDisc: false
            }
        },
        computed: {
            ...mapGetters([
                'discs'
            ])
        },
        watch: {

        },
        methods: {
            clistInfo(list) {
                return `${list.count}首`
            },
            // 隐藏CreateDisc
            hideCreateDisc() {
                this.showCreateDisc = false
            },
            // CreateDisc点击确认，隐藏CreateDisc，再隐藏本组件
            confirm() {
                this.add(disc)
                this.hideCreateDisc()
                this.hide()
            },
            // 隐藏本组件
            hide() {
                this.$emit('hide')
            },
            add(disc) {
                this.addSongToDisc(this.song, disc)
            },
            ...mapActions([
                'addSongToDisc'
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
    .list
        margin-left: 5px
        height: 60px
        display: flex
        align-items: center
        position: relative
        .img
            width: 50px !important
            height: 50px !important
            border-radius: 5px
            overflow: hidden
        .text
            margin-left: 10px
            width: calc(100% - 100px)
            .name
                padding-bottom: 6px
                text-overflow: ellipsis 
                overflow: hidden
                white-space: nowrap
            .info
                color: $color-text-g
                font-size: $font-size-small
</style>