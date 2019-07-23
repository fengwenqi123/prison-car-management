import request from '@/utils/request'
// import qs from 'qs'

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
