<template>
	<transition name='slide'>
		<musiclist :songs='songs' :albums='albums' :singer='singer' :brief='brief' @goback='goback'></musiclist>
	</transition>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { getSingerDetail } from 'api/singer'
	import { ERR_OK } from 'api/config'
	import { createSong, createAlbum, processSongsUrl } from 'common/js/song'
	import musiclist from 'components/music-list/music-list'

	export default {
		name: 'singerdetail',
		components: {
			musiclist
		},
		props: {
		},
		data() {
			return {
				songs: [],
				albums: [],
				brief: ''
			};
		},
		computed: {
			...mapGetters(['singer'])
		},
		methods: {
			check() {
				// 在歌手详情页刷新时，没有设置singer的vuex信息，所以需要回退到singer列表页
				if(!this.singer || !this.singer.id) {
					this.goback()
				}
			},
			goback() {
				this.$emit('back')
			},
			getSingerDetails() {
				let self = this
				getSingerDetail(this.singer.id).then(({songs, brief}) => {
				// getSingerDetail(this.singer.id).then(([{songs, brief}, albums]) => {
					self.songs = songs
					self.brief = brief
				})
			}
		},
		created() {
			this.check()
			this.getSingerDetails()
		},
		mounted() {
			this.$emit('mountedCalled')
		}
	};
</script>

<style lang='stylus' scoped>
	@import '~common/stylus/variable'
	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
</style>