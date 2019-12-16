import request from '@/utils/request'
// import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, addTimeMinString, addTimeMaxString, idCard, keyword, status) {
  return request({
    url: '/visitorHistoryInfo/',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      addTimeMinString,
      addTimeMaxString,
      idCard,
      keyword,
      status
    }
  })
}

export function getCar(pageNum, pageSize, order, sort, addTimeMinString, addTimeMaxString, idCard, status, keyword) {
  return request({
    url: '/visitorInfo/',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      order,
      sort,
      addTimeMinString,
      addTimeMaxString,
      idCard,
      status, keyword
    }
  })
}
