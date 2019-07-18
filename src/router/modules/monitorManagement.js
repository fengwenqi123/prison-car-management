/* eslint-disable object-curly-spacing */
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const monitor = {
  path: '/monitor',
  component: Layout,
  redirect: '/monitor/monitorManagement',
  name: 'monitor',
  alwaysShow: true,
  meta: {title: '监控管理', icon: 'xtgl1', roles: ['sys']},
  children: [{
    path: 'monitorManagement',
    name: 'monitorManagement',
    component: () => import('@/views/monitorManagement/index'),
    meta: {title: '监控设备', roles: ['sys:authorize']}
  }
  ]
}

export default monitor
