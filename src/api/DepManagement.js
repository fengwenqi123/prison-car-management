import request from '@/utils/request'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, status, keyword) {
  return request({
    url: 'department',
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

export function add(form) {
  const data = qs.stringify(form)
  return request({
    url: '/department',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/department/remove', data)
}

export function findDep() {
  return request({
    url: '/department',
    method: 'GET',
    params: {
      'pageNum': 1,
      'pageSize': 5000,
      'order': 'layer',
      'sort': '',
      'status': 1
    }
  })
}

export function findDepName(id) {
  return request({
    url: '/department' + id,
    method: 'GET'
  })
}

export function findDepartmentsByPersonnel(personnelId) {
  return request({
    url: '/department/findDepartmentsByPersonnel',
    method: 'GET',
    params: {
      personnelId
    }
  })
}

export function findListByLayer(layer) {
  return request({
    url: '/department/findListByLayer',
    method: 'GET',
    params: {
      layer
    }
  })
}
