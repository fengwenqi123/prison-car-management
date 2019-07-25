import request from '@/utils/request'
// import qs from 'qs'

export function lists(pageNum, pageSize, order, sort, addTimeMinString, addTimeMaxString, idCard, keyword) {
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
      keyword
    }
  })
}
