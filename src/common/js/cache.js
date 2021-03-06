import storage from 'good-storage'
import { deepCopy } from 'common/js/tools'


// ----------------------公用函数---------------------------
// 往数组开头塞入一项
function insertArray(array, query, compare, maxLength) {
    if(!array) return
    const index = array.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        array.splice(index, 1)
    }
    array.unshift(query)
    if (maxLength && array.length > maxLength) {
        array.pop()
    }
}

// 从数组中删掉一项
function deleteFromArray(array, compare) {
  const index = array.findIndex(compare)
  if (index > -1) {
    array.splice(index, 1)
  }
}


// ----------------------搜索历史---------------------------

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15
// 将query添加到storage的搜索历史中， 并返回最新的搜索历史
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LEN)
    storage.set(SEARCH_KEY, searches)
    return searches
}

// 将query从搜索历史中删除， 并返回最新的搜索历史
export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

// 清空搜索历史
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

// 从localstorage中恢复搜索历史
export function restoreSearch() {
    let searches = storage.get(SEARCH_KEY, [])
    return searches
}

// ---------------歌单-------------------------------
export const DISC_KEY = '__disc__'
export const DISC_F_KEY = '__favorite_disc__'
import { addSongsToDisc as addSongsToDiscApi } from 'api/disc'
import { defaultDiscs } from 'common/js/disc'
import Song from 'common/js/song'
import Disc from 'common/js/disc'

// 获取storage中所有歌单
export function getDiscs(type = 0) {
    let discs = null
    if(type === 0) {
        // 当storage中没有DISC_KEY时，才返回defaultDiscs
        // 如果DISC_KEY对应值为空数组时，也算有值，不返回defaultDiscs
        discs = storage.get(DISC_KEY, defaultDiscs)
        if(discs && discs.length == 0) {
            discs = defaultDiscs
        }
    } else if(type === 1) {
        discs = storage.get(DISC_F_KEY, [])
    }
    return discs.map(disc => {
        const copyDisc = deepCopy(disc)
        // deepCopy后songList里的song实例变成普通object了，需要转换回去
        copyDisc.songList = copyDisc.songList.map(song => new Song(song))
        return new Disc(copyDisc)
    })
}


// 将disc实例保存到storage, type 0 创建的歌单 type 1 收藏的歌单
export function saveDisc(disc, type = 0) {
    let discs = getDiscs(type)
    let index = discs.findIndex(i => i.id === disc.id)
    // findIndex找不到时, index为-1
    if(index > -1) {
        // 已存在, 则替换(添加歌曲到歌单)
        discs.splice(index, 1, disc)
    } else {
        // 不存在，则添加(新建歌单)
        discs.push(disc)
        
    }
    const discKey = getDiscKey(type)
    storage.set(discKey, discs)
}

// 添加歌曲到歌单
// song，disc都是对应的类实例
export function addToDisc(song, disc) {
    disc.addSong(song)
    saveDisc(disc)
}

// 添加/移除歌曲到'我喜欢的音乐'歌单
export function toggleSongFS(song) {
    const copySong = new Song(deepCopy(song))
    // 切换song实例里的状态
    copySong.toggleFavoriteStatus()
    let discs = getDiscs()
    let favoriteDisc = discs[0]
    if(copySong.favorite) {
        // 添加, 插入到首位
        favoriteDisc.songList.splice(0, 0, copySong)
    } else {
        // 移除
        favoriteDisc = favoriteDisc.songList.filter(i => i.id != copySong.id)
    }
    storage.set(DISC_KEY, discs)
}

// 删除歌单
export function deleteDisc(disc, type = 0) {
    let discs = getDiscs(type)
    let newDiscs = discs.filter(i => i.id != disc.id)
    const discKey = getDiscKey(type)
    storage.set(discKey, newDiscs)
}

// 从歌单中删除一首歌
export function deleteSongFromDisc(song, disc) {
    let discs = getDiscs()
    let targetDisc = discs.find(i => i.id === disc.id)
    targetDisc.songList = targetDisc.songList.filter(i => i.id != song.id)
    storage.set(DISC_KEY, discs)
    // 调服务
    addSongsToDiscApi(disc.id, [song.id], false)
}

function getDiscKey(type = 0) {
    return type === 0 ? DISC_KEY : DISC_F_KEY
}

export function setDiscs(discs, type) {
    const key = getDiscKey(type)
    storage.set(key, discs)
}


// -------------------专辑-----------------------
import Album from 'common/js/album'
const ALBUM_KEY = '__album__'
// 收藏专辑
export function saveAlbum(album) {
    let albums = getAlbums()
    albums.push(album)
    storage.set(ALBUM_KEY, albums)
}

// 取消收藏专辑
export function deleteAlbum(album) {
    let albums = getAlbums()
    albums = albums.filter(i => i.id != album.id)
    storage.set(ALBUM_KEY, albums)
}
// 获取storage中的专辑
export function getAlbums() {
    return storage.get(ALBUM_KEY, []).map(album => new Album(album))
}


// ------------------歌手---------------------------
import Singer from 'common/js/singer'
export const SINGER_KEY = '__singer__'
// 收藏歌手
export function saveSinger(singer) {
    let singers = getSingers()
    if(!singers.find(i => i.id == singer.id)) {
        singers.push(singer)
    }
    storage.set(SINGER_KEY, singers)
}
// 取消收藏歌手
export function deleteSinger(singer) {
    let singers = getSingers()
    singers = singers.filter(i => i.id != singer.id)
    storage.set(SINGER_KEY, singers)
}
// 获取storage中的歌手
export function getSingers() {
    return storage.get(SINGER_KEY, []).map(singer => new Singer(singer))
}

// 设置收藏的歌手(全部)
export function setSingers(singers) {
    storage.set(SINGER_KEY, singers)
}

// --------------已删除的歌单-------------------
const DISCARD_DISC = '__discard_disc__'
// 暂存删除的自建歌单
export function saveDiscardDisc(disc) {
    let discs = getDiscardDiscs()
    discs.push(disc)
    storage.set(DISCARD_DISC, discs)
}
// 清除删除的自建歌单
export function deleteDiscardDisc(disc) {
    let discs = getDiscardDiscs()
    discs = discs.filter(i => i.id != disc.id)
    storage.set(DISCARD_DISC, discs)
}
// 获取storage中的歌手
export function getDiscardDiscs() {
    return storage.get(DISCARD_DISC, [])
}