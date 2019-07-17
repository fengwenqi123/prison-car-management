import request from '@/utils/request'

export function modify(accessToken, password, newPassword) {
  return request({
    url: 'login/user/updatePassword',
    method: 'GET',
    params: {
      accessToken,
      password,
      newPassword
    }
  })
}
