import Vue from 'vue'
import App from './App'
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
import axios from 'axios'
axios.defaults.withCredentials = true

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


new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
