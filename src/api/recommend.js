import jsonp from 'common/js/jsonp'
import {commonParams, options, HOST } from './config'
import { success } from './shared'
import axios from 'axios'
import { getSongs } from 'common/js/song'

export function getBanner() {
	if(window.useCloud) {
		const url = HOST + '/banner'
		return axios.get(url).then(res => {
			let result = []
			if(success(res.status)) {
				result = res.data.banners.map(item => {
					return  {
						picUrl: item.imageUrl || item.picUrl,
						url: item.url
					}
				})
			}
			return result
		})
	}

	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		uin: 0,
		needNewCode: 1
	})
	return jsonp(url, data, options).then(res => {
		let result = []
		if(success(res.code)) {
			result = res.data.slider.map(item => {
				return  {
					picUrl: item.picUrl,
					url: item.linkUrl
				}
			})
		}
		return result
	})
}

export function getRecommendList() {
	if(window.useCloud) {
		const url = HOST + '/personalized'
		return axios.get(url).then(res => {
			let result = []
			if(success(res.status)) {
				result = res.data.result.map(item => {
					return  {
						id: item.id,
						name: item.name,
						picUrl: item.picUrl,
						playCount: item.playCount
					}
				})
			}
			return result
		})
	}

	const url = '/api/getDiscList'

	const data = Object.assign({}, commonParams, {
		platform: 'yqq',
		hostUin: 0,
		sin: 0,
		ein: 29,
		sortId: 5,
		needNewCode: 0,
		categoryId: 10000000,
		rnd: Math.random(),
		format: 'json'
	})

	return axios.get(url, {
		params: data
	}).then((res) => {
		let result = []
		if(success(res.data.code)) {
			result = res.data.data.list.map(item => {
				return  {
					id: item.dissid,
					name: item.dissname,
					picUrl: item.imgurl,
					playCount: item.listennum
				}
			})
		}
		return result
	})
}

// 获取每日推荐歌单
export function getDailyRecommend() {
	const url = HOST + '/recommend/songs'
	return axios.get(url).then(res => {
		let result = []
		if(success(res.status)) {
			result = getSongs(res.data.recommend)
		}
		return result
	})
}