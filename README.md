# cloud_music
造轮子复刻网易云音乐
网易无版权的歌曲自动切换至QQ曲库
已实现绝大部分功能

# Build
    # 下载项目代码
    git clone https://github.com/EnzoVVV/cloud_music.git
    
    # 安装与打包
    npm run init
    
    # 运行
    npm start
    
    # chrome下按 F12, Ctrl + Shift + M 进入移动端模拟模式

# 已实现功能
* 横滑切换页面, tab跟随移动，或点击tab切换页面
* 播放器: 完善的播放功能, 三种播放模式, 滑动CD切换歌曲配合黑胶针动作，收藏歌曲到歌单，喜欢歌曲，歌曲列表，查看评论，查看歌手
* 迷你播放器: 主播放器收起后，页面底部显示迷你播放器，包含歌曲基本信息，当前歌词，暂停/播放歌曲按钮，歌曲列表
* 完善的收藏系统: 收藏歌曲, 收藏歌手，收藏专辑，收藏歌单，关注用户
* 完善的歌单管理系统: 收藏歌单，快速新建歌单，歌单中添加/删除歌曲，删除歌单，恢复歌单，歌单排序管理
* 无限的页面创建与覆盖系统: 播放器 -> 评论页 -> 用户主页 -> 歌单页 -> 播放器 -> 评论页 ...页面可无限循环，点击播放时播放器提至最前
* 个人页: 管理歌单，个人主页的入口
* 推荐页: 滚动banner，私人FM，每日推荐，排行榜，歌单
* 动态页: 查看分享单曲，点击单曲信息播放歌曲，点击用户头像进入用户主页
* 歌手列表: 展示推荐的歌手列表，列表右侧有快速切换栏
* 歌手页: 展示歌手信息/热门歌曲/专辑/相似歌手，可收藏歌手/查看歌手个人主页
* 视频页: 展示并可播放推荐MV和最新MV
* 左侧菜单栏: 弹出式，可查看个人基本信息，进入个人主页
* 搜索: 包含热门搜索/搜索建议/搜索历史，可搜索单曲/歌手/专辑/歌单/用户
* 评论页: 热门评论，最新评论，可点赞，可点击头像查看用户主页
* 用户主页: 包含用户信息，可查看用户听歌排行，创建的歌单，收藏的歌单，用户动态，可关注用户
* 私人FM: 无限听歌，喜欢歌曲，删除歌曲，查看评论，查看歌手
* 每日推荐: 每日推荐歌曲，每日06:00更新
* 排行榜
* 歌单

# 预览
#### 播放器<br />

###### 播放，暂停
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/player-play.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/player-pause.PNG)

###### 滑动切歌，查看歌手
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/player-switch.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/player-select-singer.PNG)

###### 歌曲列表，歌曲信息
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/player-song-list.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/player-info.PNG)


#### 推荐，个人页<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/recommend.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/mine.PNG)

#### 私人FM，视频页<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/fm.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/video.PNG)

#### 歌手列表，动态页<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/singer-list.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/feeds.PNG)

#### 歌手详情，评论页<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/singer-detail.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/singer-detail-2.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/singer-detail-brief.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/comment.PNG)

#### 个人主页<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/homepage.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/homepage-2.PNG)

#### 排行榜, 榜单详情<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/rank.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/rank-detail.PNG)

#### 歌单推荐, 歌单详情<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/play-list.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/disc-detail.PNG)

#### 搜索页, 搜索建议<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/search.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/search-suggest.PNG)

#### 搜索结果<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/search-result.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/search-result-user.PNG)

#### 每日推荐，歌单详情<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/daily-recommend.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/disc-detail.PNG)

#### 我的收藏<br />
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/collection-album.PNG)
![image](https://github.com/EnzoVVV/configfiles/blob/master/cloud-music/collection-singer.PNG)

# 技术栈
* 开源引用: vue + vuex + stylus + vue-video-player + better-scroll + lyric-parser + good-storage
* 自研多级滑动框架组件，实现多级嵌套页面的横滑切换
* 自研组件动态创建系统，实现无限次创建同一页面，并动态管理层叠顺序覆盖原页面
* 自研hub系统替代vue-router
* 性能优秀, 首屏120ms - 150ms
* api来自[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

# TODO
* 精品歌单页
* 电台
* 聊天
* 动态页：转发，分享视频

# 已知问题
* 无效api: 新建歌单，删除自创歌单的api没有, 只能本地缓存
* 有些MV的地址无效，播放不了
* 关注列表接口无返回数据



