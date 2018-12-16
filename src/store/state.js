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
  fdiscs: []
}

export default state