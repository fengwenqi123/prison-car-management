/* eslint-disable object-curly-spacing */
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const system = {
  path: '/setting',
  component: Layout,
  redirect: '/setting/AuthorizeManagement',
  name: 'setting',
  alwaysShow: true,
  meta: {title: '系统管理', icon: 'xtgl1', roles: ['sys']},
  children: [{
    path: 'AuthorizeManagement',
    name: 'AuthorizeManagement',
    component: () => import('@/views/AuthorizeManagement/index'),
    meta: {title: '权限管理', roles: ['sys:authorize']}
  },
  {
    path: 'AddAuthorize',
    name: 'AddAuthorize',
    component: () => import('@/views/AuthorizeManagement/addChildren'),
    meta: {title: '权限管理'},
    hidden: true
  },
  {
    path: 'RoleManagement',
    name: 'RoleManagement',
    component: () => import('@/views/RoleManagement/index'),
    meta: {title: '角色管理', roles: ['sys:role']}
  },
  {
    path: 'AddRole',
    name: 'AddRole',
    component: () => import('@/views/RoleManagement/addChildren'),
    meta: {title: '角色管理'},
    hidden: true
  },
  {
    path: 'DepManagement',
    name: 'DepManagement',
    component: () => import('@/views/DepManagement/index'),
    meta: {title: '部门管理', roles: ['sys:department']}
  },
  {
    path: 'AddDepartment',
    name: 'AddDepartment',
    component: () => import('@/views/DepManagement/addChildren'),
    meta: {title: '部门管理'},
    hidden: true
  },
  {
    path: 'DicManagement',
    name: 'DicManagement',
    component: () => import('@/views/DicManagement/index'),
    meta: {title: '系统字典管理', roles: ['sys:dictionary']}
  },
  {
    path: 'AddDictionary',
    name: 'AddDictionary',
    component: () => import('@/views/DicManagement/addChildren'),
    meta: {title: '系统字典管理'},
    hidden: true
  },
  {
    path: 'UserManagement',
    name: 'UserManagement',
    component: () => import('@/views/UserManagement/index'),
    meta: {title: '用户管理', roles: ['sys:personnel']}
  },
  {
    path: 'AddUser',
    name: 'AddUser',
    component: () => import('@/views/UserManagement/addChildren'),
    meta: {title: '用户管理'},
    hidden: true
  }
  ]
}

export default system
