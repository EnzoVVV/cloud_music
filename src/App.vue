<template>
  <div id="app">
    <portal></portal>
    <!-- <Header></Header> -->
    <!-- <keep-alive>
      <router-view ></router-view>
    </keep-alive> -->
    <player></player>
  </div>
</template>

<script>
/* eslint-disable no-new */
import Header from 'components/header/header'
import player from 'components/player/player'
import portal from 'components/portal/portal'
export default {
  name: 'App',
  components: {
    Header,
    player,
    portal
  }
}
</script>

