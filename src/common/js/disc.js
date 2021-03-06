export default class Disc {
    constructor({id, name, songList, picUrl, creator}) {
        this.id = id
        this.name = name
        this.songList = songList
        this.picUrl = picUrl
        this.creator = creator
    }
    addSong(song) {
        if(!this.songList.find(i => i.id === song.id)) {
            this.songList.push(song)
        }
    }
    setName(name) {
        this.name = name
    }
    setImg(newPicUrl) {
        this.picUrl = newPicUrl
    }
}

let id = new Date() * 1000
const defaultDiscImg = 'static/images/default-bg.png'

export function createDisc(discData) {
    return new Disc({
        id: discData.id || id++,
        name: discData.name || '未命名歌单',
        songList: discData.songList || [],
        picUrl: discData.picUrl || defaultDiscImg,
        creator: discData.creator
    })
}

export const defaultDiscs = [
    // 默认的“我喜欢的音乐”歌单id为1
    createDisc({
        id: 1,
        name: '我喜欢的音乐',
        creator: {
            name: 'self'
        }
    })
]