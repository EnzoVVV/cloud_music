// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 用于兼容ES6
import 'babel-polyfill'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'
import VueIconFont from 'vue-icon-font'
import 'iconfont/iconfont.js'
import IconSvg from 'base/IconSvg/IconSvg'
import IconImg from 'base/IconImg/IconImg'
import loading from 'base/loading/loading'
import VueBus from 'vue-bus'
import { UV_UDP_REUSEADDR } from 'constants';

fastclick.attach(document.body)

Vue.use(VueIconFont)
Vue.use(lazyload, {
  loading: require('common/image/loading.png')
})
Vue.use(VueBus)

Vue.component('IconSvg',IconSvg)
Vue.component('IconImg',IconImg)
Vue.component('loading', loading)

window.useCloud = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
