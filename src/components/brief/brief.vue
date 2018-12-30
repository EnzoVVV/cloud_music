<template>
    <scroll class='brief'>
        <div class='title'>简介</div>
        <div class='content'>{{brief}}</div>
        <div class='title'>相似歌手</div>
        <scroll class='similar' :scrollX='true' ref='slider'>
            <div class='wrapper' ref='wrapper'>
                <div v-for='singer of similarSingers' :key='singer.id' class='singer'>
                    <img :src='singer.picUrl' class='img'></img>
                    <span class='text'>{{singer.name}}</span>
                </div>
            </div>
        </scroll>
    </scroll>
</template>
<script>
    import scroll from 'base/scroll/scroll'
    export default {
        name: 'brief',
        components: {
            scroll
        },
        props: {

        },
        data() {
            return {
                brief: '',
                similarSingers: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {

        },
        created() {

        },
        mounted() {
            this.$refs.wrapper.style.width = this.similarSingers.length * 100 + 'px'
            setTimeout(() => {
                this.$refs.slider.refresh()
            }, 2000)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .brief
        background: $color-background
        padding: 15px 10px
        .title
            font-weight: bold 
        .content
            color: $color-text-g
            margin: 10px 0
        .similar
            overflow: hidden
            margin-top: 10px
            .wrapper
                height: 100px
                .singer
                    height: 100px
                    width: 80px
                    float: left 
                    display: flex
                    flex-direction: column
                    justify-content: center
                    align-items: center
                    margin-right: 20px
                    .img
                        height: 80px
                        width: 80px
                        overflow: hidden
                        border-radius: 5px
                    .text
                        color: $color-text-ii
                        font-size: $font-size-small
                        padding-top: 8px

</style>