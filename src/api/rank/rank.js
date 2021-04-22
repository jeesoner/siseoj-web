import request from '@/api/http'

export function getRank(params) {
  return request({
    url: 'rank',
    method: 'get',
    params
  })
}

export default { getRank }
