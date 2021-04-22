import request from '@/api/http'

export function getDiscuss(params) {
  return request({
    url: 'discuss',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: 'discuss/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'discuss',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'discuss',
    method: 'put',
    data
  })
}

export function del(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'discuss',
    method: 'delete',
    data
  })
}

export default { getDiscuss, get, add, update, del }
