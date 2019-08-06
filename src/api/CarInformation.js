import request from '@/utils/request'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, status, keyword) {
  return request({
    url: 'visitorInfo/',
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
    url: '/visitorInfo',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('visitorInfo/remove', data)
}

export function line(pageNum, pageSize, order, sort, mapId, status, keyword) {
  return request({
    url: 'line/',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      mapId,
      status,
      keyword
    }
  })
}

export function out(id) {
  return request({
    url: 'visitorInfo/end',
    method: 'PUT',
    params: {
      id
    }
  })
}

export function playback(id) {
  return request({
    url: 'visitorHistoryInfo/playback',
    method: 'GET',
    params: {
      id
    }
  })
}
