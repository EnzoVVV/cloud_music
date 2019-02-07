import { ERR_FREE, ERR_OK } from './config'
export const success = function(status) {
	if(window.useCloud) {
		return status === ERR_FREE
	} else {
		return status === ERR_OK
	}
}

import axios from 'axios'
import { formatTimestamp } from 'common/js/tools'
import { getSong } from 'common/js/song'

export function getEvents(url) {
	return axios.get(url).then(res => {
		let result = []
		if(success(res.status)) {
			const events = res.data.event || res.data.events
			result = events.map(event => {
				const json = JSON.parse(event.json)
				const pics = event.pics.map(pic => pic.originUrl)
				const user = event.user
				const sharedObj = {
					id: event.id,
					msg: json.msg,
					pics: pics,
					user: {
						id: user.userId,
						name: user.nickname,
						picUrl: user.avatarUrl,
						followed: user.followed
					},
					time: formatTimestamp(event.eventTime)
				}
				if(event.type == 18) {
					return Object.assign(sharedObj, {
						song: getSong(json.song)
					})
				} else if(event.type == 22) {
					// 转发
				}
			})
		}
		return result
	})
}


export function getGender(code) {
    return code == 1 ? 'boy' : 'girl'
}