import jsonp from 'common/js/jsonp'
import { commonParams, options, HOST } from './config'
import { ERR_OK } from 'api/config'
import axios from 'axios'
import { success } from './shared'
import { getRankIdx } from 'common/js/rank'

import { getSongs } from 'common/js/song'
function getRankData(item) {
	return {
		id: item.id,
		name: item.name,
		picUrl: item.coverImgUrl,
		updateFrequency: item.updateFrequency,
		creator: item.creator,
		tracks: item.tracks.map(track => {
			return {
				name: track.first,
				singer: track.second
			}
		})
	}
}

export function getTopList() {
	if(window.useCloud) {
		const url = HOST + '/toplist/detail'
		return axios.get(url).then(res => {
			let result = {
				official: [],
				recommend: [],
				more: []
			}
			if(success(res.status)) {
				res.data.list.forEach(item => {
					const idx = getRankIdx(item.name)
					if(idx === undefined) {
						// 没有对应的idx的, 不添加(除非及时维护更新idx表)
						return
					}
					const rankData = getRankData(item)
					rankData.idx = idx
					if(item.tracks && item.tracks.length) {
						result.official.push(rankData)
					} else if(result.recommend.length < 6) {
						result.recommend.push(rankData)
					} else {
						result.more.push(rankData)
					}
				})
			}
			return result
		})
	}

	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

	const data = Object.assign({}, commonParams, {
		uin: 0,
		needNewCode: 1,
		platform: 'h5'
	})

	return jsonp(url, data, options).then(res => {
		if(res.code === ERR_OK) {
			let result = res.data.topList.map(list => {
				return {
					id: list.id,
					listenCount: list.listenCount,
					picUrl: list.picUrl,
					songList: list.songList.map(song => { return {name: song.songname, singer: song.singername}}),
					title: list.topTitle,
					type: list.type
				}
			})
			return result
		} else {
			return []
		}
	})
}

export function getMusicList(topid) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

	const data = Object.assign({}, commonParams, {
		topid,
		needNewCode: 1,
		uin: 0,
		tpl: 3,
		page: 'detail',
		type: 'top',
		platform: 'h5'
	})

	return jsonp(url, data, options)
}


export function getRankDetail(idx) {
	const url = HOST + `/top/list?idx=${idx}`
	return axios.get(url).then(res => {
		let result = {}
		if(success(res.status)) {
			const playlist = res.data.playlist
			result.id = playlist.id
			result.name = playlist.name
			result.picUrl = playlist.coverImgUrl
			result.songs = getSongs(playlist.tracks)
			result.creator = playlist.creator.nickname || ''
		}
		return result
	})
}