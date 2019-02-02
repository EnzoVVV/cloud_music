<template>
	<div class='loading'>
		<img width='24' height='24' src='./loading.gif'>
		<p class='desc'>{{title}}</p>
	</div>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: '正在载入...'
			}
		}
	}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'
	.loading
		position: fixed
		top: 0
		bottom: 0
		width: 100%
		display: flex
		justify-content: center
		align-items: center
		.desc
			line-height: 20px
			font-size: $font-size-small
			color: $color-text-l
</style>
