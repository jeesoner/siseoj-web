import service from '@/api/http'

export function getPage(params) {
  return service({
    url: 'problems',
    method: 'get',
    params
  })
}

export function get(id) {
  return service({
    url: 'problems/' + id,
    method: 'get'
  })
}

export default { getPage, get }
