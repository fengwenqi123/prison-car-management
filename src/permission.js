/* eslint-disable object-curly-spacing,block-spacing */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import {TokenKey} from '@/utils/auth' // 验权

const token = new TokenKey()
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (token.getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done()
    } else {
      try {
        if (store.getters.roles.length > 0) {
          await store.dispatch('GetInfo')
          next()
        } else {
          const userInfo = await store.dispatch('GetInfo')
          const roles = userInfo.data.authorizeSet
          store.dispatch('GenerateRoutes', {roles})
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({...to, replace: true})
        }
      } catch (error) {
        await store.dispatch('FedLogOut')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
