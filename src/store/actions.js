import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { generateRandomList } from 'common/js/tools'


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