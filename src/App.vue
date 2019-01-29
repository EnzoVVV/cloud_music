<template>
  <div id="app">
    <portal></portal>
    <player></player>
  </div>
</template>

<script>
import player from 'components/player/player'
import portal from 'components/portal/portal'
export default {
	name: 'App',
	components: {
		player,
		portal
	}
}
</script>

