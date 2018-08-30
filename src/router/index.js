import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import music from 'components/music/music'
import singer from 'components/singer/singer'
import radio from 'components/radio/radio'
import mine from 'components/mine/mine'
import video from 'components/video/video'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/music'
    },
    {
      path: '/music',
      component: music,
      redirect: '/music/recommend',
      children: [
        {
          path: '/music/recommend',
          component: recommend
        },
        {
          path: '/music/singer',
          component: singer
        },
        {
          path: '/music/radio',
          component: radio
        }
      ]
    },
    {
      path: '/mine',
      component: mine
    },
    {
      path: '/video',
      component: video
    }
  ]
})
