import Vue from 'vue'
import Router from 'vue-router'

import index from '@/page/index.vue'
import login from '@/page/login/login.vue'
import register from '@/page/register/register.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    }
  ]
})
