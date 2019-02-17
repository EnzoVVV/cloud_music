<template>
	<transition name='slide'>
		<musiclist :songs='songs' :albums='albums' :singer='singer' :brief='brief' :userId='userId' @goback='goback'></musiclist>
	</transition>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { getSingerDetail } from 'api/singer'
	import { createSong, createAlbum, processSongsUrl } from 'common/js/song'
	import musiclist from 'components/music-list/music-list'

	export default {
		name: 'singerdetail',
		components: {
			musiclist
		},
		data() {
			return {
				songs: [],
				albums: [],
				brief: '',
				userId: null
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
				getSingerDetail(this.singer.id).then(res => {
					this.songs = res.songs
					this.brief = res.brief
					this.userId = res.userId

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