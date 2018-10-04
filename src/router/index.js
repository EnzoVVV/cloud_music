import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import music from 'components/music/music'
import singer from 'components/singer/singer'
import radio from 'components/radio/radio'
import mine from 'components/mine/mine'
import video from 'components/video/video'
import singerdetail from 'components/singer-detail/singer-detail'
import portal from 'components/portal/portal'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: portal
    },
    {
      path: '/singerdetail/:name',
      component: singerdetail
    }
  ]
})
