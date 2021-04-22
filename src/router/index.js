import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import store from '@/store'
import { Notification } from 'element-ui'
import { constantRoutes } from '@/router/routes'
import { getPageTitle } from '@/utils'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    // 如果已经登录，跳转到主页
    if (to.path === '/login') {
      next({ path: '/' })
    }
    next()
  } else {
    // 如果该页面需要登录，则跳转到登录页面
    if (to.meta.requireAuth) {
      Notification.warning({
        title: '提示',
        message: '请先登录，才能访问该页面',
        duration: 3000
      })
      next({ name: 'Login' })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

sync(store, router)

export default router
