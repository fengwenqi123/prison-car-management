/* eslint-disable object-curly-spacing */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'
import system from './modules/system'
import car from './modules/carManagement'
import monitor from './modules/monitorManagement'

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    alwaysShow: true,
    redirect: 'home',
    hidden: true,
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {title: '首页', icon: 'tree', roles: ['cbgl:bgdjcb']},
      hidden: true
    }, {
      path: 'modPassword',
      name: 'modPassword',
      component: () => import('@/views/ModPassword/index.vue'),
      meta: {title: '修改密码', icon: 'tree'},
      hidden: true
    }]
  }
]

export default new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  car,
  system,
  monitor,
  {path: '*', redirect: '/404', hidden: true}
]
