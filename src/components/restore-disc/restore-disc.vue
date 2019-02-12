<template>
    <div class='restore'>
        <div class='header'>
            <div @click='back' class='back'><IconSvg icon-class='back'></IconSvg></div>
            <span class='title'>恢复歌单</span>
        </div>
        <scroll ref='scroll' class='scroll'>
            <ul v-if='discs.length'>
                <li v-for='disc in discs' :key='disc.id' :ref='disc.id'>
                    <liner :picUrl='disc.picUrl' :main='disc.name' :sub='disc.singer' :showCheck='true' :itemId='disc.id' :circleCheck='true' @check='check'></liner>
                </li>
            </ul>
            <div class='empty'>暂无可恢复歌单</div>
        </scroll>
        <div class='bottom'>
            <div @click='restore'>
                <IconSvg icon-class='restore' size='30px'></IconSvg>
                <div class='text'>恢复</div>
            </div>
        </div>
    </div>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    import liner from 'base/liner/liner'
    import { mapGetters, mapActions } from 'vuex'
    import { deepCopy } from 'common/js/tools'
    export default {
        name: 'restoredisc',
        components: {
            scroll,
            liner
        },
        props: {

        },
        data() {
            return {
                discs: []
            }
        },
        computed: {
            ...mapGetters([
                'discardDiscs'
            ])
        },
        watch: {

        },
        methods: {
            // 记录勾选项
            check(id, status) {
                if(status) {
                    if(!this.checkList.find(i => i === id)) {
                        this.checkList.push(id)
                    }
                } else {
                    this.checkList = this.checkList.filter(i => i !== id)
                }
            },
            restore() {
                this.checkList.forEach(id => {
                    let disc = this.discardDiscs.find(i => i.id === id)
                    this.addDisc(disc)
                    this.desertDiscardDisc(disc)
                    let index = this.discs.findIndex(i => i.id === id)
                    this.discs.splice(index, 1)
                })
                this.checkList = []
            },
            back() {
                this.$emit('back')
            },
            ...mapActions([
                'restoreDiscardDiscs',
                'desertDiscardDisc',
                'addDisc'
            ])
        },
        created() {
            this.checkList = []
            this.restoreDiscardDiscs()
            this.discs = deepCopy(this.discardDiscs)
        },
        mounted() {
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .restore
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 7000
        background: $color-background
        .header
            position: absolute
            top: 0
            height: 44px
            width: 100%
            display: flex
            align-items: center
            background: $color-theme
            color: $color-text-a
            z-index: 1
            .back
                margin: 0 10px
            .title
                color: $color-text-a
                flex: 1
        .scroll
            position: absolute
            left: 0
            top: 44px
            right: 0
            bottom: 60px
            .empty
                margin: 30px
                color: $color-text-ii
                text-align: center
        .bottom
            position: absolute
            bottom: 0
            height: 60px
            width: 100%
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            background: $color-background
            border-top: 1px solid $color-light
            .text
                padding-top: 2px
                color: $color-text-ii
</style>