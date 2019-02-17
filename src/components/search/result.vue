<template>
    <div>
        <tabswiper :tabContent='tabContent' :componentList='componentList' :defaultIndex='0' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import tabswiper from 'base/swiper/tabswiper'
    import searchSong from './search-result-panels/search-song'
    const searchSinger = () => import('./search-result-panels/search-singer')
    const searchAlbum = () => import('./search-result-panels/search-album')
    const searchUser = () => import('./search-result-panels/search-user')
    const searchDisc = () => import('./search-result-panels/search-disc')
    const componentList = [
        {
            name: 'searchSong',
            component: searchSong
        },
        {
            name: 'searchSinger',
            component: searchSinger
        },
        {
            name: 'searchAlbum',
            component: searchAlbum
        },
        {
            name: 'searchDisc',
            component: searchDisc
        },
        {
            name: 'searchUser',
            component: searchUser
        }
    ]
    const tabContent = [
        {
            text: '单曲'
        },
        {
            text: '歌手'
        },
        {
            text: '专辑'
        },
        {
            text: '歌单'
        },
        {
            text: '用户'
        }
    ]
    export default {
        name: 'result',
        components: {
            tabswiper
        },
        props: {
            totalHeight: {
                type: Number
            }
        },
        data() {
            return {
                componentList: componentList,
                tabContent: tabContent,
                // 防止安卓端键盘影响window高度, 这里强制设置result高度为无键盘状态window高度 - header高度
                swiperHeight: this.totalHeight ? this.totalHeight - 44 : window.innerHeight - 44
            }
        }
    }
</script>