<template>
    <div class='collection'>
        <FunctionalHeader title='我的收藏' sbph='专辑 歌手' :showSearch='true' @back='back' @search='search'></FunctionalHeader>
        <tabswiper :tabContent='tabs' :componentList='componentList' :defaultIndex='0' :swiperHeight='swiperHeight'></tabswiper>
        <managelist v-if='settingFlag' :title='title' :modalTitle='modalTitle'  @deleteOne='deleteOne' @hide='settingFlag = false'></managelist>
    </div>
</template>
<script>
    import FunctionalHeader from 'base/functional-header/functional-header'
    import tabswiper from 'base/swiper/tabswiper'
    const albumCollection = () => import('./sub-components/album-collection')
    const singerCollection = () => import('./sub-components/singer-collection')
    const managelist = () => import('components/manage-list/manage-list')
    const componentList = [
        {
            name: 'albumCollection',
            component: albumCollection
        },
        {
            name: 'singerCollection',
            component: singerCollection
        }
    ]
    export default {
        name: 'collection',
        components: {
            tabswiper,
            FunctionalHeader,
            managelist
        },
        props: {
            
        },
        data() {
            return {
                tabs: [
                    {
                        text: '专辑'
                    },
                    {
                        text: '歌手'
                    }
                ],
                componentList: componentList,
                swiperHeight: window.innerHeight,
                settingFlag: false
            }
        },
        computed: {
            title() {
                if(this.type == 'singer') {
                    return `歌手: ${this.selectedItem.name}`
                }
                if(this.type == 'album') {
                    return `专辑: ${this.selectedItem.name}`
                }
                return ''
            },
            modalTitle() {
                if(this.type == 'singer') {
                    return '确定要删除此歌手吗?'
                }
                if(this.type == 'album') {
                    return '确定要删除此专辑吗?'
                }
                return ''
            }
        },
        watch: {

        },
        methods: {
            search(query) {
                this.$bus.emit('collection-search', query)
            },
            back() {
                this.$emit('back')
            },
            showCollectionSetting(type, item) {
                this.type = type
                this.selectedItem = item
                this.settingFlag = true
            },
            deleteOne() {
                if(this.type == 'singer') {
                    this.$bus.emit('deleteCollectionSinger')
                } else if(this.type == 'album') {
                    this.$bus.emit('deleteCollectionAlbum')
                }
            }
        },
        created() {

        },
        mounted() {
            this.$emit('mountedCalled')
            this.$bus.on('showCollectionSetting', this.showCollectionSetting)
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .collection
        position: fixed
        left: 0
        top: 0
        right: 0
        bottom: 0
        z-index: 6000
        background: $color-background
</style>