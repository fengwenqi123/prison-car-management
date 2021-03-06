import request from '@/utils/request'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, status, keyword) {
  return request({
    url: '/personnel',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      status,
      keyword
    }
  })
}

export function lists1(order, sort, status, departmentId, roleId, keyword) {
  return request({
    url: 'personnel/list',
    method: 'GET',
    params: {
      order,
      sort,
      status,
      departmentId,
      roleId,
      keyword
    }
  })
}

export function watch(id) {
  return request({
    url: 'personnel/' + id,
    method: 'GET'
  })
}

export function add(form) {
  const data = qs.stringify(form)
  return request({
    url: 'personnel',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('personnel/remove', data)
}

export function enable(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('personnel/enable', data)
}

export function disable(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('personnel/disable', data)
}

export function getDepartArr() {
  return request({
    url: 'department',
    method: 'GET',
    params: {
      'order': 'layer',
      'status': 1
    }
  })
}

export function getRoleArr() {
  return request({
    url: '/role',
    method: 'GET',
    params: {
      'pageSize': 5000,
      'status': 1
    }
  })
}

export function resetpassword(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/personnel/passwordReset', data)
}

export function findRoleById(personnelId) {
  return request({
    url: '/role/findListByPersonnel',
    method: 'GET',
    params: {
      personnelId
    }
  })
}

export function findDepById(personnelId) {
  return request({
    url: '/department/findListByPersonnel',
    method: 'GET',
    params: {
      personnelId
    }
  })
}
