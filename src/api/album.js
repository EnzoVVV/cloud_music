import { HOST } from './config'
import axios from 'axios'
import { success } from './shared'

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