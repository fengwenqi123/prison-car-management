/* eslint-disable object-curly-spacing */
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const car = {
  path: '/car',
  component: Layout,
  redirect: '/car/carInformation',
  name: 'car',
  alwaysShow: true,
  meta: {title: '车辆登记管理', icon: 'xtgl1', roles: ['sys']},
  children: [{
    path: 'carInformation',
    name: 'carInformation',
    component: () => import('@/views/carInformation/index'),
    meta: {title: '车辆信息登记', roles: ['sys:authorize']}
  },
  {
    path: 'historicalManagement',
    name: 'historicalManagement',
    component: () => import('@/views/historicalManagement/index'),
    meta: {title: '车辆历史信息', roles: ['sys:authorize']}

  },
  {
    path: 'trackerManagement',
    name: 'trackerManagement',
    component: () => import('@/views/trackerManagement/index'),
    meta: {title: '追踪器管理', roles: ['sys:role']}
  },
  {
    path: 'playBack/:id',
    name: 'playBack',
    hidden: true,
    component: () => import('@/views/playBack/index'),
    meta: {title: '轨迹回放', roles: ['sys:authorize']}
  }
  ]
}

export default car
