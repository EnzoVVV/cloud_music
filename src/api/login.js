

import { HOST } from './config'
import axios from 'axios'
import { success } from './shared'

export function login() {
    const url = HOST + `/login/cellphone?phone=18123683717&password=cloudtest`
    return axios.get(url)
}



export function loginStatus() {
    const url = HOST + '/login/status'
    return axios.get(url).then(res => {
        if(success(res.status)) {
            const profile = res.data.profile
            return {
                id: profile.userId,
                name: profile.nickname,
                picUrl: profile.avatarUrl
            }
        }
        return null
    })
}