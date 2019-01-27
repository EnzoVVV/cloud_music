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