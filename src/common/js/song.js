import { getSongsUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { getLyric } from 'api/song'
import { Base64 } from 'js-base64'

export class Song {
    constructor({id, mid, name, singer, album, duration, img, url}) {
      this.id = id
      this.mid = mid
      this.name = name
      this.singer = singer
      this.album = album
      this.duration = duration
      this.img = img
      this.url = url
    }
    getLyric() {
        if(this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
    }
}
  
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        name: musicData.songname,
        singer: getSinger(musicData.singer),
        album: musicData.albumname,
        duration: musicData.interval,
        img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: musicData.url
    })
}
  
function getSinger(singer) {
    if (!singer) {
      return ''
    }
    let singerNames = singer.map(singer => singer.name)
    return singerNames.join('/')
}

export function processSongsUrl(songs) {
    if (!songs.length) {
      return Promise.resolve(songs)
    }
    return getSongsUrl(songs).then((res) => {
      if (res.code === ERR_OK) {
        let midUrlInfo = res.url_mid.data.midurlinfo
        midUrlInfo.forEach((info, index) => {
          let song = songs[index]
          song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
        })
      }
      return songs
    })
  }

export class Album {
    constructor({id, mid, name, date, img, url}) {
        this.id = id
        this.mid = mid
        this.name = name
        this.date = date
        this.img = img
        this.url = url
    }  
}

export function createAlbum(albumData) {
    return new Album({
        id: albumData.id,
        mid: albumData.albummid,
        name: albumData.name,
        date: albumData.publish_date,
        img: albumData.pic,
        url: albumData.url
    })
}
  
  