import request from '@/utils/request'
import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, keyword, irradiationArea) {
  return request({
    url: 'videoDevice/devices',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      keyword,
      irradiationArea
    }
  })
}

export function add(form) {
  const data = qs.stringify(form)
  return request({
    url: '/videoDevice/save',
    method: 'POST',
    data
  })
}

export function delt(id) {
  const data = qs.stringify({
    'id': id.join(',')
  })
  return request.put('/videoDevice/remove', data)
}
