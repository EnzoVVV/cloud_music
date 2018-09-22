<template>
  <div id="app" @touchmove.prevent>
    <Header></Header>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
/* eslint-disable no-new */
import Header from 'components/header/header'
import player from 'components/player/player'
export default {
  name: 'App',
  components: {
    Header,
    player
  }
}
</script>

