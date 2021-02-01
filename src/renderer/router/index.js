import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: { name: 'index' },
      component: () => import(/* webpackChunkName: 'index'*/'@/layouts/default'),
      children: [
        {
          path: "/index",
          name: "index",
          meta: { keepAlive: true },
          component: () => import("@/views/index")
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})