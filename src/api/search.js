import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { HOST } from 'api/config'
import { success } from './shared'
import { getSongs } from 'common/js/song'
import Singer from 'common/js/singer'
import { getAlbumPicUrl } from 'api/album'

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

// type： 搜索类型 ， 默认为1 即单曲, 取值意义: 1单曲 10专辑 100歌手 1000歌单 1002用户 1004MV 1006歌词 1009电台 1014视频
export function search(query, type) {
    const url = HOST + `/search?keywords=${query}&type=${type}`
    return axios.get(url)
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