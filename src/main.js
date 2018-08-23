// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 用于兼容ES6
import 'babel-polyfill'
import 'common/stylus/index.styl'

import VueIconFont from 'vue-icon-font'
Vue.use(VueIconFont)

import 'iconfont/iconfont.js'
import IconSvg from 'components/IconSvg/IconSvg'
Vue.component('IconSvg',IconSvg)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
