

import { HOST } from './config'
import axios from 'axios'

export function login() {
    const url = HOST + `/login/cellphone?phone=18123683717&password=cloudtest`
    return axios.get(url)
}



export function loginStatus() {
    const url = HOST + '/login/status'
    return axios.get(url)
}