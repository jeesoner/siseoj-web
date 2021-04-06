import request from '@/api/http'

// 提交评测API
export function submit(data) {
  return request({
    url: '/submit-problem-judge',
    method: 'post',
    data
  })
}

// 获取所有的评测结果
export function getSubmissions(params) {
  return request({
    url: '/submissions',
    method: 'get',
    params
  })
}

// 检查指定id的评测状态
export function checkSubmission(data) {
  return request({
    url: '/check-submissions-status',
    method: 'post',
    data
  })
}

export default { submit, getSubmissions, checkSubmission }
