import { HOST } from './config'
import axios from 'axios'
import { success } from './shared'
import { getSingerDetail } from './singer'

export function getVideo(limit = 10) {
    const url = HOST + `/mv/first?limit=${limit}`
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            result = res.data.data.map(item => {
                // TODO, 增加liked
                return {
                    id: item.id,
                    name: item.name,
                    artists: item.artists.map(artist => {
                        return {
                            id: artist.id,
                            name: artist.name
                        }
                    }),
                    picUrl: item.cover,
                    artistName: item.artistName,
                    playCount: item.playCount,
                    liked: item.subed
                }
            })
        }
        return result
    })
}

export function getRecommendMV() {
    const url = HOST + '/personalized/mv'
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            result = res.data.result.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    artists: item.artists.map(artist => {
                        return {
                            id: artist.id,
                            name: artist.name
                        }
                    }),
                    picUrl: item.picUrl,
                    artistName: item.artistName,
                    playCount: item.playCount,
                    liked: item.subed
                }
            })
        }
        return result
    })
}

export function getVideoDetail(id) {
    const url = HOST + `/mv/detail?mvid=${id}`
    return axios.get(url).then(res => {
        let result = ''
        if(success(res.status)) {
            result = res.data.data.brs[1080]
        }
        return result
    })
}

export function getVideoArtistDetail(id) {
    return getSingerDetail(id).then(res => {
        return res.picUrl
    })
}

export function getMVAddress(id) {
    const url = HOST + `/mv/url?id=${id}`
    return axios.get(url).then(res => {
        let result = ''
        if(success(res.status)) {
            result = res.data.data.url
        }
        return result
    })
}


export function likeVideo(id, status) {
    const code = status ? 1 : 0
    const url = HOST + `/resource/like?t=${code}&type=1&id=${id}`
	return axios.get(url)
}