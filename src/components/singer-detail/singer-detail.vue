<template>
	<transition name="slide">
		<musiclist :songs="songs" :albums='albums' :singer='singer'></musiclist>
	</transition>
</template>

<script>
	import { mapGetters } from "vuex";
	import { getSingerDetail } from "api/singer";
	import { ERR_OK } from "api/config";
	import { createSong, createAlbum, processSongsUrl } from "common/js/song";
	import musiclist from "components/music-list/music-list";

	export default {
		name: "singerdetail",
		components: {
			musiclist
		},
		data() {
			return {
				songs: [],
				albums: []
			};
		},
		computed: {
			...mapGetters(["singer"])
		},
		methods: {
			check() {
				// 在歌手详情页刷新时，没有设置singer的vuex信息，所以需要回退到singer列表页
				if(!this.singer || !this.singer.id) {
					this.$router.push('/music/singer')
					return
				}
			},
			getSingerDetails() {
				let self = this
				getSingerDetail(this.singer.id).then(res => {
					if (res.code === ERR_OK) {
						processSongsUrl(self.getSongs(res.data.list)).then((songs) => {
							self.songs = songs
						})
						// TODO
						self.albums = self.getAlbums(res.data.albumlist)
					}
				})

			},
			getSongs(list) {
				if(!list) {
					return []
				}
				return list.map(item => createSong(item.musicData))
			},
			getAlbums(list) {
				if(!list) {
					return []
				}
				return list.map(item => createAlbum(item))
			}
		},
		created() {
			this.check()
			this.getSingerDetails()
		}
	};
</script>

<style lang='stylus' scoped>
	@import '~common/stylus/variable'
	.singer-detail
		position: fixed
		top: 0
		left: 0
		right: 0
		bottom: 0
		z-index: 100
		background: $color-background
	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
</style>