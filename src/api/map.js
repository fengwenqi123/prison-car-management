import request from '@/utils/request'
import requestNoLoad from '@/utils/requestNoLoad'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, status, keyword, departmentId) {
  return request({
    url: '/map',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      status,
      keyword,
      departmentId
    }
  })
}

export function add(form) {
  const data = qs.stringify(form)
  return request({
    url: '/map',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('map/remove', data)
}

export function enable(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('map/enable', data)
}

export function disable(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('map/disable', data)
}

export function findCarByMapId(mapId) {
  return requestNoLoad({
    url: 'visitorInfo/findListByMapId?time=' + new Date().getTime(),
    method: 'GET',
    params: {
      mapId
    }
  })
}

export function screen() {
  return request({
    url: 'map/splitScreen',
    method: 'GET'
  })
}
