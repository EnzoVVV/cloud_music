import { getSongsUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { getLyric } from 'api/song'

export default class Song {
    constructor({id, mid, name, singer, album, picUrl, url, albummid, singerInfo}) {
        this.id = id
        this.mid = mid
        this.name = name
        this.singer = singer
        this.album = album
        this.picUrl = picUrl
        this.url = url
        this.favorite = false
        this.albummid = albummid
        this.singerInfo = singerInfo
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
        albummid: musicData.albummid,
        singerInfo: musicData.singer.map(singer => {
            return {
                id: singer.id,
                picUrl: singer.picUrl,
                name: singer.name
            }
        })
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
        return list.map(item => createSong(getCreateSongData(item)))
    } else {
        return list.map(item => createSong(item.musicData))
    }
}

export function getSong(item) {
    if(!item) {
        return {}
    }
    if(window.useCloud) {
        return createSong(getCreateSongData(item))
    } else {
        return createSong(item.musicData)
    }
}

function getCreateSongData(item) {
    return {
        songid: item.id,
        songname: item.name,
        singer: item.ar || item.artists,
        albumname: item.al ? item.al.name : item.album ? item.album.name : '',
        picUrl: item.al ? item.al.picUrl : item.album ? item.album.picUrl : '',
        url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        albummid: item.al ? item.al.id : item.album ? item.album.id : ''
    }
}

// qq接口，获取歌曲url
export function processSongsUrl(songs) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    return getSongsUrl(songs).then(res => {
        if (res && Array.isArray(res)) {
            res.forEach((url, index) => {
                const song = songs[index]
                song.url = info.purl
                // song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
            })
        }
        return songs
    })
}

export function isValidMusic(musicData) {
    return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

  
  