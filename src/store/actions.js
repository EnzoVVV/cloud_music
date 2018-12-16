import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { generateRandomList, deepCopy } from 'common/js/tools'
import { saveSearch, deleteSearch, clearSearch, restoreSearch } from 'common/js/cache'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

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

// 歌单中插入一首歌，并播放这首歌
export const insertSong = function ({commit, state}, song) {
    // 不能直接修改state下的数据，复制一份
    let playlist = deepCopy(state.playlist)
    let sequenceList = deepCopy(state.sequenceList)
    let currentIndex = state.currentIndex

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
            playlist.splice(fsIndex + 1, 1)
        } else {
            playlist.splice(fsIndex, 1)
        }
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 在歌曲列表中删掉一项
export const deleteSong = function ({commit, state}, song) {
    let playlist = deepCopy(state.playlist)
    let sequenceList = deepCopy(state.sequenceList)
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

export const deleteSongList = function ({commit}) {
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAYING_STATE, false)
}
  
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

import { addToDisc, getDiscs, saveDisc, deleteDisc as deleteADisc, deleteSongFromDisc as deleteSongFromADisc, toggleSongFS } from 'common/js/cache'
import { createDisc as createADisc } from 'common/js/disc'

// 将歌曲添加到歌单, 入参为类的实例
export const addSongToDisc = function ({commit}, song, disc) {
    addToDisc(song, disc)
    commit(types.SET_DISCS, getDiscs())
}

// 创建歌单, 入参： 歌单名
export const createDisc = function ({commit}, discName) {
    let disc = createADisc({
        name: discName
    })
    saveDisc(disc)
    commit(types.SET_DISCS, getDiscs())
}
// 创建歌单并添加歌曲
export const createDiscAndAddSong = function ({commit}, song, discName) {
    let disc = createADisc({
        name: discName
    })
    saveDisc(disc)
    addToDisc(song, disc)
    commit(types.SET_DISCS, getDiscs())
}
// 从storage中恢复歌单信息
export const restoreDisc = function ({commit}) {
    commit(types.SET_DISCS, getDiscs(0))
    commit(types.SET_F_DISCS, getDiscs(1))
}

//删除歌单
// disc包含id就可以, 不要求是disc实例还是对象
export const deleteDisc = function ({commit}, disc, type = 0) {
    deleteADisc(disc, type)
    const mutationType = type === 0 ? types.SET_DISCS : types.SET_F_DISCS
    commit(mutationType, getDiscs(type))
}

// 从歌单中删除一首歌
// disc包含id就可以
export const deleteSongFromDisc = function ({commit}, song, disc) {
    deleteSongFromADisc(song, disc)
    commit(types.SET_DISCS, getDiscs(0))
}

// 收藏歌单，status true 添加收藏，false 取消收藏
export const favoriteDisc = function ({commit}, disc, status = true) {
    if(status) {
        saveDisc(disc, 1)
    } else {
        deleteADisc(disc, 1)
    }
    commit(types.SET_F_DISCS, getDiscs(1))
}

// 添加/移除歌曲到“我喜欢的音乐”歌单
export const toggleFS = function ({commit}, song) {
    toggleSongFS(song)
    commit(types.SET_DISCS, getDiscs(0))
}