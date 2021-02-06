import service from '@/api/http'

export function getAll() {
  return service({
    url: 'tags/all',
    method: 'get'
  })
}

export default { getAll }
