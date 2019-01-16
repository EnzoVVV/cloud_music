import jsonp from 'common/js/jsonp'
import { commonParams, options, HOST } from './config'
import { success } from './shared'
import axios from 'axios'
import getFirstLetter from 'common/js/getFirstLetter/getFirstLetter'
import { getSongs, processSongsUrl } from 'common/js/song'
import { getAlbums } from 'common/js/album'

export function getSingerList() {
	if(window.useCloud) {
		const url = HOST + '/top/artists?offset=0&limit=100'
		return axios.get(url).then(res => {
			let result = []
			if(success(res.status)) {
				result = res.data.artists.map(item => {
					return  {
						id: item.id,
						name: item.name,
						picUrl: item.picUrl,
						// 网易没有歌手拼音首字母，这里自行计算
						Findex: getFirstLetter(item.name)
					}
				})
			}
			return result			
		})
	}
  
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

	const data = Object.assign({}, commonParams, {
		channel: 'singer',
		page: 'list',
		key: 'all_all_all',
		pagesize: 100,
		pagenum: 1,
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq'
	})

	return jsonp(url, data, options).then(res => {
		let result = []
		if(success(res.code)) {
			result = res.data.list.map(item => {
				return {
					id: item.Fsinger_id,
					mid: item.Fsinger_mid,
					name: item.Fsinger_name,
					Findex: item.Findex
				}
			})
		}
		return result
	})
}


export function getSingerDetail(singerId) {
	if(window.useCloud) {
		const url = HOST + `/artists?id=${singerId}`
		return axios.get(url).then(res => {
			let result = {}
			if(success(res.status)) {
				result.name = res.data.artist.name
				result.picUrl = res.data.artist.picUrl
				result.songs = getSongs(res.data.hotSongs)
				result.brief = res.data.artist.briefDesc
			}
			return result
		})
	}

	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

	const data = Object.assign({}, commonParams, {
		utin: 0,
		needNewCode: 1,
		platform: 'h5page',
		order: 'listen',
		begin: 0,
		num: 50,
		songstatus: 1,
		singerid: singerId,
		from: 'h5',
		notice: 0
	})
	return jsonp(url, data, options).then(res => {
		let result = {}
		if(success(res.code)) {
			return processSongsUrl(getSongs(res.data.list)).then((songs) => {
				result.songs = songs
				result.albums = getAlbums(res.data.albumlist)
				return result
			})
		}
		return result
	})
}

export function getSingerAlbums(singerId) {
	const url = HOST + `/artist/album?id=${singerId}`
	return axios.get(url).then(res => {
		let result = []
		if(success(res.status)) {
			result = getAlbums(res.data.hotAlbums)
		}
		return result
	})
}


export function getSimilarSingers(id) {
	const url = HOST + `/simi/artist?id=${id}`
	return axios.get(url).then(res => {
		let result = []
		if(success(res.status)) {
			result = res.data.artists.map(item => {
				return  {
					id: item.id,
					name: item.name,
					picUrl: item.picUrl
				}
			})
		}
		return result
	})
}