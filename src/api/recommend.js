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
  // return new Promise((resolve,reject) => {
  //   let array = []
  //   let result = {
  //     code: 0,
  //     data: {
  //       list: array
  //     }
  //   }
  //   for(let i=0;i<24;i++) {
  //     array.push({
  //       imgurl: '',
  //       dissname: '日系 | 一调静谧的温暖，一曲细腻的厚重',
  //       listennum: '15万',
  //       dissid: i
  //     })
  //   }
  //   resolve(result)
  // })
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
