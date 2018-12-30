<template>
    <div>
        <tabswiper :tabContent='tabContent' :componentList='componentList' :defaultIndex='defaultIndex' :swiperHeight='swiperHeight'></tabswiper>
    </div>
</template>
<script>
    import tabswiper from 'base/swiper/tabswiper'
    import searchSong from './search-result-panels/search-song'
    import searchSinger from './search-result-panels/search-singer'
    import searchAlbum from './search-result-panels/search-album'
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
        }
    ]
    export default {
        name: 'result',
        components: {
            tabswiper
        },
        data() {
            return {
                componentList: componentList,
                tabContent: tabContent,
                swiperHeight: window.innerHeight - 44,
                defaultIndex: 0
            }
        }
    }
</script>