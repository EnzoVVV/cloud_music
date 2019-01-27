<template>
  <div id="app">
    <portal></portal>
    <player></player>
  </div>
</template>

<script>
/* eslint-disable no-new */
import player from 'components/player/player'
import portal from 'components/portal/portal'
import { login } from 'api/login'
export default {
  name: 'App',
  components: {
    player,
    portal
  },
  created() {
    login()
  }
}
</script>

