import jsonp from 'common/js/jsonp'
import {commonParams, options, HOST} from './config'
import axios from 'axios'

export function getBanner() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getRecommendList() {
  return new Promise((resolve,reject) => {
    let array = []
    let result = {
      code: 0,
      data: array
    }
    for(let i=0;i<6;i++) {
      array.push({
        imgUrl: '',
        discription: '日系 | 一调静谧的温暖，一曲细腻的厚重',
        playCount: '15万',
        id: i
      })
    }
    resolve(result)
  })
}
