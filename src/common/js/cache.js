import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

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

const DISC_KEY = '__disc__'
import { defaultDiscs } from 'common/js/disc'
// 添加歌曲到歌单
// song，disc都是对应的类实例
export function addToDisc(song, disc) {
    disc.addSong(song)
    saveDisc(disc)
}

// 将disc实例保存到storage
export function saveDisc(disc) {
    let discs = getDiscs()
    discs.push(disc)
    storage.set(DISC_KEY, discs)
}

// 获取storage中所有歌单
export function getDiscs() {
    return storage.get(DISC_KEY, defaultDiscs)
}