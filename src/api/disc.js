import axios from 'axios'
import { HOST } from './config'
import { success } from './shared'
import { getSongs } from 'common/js/song'
import { createDisc } from 'common/js/disc'


// 获取歌单详情
export function getDiscDetail(id) {
    if(window.useCloud) {
		const url = HOST + `/playlist/detail?id=${id}`
		return axios.get(url).then(res => {
			let result = {}
			if(success(res.status)) {
				const playlist = res.data.playlist
				const creator = playlist.creator
				result = createDisc({
					id: playlist.id,
					name: playlist.name,
					songList: getSongs(playlist.tracks),
					picUrl: playlist.coverImgUrl,
					creator: {
						id: creator.userId,
						name: creator.nickname,
						picUrl: creator.avatarUrl
					}
				})
			}
			return result
		})
	}
}

// 收藏/取消 歌单
export function favoriteDisc(id, status) {
	const code = status ? 1 : 2
	const url = HOST + `/playlist/subscribe?t=${code}&id=${id}`
	return axios.get(url)
}

// 歌单中 添加/删除 歌曲
export function addSongsToDisc(discId, songIds, op = true) {
	const operation = op ? 'add' : 'del'
	const songsId = songIds.join(',')
	const url = HOST + `/playlist/tracks?op=${operation}&pid=${discId}&tracks=${songsId}`
	return axios.get(url)
}

// 创建歌单
export function createDiscApi(discName) {
	const url = HOST + `/playlist/create?name=${discName}`
	return axios.get(url)
}