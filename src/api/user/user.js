import request from '@/api/http'

export function get(uid) {
  return request({
    url: `user`,
    method: 'get',
    params: {
      uid
    }
  })
}

export function update(data) {
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return request({
    url: 'user/update-password',
    method: 'post',
    data
  })
}

export function changeAvatar(data) {
  return request({
    url: 'user/update-avatar',
    method: 'post',
    data
  })
}

export function changeEmail(data) {
  return request({
    url: 'user/update-email',
    method: 'post',
    data
  })
}

export default { get, update, changePassword, changeAvatar, changeEmail }
