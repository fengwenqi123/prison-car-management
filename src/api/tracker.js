import request from '@/utils/request'
// import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, keyword, mapId) {
  return request({
    url: 'visitorInfo/',
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
