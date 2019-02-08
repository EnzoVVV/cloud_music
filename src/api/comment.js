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

// 评论点赞, id: 资源id, cid: 评论id, status: 点赞状态，type: 资源类型
export function likeComment(id, cid, status, type) {
    const typeCode = typeCodeMapping[type]
    const code = status ? 1 : 0
    const url = HOST + `/comment/like?id=${id}&cid=${cid}&t=${code}&type=${typeCode}`
    return axios.get(url)
}

const typeCodeMapping = {
    song: 0,
    mv: 1,
    disc: 2,
    album: 3
}

const typeNameMapping = {
    song: 'music',
    disc: 'playlist',
    album: 'album',
    mv: 'mv'
}