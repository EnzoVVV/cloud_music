<template>
  <div class="singer">
    <listview :content="singerList" @click='handleClick'></listview>
  </div>
</template>

<script>
    import { getSingerList } from "api/singer"
    import { ERR_OK } from "api/config"
    import Singer from "common/js/singer"
    import { isCharacter } from 'common/js/tools'
    import listview from "base/listview/listview"
    import { mapMutations } from 'vuex'

    const HOT_SINGER_LEN = 10
    const HOT_NAME = "热门"

    export default {
        name: 'singer',
        components: {
            listview,
        },
        data() {
            return {
                singerList: [],
                showSingerDetail: false
            }
        },
        methods: {
            getSingerLists() {
                getSingerList().then(res => {
                    if (res.code === ERR_OK) {
                        this.singerList = this.assembleList(res.data.list)
                    }
                })
            },
            assembleList(list) {
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                list.forEach((item, index) => {
                    const singerInfo = new Singer({
                        id: item.Fsinger_id,
                        mid: item.Fsinger_mid,
                        name: item.Fsinger_name
                    })
                    if (index < HOT_SINGER_LEN) {
                        map.hot.items.push(singerInfo)
                    }
                    const key = isCharacter(item.Findex) ? item.Findex : '#'
                    map[key] = map[key] || {
                        title: key,
                        items: []
                    }
                    map[key].items.push(singerInfo)
                })
                // 数组可以用for in和for of遍历，分别遍历index和value，对象只能用for in遍历key
                let [normal, hot, special]  = [[],[],[]]
                for (let key in map) {
                    let singerGroup = map[key]
                    if (singerGroup.title == HOT_NAME) {
                        hot.push(singerGroup)
                    } else if (singerGroup.title == '#') {
                        special.push(singerGroup)
                    } else {
                        normal.push(singerGroup)
                    }
                }
                normal.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
                return hot.concat(normal).concat(special)
            },
            handleClick(singer) {
                this.$bus.emit('showSingerDetail',true)
                this.setSinger(singer)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        created() {
            this.getSingerLists()
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
    position: absolute
    // top: 88px
    // bottom: 0
    width: 100%
    height: 100%
</style>
