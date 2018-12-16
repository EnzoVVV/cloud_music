export default class Singer {
    constructor({id,mid,name,picUrl,alias}) {
        this.id = id
        this.mid = mid
        this.name = name
        this.picUrl = picUrl || `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
        this.alias = alias
    }
}