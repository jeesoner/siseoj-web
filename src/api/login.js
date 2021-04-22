import request from '@/api/http'

// 获取验证码API
export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}

// 用户注册API
export function register(data) {
  return request({
    url: 'auth/register',
    method: 'post',
    data
  })
}

// 用户登录API
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

// 用户登出API
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
