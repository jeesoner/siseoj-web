import request from '@/api/http'

export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

export function login(username, password, code, uuid) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}
