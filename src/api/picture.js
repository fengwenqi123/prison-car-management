import request from '@/utils/request'
// import qs from 'qs'

export function pi() {
//   const data = qs.stringify(form)
  return request({
    url: 'storage/',
    method: 'POST',
    data
  })
}
