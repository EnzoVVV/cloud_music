export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const query = state => state.query

export const searchHistory = state => state.searchHistory

export const discs = state => state.discs
// 我喜欢的歌曲
export const favoriteSongs = state => {
  let disc = state.discs[0] || []
  return disc.length > 0 ? disc.songList : []
}

export const fdiscs = state => state.fdiscs

export const discardDiscs = state => state.discardDiscs

// 收藏的专辑
export const albums = state => state.albums
// 收藏的歌手
export const fsingers = state => state.fsingers

export const FMSwitch = state => state.FMSwitch

export const homepage = state => state.homepage

export const loginUser = state => state.loginUser
