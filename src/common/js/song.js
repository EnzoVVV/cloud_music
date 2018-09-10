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
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    })
}
  
function getSinger(singer) {
    if (!singer) {
      return ''
    }
    let singerNames = singer.map(singer => singer.name)
    return singerNames.join('/')
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
  
  