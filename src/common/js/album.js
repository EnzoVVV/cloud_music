import { formatTimestamp } from 'common/js/tools'
export default class Album {
    constructor({id,name,picUrl,date,type}) {
        this.id = id
        this.name = name
        this.picUrl = picUrl
        this.date = date
        this.type = type
    }
}

export function getAlbums(list) {
    return list.map(item => {
        return new Album({
            id: item.id,
            name: item.name,
            picUrl: item.picUrl,
            date: formatTimestamp(item.publishTime),
            type: item.subType
        })
    })
}
