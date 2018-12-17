import { HOST } from './config'
import axios from 'axios'
import { success } from './shared'
import { getSongs } from 'common/js/song' 

export function getAlbumPicUrl(id) {
    const url = HOST + `/album?id=${id}`
    return axios.get(url).then(res => {
        let picUrl = ''
        if(success(res.status)) {
            picUrl = res.data.album.picUrl
        }
        return picUrl
    })
}

export function getAlbumDetail(id) {
    const url = HOST + `/album?id=${id}`
    return axios.get(url).then(res => {
        let result = ''
        if(success(res.status)) {
            result = getSongs(res.data.songs)
        }
        return result
    })
}