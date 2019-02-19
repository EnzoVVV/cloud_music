import * as types from './mutation-types'

const matutaions = {
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_QUERY](state, query) {
    state.query = query
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_DISCS](state, discs) {
    state.discs = discs
  },
  [types.SET_F_DISCS](state, discs) {
    state.fdiscs = discs
  },
  [types.SET_DISCARD_DISCS](state, discs) {
    state.discardDiscs = discs
  },
  [types.SET_ALBUMS](state, albums) {
    state.albums = albums
  },
  [types.SET_FAVORITE_SINGERS](state, singers) {
    state.fsingers = singers
  },
  // 记录FM是否开启的状态到vuex
  [types.SET_FM_SWITCH](state, status) {
    state.FMSwitch = status
  },
  [types.SET_HOMEPAGE](state, homepage) {
    state.homepage = homepage
  },
  [types.SET_LOGIN_USER](state, loginUser) {
    state.loginUser = loginUser
  }
}

export default matutaions