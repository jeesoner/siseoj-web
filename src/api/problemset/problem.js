import request from '@/api/http'

export function getProblems(params) {
  return request({
    url: 'problems',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: `problems/${id}`,
    method: 'get'
  })
}

/**
 * 获取比赛题目详细信息
 */
export function getContestProblemDetails(displayId, cid) {
  return request({
    url: `contests/${cid}/problems/${displayId}`,
    method: 'get'
  })
}

export function getUserProblemStatus(pidList, isContestProblemList, cid) {
  return request({
    url: 'problems/get-user-status',
    method: 'post',
    data: {
      ids: pidList,
      contestProblem: isContestProblemList,
      cid
    }
  })
}

export default { getProblems, get, getContestProblemDetails, getUserProblemStatus }
