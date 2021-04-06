import request from '@/api/http'

export function getAllTag() {
  return request({
    url: 'tags/all',
    method: 'get'
  })
}

export default { getAllTag }
