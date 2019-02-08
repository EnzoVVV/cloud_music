<template>
	<div id='app'>
		<portal></portal>
		<player></player>
	</div>
</template>

<script>
import player from 'components/player/player'
import portal from 'components/portal/portal'
import { debounce } from 'common/js/tools'
export default {
	name: 'App',
	components: {
		player,
		portal
	},
	methods: {
		resize() {
			const refresh = () => {
				this.$forceUpdate()
			}
			const func = debounce(refresh, 1000)
			func()
		}
	},
	mounted() {
		window.onresize = this.resize
	}
}
</script>

