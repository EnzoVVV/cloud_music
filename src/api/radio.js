import { HOST } from './config'
import axios from 'axios'

export function getBanner() {
    const url = HOST + `/mv/first?limit=80`
    return axios.get(url)
}
