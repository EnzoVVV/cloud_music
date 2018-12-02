import { HOST } from './config'
import axios from 'axios'

export function getVideo(limit = 80) {
    const url = HOST + `/mv/first?limit=${limit}`
    return axios.get(url)
}

export function getVideoDetail(id) {
    const url = HOST + `/mv/detail?mvid=${id}`
    return axios.get(url)
}