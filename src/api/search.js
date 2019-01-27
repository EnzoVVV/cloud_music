import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { HOST, commonParams, ERR_FREE } from 'api/config'
import { success } from 'api/shared'
import { getSongUrl } from 'api/song'
import { getSongs } from 'common/js/song'
import { getAlbums } from 'common/js/album'
import Singer from 'common/js/singer'


export function searchSuggest(query) {
    const url = HOST + `/search/suggest?keywords=${query}`
    return axios.get(url)
}

export function searchSong(query) {
    return search(query, 1).then(res => {
        let result = []
        if(success(res.status)) {
            result = getSongs(res.data.result.songs)
        }
        return result
    })
}


export function searchSinger(query) {
    return search(query, 100).then(res => {
        let result = []
        if(success(res.status)) {
            result = res.data.result.artists.map(item => {
                return new Singer({
                    id: item.id,
                    mid: null,
                    name: item.name,
                    picUrl: item.picUrl,
                    alias: item.alias && item.alias.length ? item.alias[0] : '',
                })
            })
        }
        return result
    })
}

export function searchAlbum(query) {
    return search(query, 10).then(res => {
        let result = []
        if(success(res.status)) {
            result = getAlbums(res.data.result.albums)
        }
        return result
    })
}

// type： 搜索类型 ， 默认为1 即单曲, 取值意义: 1单曲 10专辑 100歌手 1000歌单 1002用户 1004MV 1006歌词 1009电台 1014视频
export function search(query, type) {
    const url = HOST + `/search?keywords=${query}&type=${type}`
    return axios.get(url)
}


export function suggest(keyword) {
    if(window.useCloud) {
        const url = HOST + `/search/suggest?keywords=${keyword}`
        return axios.get(url).then(res => {
            let result = []
            // 没有搜索结果时res.data.result是空对象
            if(success(res.status) && res.data.result.order) {
                let data = res.data.result
                outer: for(let key of data.order) {
                    // order下的项, 可能在data中并没有
                    let list = data[key] || []
                    for(let item of list) {
                        // 最多取15条
                        if(result.length >=15) {
                            break outer
                        } else {
                            result.push(item.name)
                        }
                    }
                }
            }
            return result
        })
    }
}


// 下面是qq的接口
// qq接口没有搜索歌手和专辑的, 因此这里只能用云音乐的
export function getHotKey() {
    if(window.useCloud) {
        const url = HOST + '/search/hot'
        return axios.get(url).then(res => {
            let result = []
            if(success(res.status)) {
                result = res.data.result.hots.map(item => {
                    return item.first
                })
            }
            return result
        })
    }

    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    })

    return jsonp(url, data, options)
}


const perpage = 10
// 搜索QQ曲库下歌曲的url
export function qsearch(song, singer, page = 1) {
    const url = '/api/search'

    const data = Object.assign({}, commonParams, {
        w: song,
        p: page,
        perpage,
        n: perpage,
        catZhida: 0,
        zhidaqu: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        remoteplace: 'txt.mqq.all',
        uin: 0,
        needNewCode: 1,
        platform: 'h5',
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        if(res.status === ERR_FREE) {
            if(res.data.data && res.data.data.song && res.data.data.song.list) {
                const data = res.data.data.song
                const result = data.list.find(i => {
                    // 找到歌曲列表中歌手名匹配的(有可能有多个歌手, 用indexOf判断包含)
                    return !!i.singer.find(j => singer.indexOf(j.name) > -1)
                })
                if(result) {
                    result.mid = result.songmid
                    return getSongUrl(result)
                } else if(data.curnum && data.curpage && data.totalnum) {
                    // 还有更多结果, 增加页数后继续搜索
                    if(data.curnum * data.curpage <= data.totalnum) {
                        return qsearch(song, singer, data.curpage + 1)
                    }
                }
            }
        }
        return null
    })
}