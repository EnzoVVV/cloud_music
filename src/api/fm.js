import axios from 'axios'
import { HOST } from './config'
import { success } from './shared'
import { getSongs } from 'common/js/song'


// 获取私人FM数据
export function getPersonalFM() {
    const date = new Date()
    const url = HOST + `/personal_fm?timestamp=${date}`
    return axios.get(url).then(res => {
        let result = []
        if(success(res.status)) {
            result = getSongs(res.data.data)
        }
        return result
    })
}