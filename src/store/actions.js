import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { generateRandomList, deepCopy } from 'common/js/tools'
import { saveSearch, deleteSearch, clearSearch, restoreSearch } from 'common/js/cache'

// ---------------------歌曲播放列表------------------------------------
function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

// 设置播放列表并播放第index首歌曲
export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = generateRandomList(list)
        commit(types.SET_PLAYLIST, randomList)
        index = randomList.findIndex(i => i.id == list[index].id)
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 播放列表中已有的一首歌
export const playSongInList = function ({commit, state}, song) {
    const index = state.sequenceList.findIndex(i => i.id == song.id)
    if(index < 0) {
        throw Error('歌单中不存在此歌曲, 不要调用此方法')
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


// 歌单中插入一首歌，并播放这首歌
export const insertSong = function ({commit, state}, song) {
    // 不能直接修改state下的数据，复制一份
    // 这里不能用deepCopy,deepCopy将song class复制成object了, 用slice可以保留class
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let insert = createInsertFunction(playlist, sequenceList, currentIndex)
    insert(song)
    insert = null

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 插入歌曲到下一首的位置
export const insertSongsToPlayNext = function ({commit, state}, songs) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let insert = createInsertFunction(playlist, sequenceList, currentIndex)
    songs.forEach(song => {
        insert(song)
    })
    insert = null

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
}

const createInsertFunction = function(playlist, sequenceList, currentIndex) {
    // 如果已经有这首歌，找到已有的index
    let fpIndex = findIndex(playlist, song)
    // 在当前位置下一位插入新歌
    currentIndex++
    // 插入新歌
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含了这首歌
    if (fpIndex > -1) {
        if (currentIndex < fpIndex) {
            // 在老歌前面插入新歌后， fpIndex应该加一
            playlist.splice(fpIndex + 1, 1)
        } else {
            // 在老歌之后插入新歌， 删掉老歌后， 新歌的index加一
            playlist.splice(fpIndex, 1)
            currentIndex--
        }
    }

    let fsIndex = findIndex(sequenceList, song)
    let curSIndex = findIndex(sequenceList, song) + 1
    sequenceList.splice(curSIndex, 0, song)

    if (fsIndex > -1) {
        if (curSIndex < fsIndex) {
            sequenceList.splice(fsIndex + 1, 1)
        } else {
            sequenceList.splice(fsIndex, 1)
        }
    }
}

// 在歌曲列表中删掉一项
export const deleteSong = function ({commit, state}, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--
    }
  
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    
    const playingState = playlist.length == 0 ? false : true
    commit(types.SET_PLAYING_STATE, playingState)    
}

// 清空播放列表
export const deleteSongList = function ({commit}) {
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAYING_STATE, false)
}


// ---------------------搜索历史------------------------------------
export const saveSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const restoreSearchHistory = function ({commit}) {
    commit(types.SET_SEARCH_HISTORY, restoreSearch())
}


// ---------------------收藏歌单------------------------------------
import { addToDisc, getDiscs, saveDisc, deleteDisc as deleteADisc, deleteSongFromDisc as deleteSongFromADisc, toggleSongFS as toggleTheSongFS } from 'common/js/cache'
import { createDisc as createADisc } from 'common/js/disc'
import Disc from 'common/js/disc'

// 将歌曲添加到歌单, 入参为类的实例
export const addSongToDisc = function ({commit}, {song, disc}) {
    // disc class下的songList是数组，所以这里要deepCopy
    const copyDisc = new Disc(deepCopy(disc))
    addToDisc(song, copyDisc)
    commit(types.SET_DISCS, getDiscs(0))
}

// 创建歌单, 入参： 歌单名
export const createDisc = function ({commit}, discName) {
    let disc = createADisc({
        name: discName
    })
    saveDisc(disc)
    commit(types.SET_DISCS, getDiscs(0))
}
// 创建歌单并添加歌曲
// 入参的payload只能有一个, 所以用对象与结构 {song, discName}
export const createDiscAndAddSong = function ({commit}, {song, discName}) {
    let disc = createADisc({
        name: discName
    })
    saveDisc(disc)
    addToDisc(song, disc)
    commit(types.SET_DISCS, getDiscs(0))
}
// 从storage中恢复歌单信息
export const restoreDisc = function ({commit}) {
    commit(types.SET_DISCS, getDiscs(0))
    commit(types.SET_F_DISCS, getDiscs(1))
}

//删除歌单
// disc包含id就可以, 不要求是disc实例还是对象
export const deleteDisc = function ({commit}, {disc, type}) {
    deleteADisc(disc, type)
    const mutationType = type === 0 ? types.SET_DISCS : types.SET_F_DISCS
    commit(mutationType, getDiscs(type))
}

// 从歌单中删除一首歌
// disc包含id就可以
export const deleteSongFromDisc = function ({commit}, {song, disc}) {
    deleteSongFromADisc(song, disc)
    commit(types.SET_DISCS, getDiscs(0))
}

// 直接创建歌单(恢复歌单)
export const addDisc = function ({commit}, disc) {
    saveDisc(disc)
    commit(types.SET_DISCS, getDiscs(0))
}

// 收藏歌单，status true 添加收藏，false 取消收藏
export const favoriteDisc = function ({commit}, {disc, status}) {
    if(status) {
        saveDisc(disc, 1)
    } else {
        deleteADisc(disc, 1)
    }
    commit(types.SET_F_DISCS, getDiscs(1))
}

// 添加/移除歌曲到“我喜欢的音乐”歌单
export const toggleSongFS = function ({commit}, song) {
    toggleTheSongFS(song)
    commit(types.SET_DISCS, getDiscs(0))
}


// ---------------------收藏专辑------------------------------------
import { saveAlbum as saveAnAlbum, deleteAlbum as deleteAnAlbum, getAlbums } from 'common/js/cache'

// 收藏/取消收藏 专辑
export const favoriteAlbum = function ({commit}, {album, status}) {
    if(status) {
        saveAnAlbum(album)
    } else {
        deleteAnAlbum(album)
    }
    commit(types.SET_ALBUMS, getAlbums())
}

// 从storage中恢复收藏的歌单
export const restoreAlbums = function ({commit}) {
    commit(types.SET_ALBUMS, getAlbums())
}


// ---------------------收藏歌手------------------------------------
import { saveSinger, deleteSinger, getSingers } from 'common/js/cache'
// 收藏/取消收藏 歌手
export const favoriteSinger = function ({commit}, {singer, status}) {
    if(status) {
        saveSinger(singer)
    } else {
        deleteSinger(singer)
    }
    commit(types.SET_FAVORITE_SINGERS, getSingers())
}

// 从storage中恢复收藏的歌手
export const restoreSingers = function ({commit}) {
    commit(types.SET_FAVORITE_SINGERS, getSingers())
}



// ---------------------恢复歌单------------------------------------
import { getDiscardDiscs, saveDiscardDisc, deleteDiscardDisc } from 'common/js/cache'

// 从storage中恢复删除的歌单
export const restoreDiscardDiscs = function ({commit}) {
    commit(types.SET_DISCARD_DISCS, getDiscardDiscs())
}

// 暂存删除的歌单
export const storeDiscardDisc = function ({commit}, disc) {
    saveDiscardDisc(disc)
    commit(types.SET_DISCARD_DISCS, getDiscardDiscs())
}

// 清除删除的自建歌单
export const desertDiscardDisc = function ({commit}, disc) {
    deleteDiscardDisc(disc)
    commit(types.SET_DISCARD_DISCS, getDiscardDiscs())
}

