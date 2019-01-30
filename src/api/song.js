import { commonParams, HOST } from './config'
import { getUid } from 'common/js/uid'
import axios from 'axios'
import { ERR_OK } from 'api/config'
import { success } from './shared'
import { Base64 } from 'js-base64'

export function getLyric(mid) {
	if(window.useCloud) {
		const url = HOST + `/lyric?id=${mid}`
		return axios.get(url).then(res => {
			let result = ''
			if(success(res.status)) {
				result = res.data.lrc ? res.data.lrc.lyric : ''
			}
			return result
		})
	}

	const url = '/api/lyric'
	const data = Object.assign({}, commonParams, {
		songmid: mid,
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0,
		categoryId: 10000000,
		pcachetime: +new Date(),
		format: 'json'
	})

	return axios.get(url, {
		params: data
	}).then(res => {
		if(success(res.data.code)) {
			return Base64.decode(res.data.lyric)
		} 
		return ''
	})
}

// 检查歌曲是否可播放
export function checkSong(id) {
	const url = HOST + `/check/music?id=${id}`
	return axios.get(url).then(res => {
		return {
			success: res.data.success
		}
	}).catch(() => {
		return {
			success: false
		}
	})
}

// 喜欢/取消 歌曲
export function favoriteSong(id, status) {
	const url = HOST + `/like?id=${id}&like=${status}`
	return axios.get(url)
}

// 获取QQ音乐的歌曲url
export function getSongUrl(song) {
	return getSongsUrl([song]).then(res => {
		if(res && Array.isArray(res)) {
			return res[0]
		}
		return null
	})
}

// 获取QQ音乐的歌曲数组的url
export function getSongsUrl(songs) {
	const url = '/api/getPurlUrl'

	let mids = []
	let types = []

	songs.forEach((song) => {
		mids.push(song.mid)
		types.push(0)
	})

	const urlMid = genUrlMid(mids, types)

	const data = Object.assign({}, commonParams, {
		g_tk: 5381,
		format: 'json',
		platform: 'h5',
		needNewCode: 1,
		uin: 0
	})

	return new Promise((resolve, reject) => {
		let tryTime = 3

		function request() {
			return axios.post(url, {
				comm: data,
				url_mid: urlMid
			}).then((response) => {
				const res = response.data
				if (res.code === ERR_OK) {
				let urlMid = res.url_mid
				if (urlMid && urlMid.code === ERR_OK) {
					const info = urlMid.data.midurlinfo[0]
					if (info && info.purl) {
						const urls = urlMid.data.midurlinfo.map(i => i.purl)
						resolve(urls)
					} else {
						retry()
					}
				} else {
					retry()
				}
				} else {
					retry()
				}
			})
		}

		function retry() {
			if (--tryTime >= 0) {
				request()
			} else {
				reject(new Error('Can not get the songs url'))
			}
		}

		request()
	})
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: "CgiGetVkey",
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
