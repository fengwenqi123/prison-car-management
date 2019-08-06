/* eslint-disable object-curly-spacing */
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const mapManage = {
  path: '/map',
  component: Layout,
  redirect: '/map/mapManagement',
  name: 'map',
  alwaysShow: true,
  meta: {title: '地图信息管理', icon: 'xtgl1', roles: ['map']},
  children: [
    {
      path: 'mapManagement',
      name: 'mapManagement',
      component: () => import('@/views/mapManagement/index'),
      meta: {title: '地图管理', roles: ['map:management']}
    }
  ]
}

export default mapManage
