/* eslint-disable object-curly-spacing */
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const mapView = {
  path: '/map',
  component: Layout,
  redirect: '/map/mapView',
  name: 'map',
  alwaysShow: true,
  hidden: true,
  meta: {title: '地图', icon: 'xtgl1', roles: ['sys']},
  children: [{
    path: 'mapView',
    name: 'mapView',
    hidden: true,
    component: () => import('@/views/map/map'),
    meta: {title: '监区地图', roles: ['sys:authorize']}
  }
  ]
}

export default mapView
