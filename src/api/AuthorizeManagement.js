import request from '@/utils/request'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, status, keyword) {
  return request({
    url: '/authorize',
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
    url: '/authorize',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/authorize/remove', data)
}

export function enable(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/authorize/enable', data)
}

export function disable(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/authorize/disable', data)
}

export function findAuthorize() {
  return request({
    url: '/authorize',
    method: 'GET',
    params: {
      'pageNum': 1,
      'pageSize': 5000,
      'order': 'layer',
      'status': 1
    }
  })
}
