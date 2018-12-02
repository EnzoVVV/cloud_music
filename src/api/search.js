import axios from 'axios'
import {HOST} from 'api/config'

export function searchSuggest(query) {
    const url = HOST + `/search/suggest?keywords=${query}`
    return axios.get(url)
}

export function searchSong(query) {
    return search(query, 1)
}

export function searchAlbum(query) {
    return search(query, 10)
}

export function searchSinger(query) {
    return search(query, 100)
}

// type： 搜索类型 ， 默认为1 即单曲, 取值意义: 1单曲 10专辑 100歌手 1000歌单 1002用户 1004MV 1006歌词 1009电台 1014视频
export function search (query, type) {
    const url = HOST + `/search?keywords=${query}&type=${type}`
    return axios.get(url)
}


// 下面是qq的接口
// qq接口没有搜索歌手和专辑的, 因此这里只能用云音乐的
export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    })

    return jsonp(url, data, options)
}