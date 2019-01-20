import { HOST } from './config'
import axios from 'axios'
import { success } from './shared'

import { formatTimestamp } from 'common/js/tools'

function getCommentUserData(user) {
    return {
        userName: user.nickname,
        userId: user.userId,
        picUrl: user.avatarUrl
    }
}

function getCommentData(comments) {
    let result = comments.map(item => {
        return {
            id: item.commentId,
            content: item.content,
            time: formatTimestamp(item.time),
            liked: item.liked,
            likedCount: item.likedCount,
            user: getCommentUserData(item.user),
            reply: item.beReplied.map(i => {
                return {
                    content: i.content,
                    user: getCommentUserData(i.user)
                }
            })
        }
    })
    return result
}

export function getComment(id, offset, type) {
    const typeName = typeNameMapping[type]
    const url = HOST + `/comment/${typeName}?id=${id}&offset=${offset}&limit=20`
    return axios.get(url).then(res => {
        let result = {}
        if(success(res.status)) {
            const data = res.data
            result.hasMore = data.more
            result.total = data.total
            result.comments = getCommentData(data.comments)
        }
        return result
    })
}

export function getHotComment(id, type) {
    const typeCode = typeCodeMapping[type]
    const url = HOST + `/comment/hot?id=${id}&type=${typeCode}`
    return axios.get(url).then(res => {
        let result = {}
        if(success(res.status)) {
            const data = res.data
            result.hasMore = data.hasMore
            result.total = data.total
            result.comments = getCommentData(data.hotComments)
        }
        return result
    })
}


const typeCodeMapping = {
    song: 0,
    disc: 2,
    album: 3
}

const typeNameMapping = {
    song: 'music',
    disc: 'playlist',
    album: 'album'
}