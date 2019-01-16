import { playMode } from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.listCycle,
  currentIndex: -1,
  query: '',
  searchHistory: [],
  discs: [],
  fdiscs: [],
  discardDiscs: [],
  albums: [],
  fsingers: [],
  discardDiscs: [],
  // 记录FM是否开启的状态到vuex
  FMSwitch: false
}

export default state