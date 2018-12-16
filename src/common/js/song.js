import { getSongsUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { getLyric } from 'api/song'

export class Song {
    constructor({id, mid, name, singer, album, picUrl, url, albummid}) {
        this.id = id
        this.mid = mid
        this.name = name
        this.singer = singer
        this.album = album
        this.picUrl = picUrl
        this.url = url
        this.favorite = false
        this.albummid = albummid
    }
    getLyric() {
        if(this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid || this.id).then(res => {
                if (res && res.length) {
                    this.lyric = res
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
    }
    toggleFavoriteStatus() {
        this.favorite = !this.favorite
    }
}
  
export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        name: musicData.songname,
        singer: getSinger(musicData.singer),
        album: musicData.albumname,
        picUrl: window.useCloud ? musicData.picUrl : `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: musicData.url,
        albummid: musicData.albummid
    })
}
  
function getSinger(singer) {
    if (!singer) {
      return ''
    }
    let singerNames = typeof singer == 'sring' ? singer : singer.map(singer => singer.name)
    return singerNames.join('/')
}

// 将服务返回的歌曲列表，生成song类的数组
export function getSongs(list) {
    if(!list) {
        return []
    }
    if(window.useCloud) {
        return list.map(item => createSong({
            songid: item.id,
            songname: item.name,
            singer: item.ar || item.artists,
            albumname: item.al ? item.al.name : item.album ? item.album.name : '',
            picUrl: item.al ? item.al.picUrl : '',
            url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            albummid: item.al ? item.al.id : item.album ? item.album.id : ''
        }))
    } else {
        return list.map(item => createSong(item.musicData))
    }
}


// qq接口，获取歌曲url
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

export function isValidMusic(musicData) {
    return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
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

export function getAlbums(list) {
    if(!list) {
        return []
    }
    return list.map(item => createAlbum(item))
}
  
  