export function getRankIdx(rankName) {
    return mapping[rankName]
}

const mapping = {
    '云音乐新歌榜': 0,
    '云音乐热歌榜': 1,
    '网易原创歌曲榜': 2,
    '云音乐飙升榜': 3,
    '云音乐电音榜': 4,
    'UK排行榜周榜': 5,
    '美国Billboard周榜': 6,
    'KTV嗨榜': 7,
    'iTunes榜': 8,
    'Hit FM Top榜': 9,
    '日本Oricon周榜': 10,
    '韩国Melon排行榜周榜': 11,
    '韩国Mnet排行榜周榜': 12,
    '韩国Melon原声周榜': 13,
    '中国TOP排行榜(港台榜)': 14,
    '中国TOP排行榜(内地榜)': 15,
    '香港电台中文歌曲龙虎榜': 16,
    '华语金曲榜': 17,
    '中国嘻哈榜': 18,
    '法国 NRJ EuroHot 30周榜': 19,
    '台湾Hito排行榜': 20,
    'Beatport全球电子舞曲榜': 21,
    '云音乐ACG音乐榜': 22,
    '云音乐嘻哈榜': 23
}