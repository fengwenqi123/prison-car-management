/* eslint-disable object-curly-spacing */
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const screen = {
  path: '/screen',
  component: Layout,
  redirect: '/screen/screenList',
  name: 'screen',
  hidden: true,
  meta: {title: '多屏显示', icon: 'xtgl1', roles: ['sys']},
  children: [{
    path: 'screenList',
    name: 'screenList',
    hidden: true,
    component: () => import('@/views/screen/index'),
    meta: {title: '多屏显示', roles: ['sys:authorize']}
  }
  ]
}

export default screen
