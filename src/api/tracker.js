import request from '@/utils/request'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, keyword, mapId) {
  return request({
    url: 'positionDevice/',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      keyword,
      mapId
    }
  })
}

export function add(form) {
  const data = qs.stringify(form)
  return request({
    url: 'positionDevice/',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/positionDevice/remove', data)
}
