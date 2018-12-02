import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import { ERR_OK } from 'api/config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options).then(res => {
        if(res.code === ERR_OK) {
            let result = res.data.topList.map(list => {
                return {
                    id: list.id,
                    listenCount: list.listenCount,
                    picUrl: list.picUrl,
                    songList: list.songList.map(song => { return {name: song.songname, singer: song.singername}}),
                    title: list.topTitle,
                    type: list.type
                }
            })
            return result
        } else {
            return []
        }
  })
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}