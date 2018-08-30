<template>
  <div id="app" @touchmove.prevent>
    <Header></Header>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
/* eslint-disable no-new */
import Header from 'components/header/header'
export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

