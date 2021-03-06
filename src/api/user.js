import { HOST } from './config'
import { success, getEvents, getGender } from './shared'
import axios from 'axios'
import { formatTimestamp } from 'common/js/tools'
import { getSong } from 'common/js/song'


export function getUserInfo(id) {
    const date = new Date()
    const url = HOST + `/user/detail?uid=${id}&timestamp=${date}`
    return axios.get(url).then(res => {
        let result = {}
        if(success(res.status)) {
            const data = res.data
            const profile = res.data.profile
            result = {
                id: id,
                name: profile.nickname,
                signature: profile.signature,
                picUrl: profile.avatarUrl,
                bgUrl: profile.backgroundUrl,
                birthday: formatTimestamp(profile.birthday),
                gender: getGender(profile.gender),
                followed: profile.followed,
                followings: profile.follows,
                followers: profile.followeds,
                eventCount: profile.eventCount,
                playlistCount: profile.playlistCount,
                playlistBeSubscribedCount: profile.playlistBeSubscribedCount,
                level: data.level,
                listenSongs: data.listenSongs
            }
        }
        return result
    })
}


export function getUserPlaylist(id) {
    const url = HOST + `/user/playlist?uid=${id}`
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            result = res.data.playlist.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    picUrl: item.coverImgUrl,
                    trackCount: item.trackCount,
                    playCount: item.playCount,
                    subscribedCount: item.subscribedCount,
                    creator: {
                        id: item.creator.userId
                    }
                }
            })  
        }
        return result
    })
}

export function getUserEvent(id) {
    const url = HOST + `/user/event?uid=${id}`
    return getEvents(url)
}

export function getUserRecord(id, type) {
    const url = HOST + `/user/record?uid=${id}&type=${type}`
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            const data = type == 0 ? res.data.allData : res.data.weekData
            result = data.map(item => {
                return getSong(item.song)
            })
        }
        return result
    }).catch(() => {
        return false
    })
}

export function getUserFollowing(id, offset) {
    const url = HOST + `/user/follows?uid=${id}&offset=${offset}&limit=30`
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            if(res.data && res.data.follow) {
                result = res.data.follow.map(item => getFollowData(item))
            }
        }
        return result
    })
}

export function getUserFollower(id, offset) {
    const url = HOST + `/user/followeds?uid=${id}&offset=${offset}&limit=30`
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            if(res.data && res.data.follow) {
                debugger
            }
        }
        return result
    })
}

function getFollowData(item) {
    return {
        id: item.userId,
        name: item.nickname,
        picUrl: item.avatarUrl,
        gender: getGender(item.gender),
        signature: item.signature
    }
}

// 关注用户
export function followUser(id, status) {
    const code = status ? 1 : 2
    const date = new Date()
    const url = HOST + `/follow?id=${id}&t=${code}&timestamp=${date}`
    return axios.get(url)
}