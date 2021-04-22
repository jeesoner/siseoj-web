import request from '@/api/http'

export function getContests(params) {
  return request({
    url: 'contests',
    method: 'get',
    params
  })
}

/**
 * 获取指定的比赛信息
 */
export function getContest(id) {
  return request({
    url: `contests/${id}`,
    method: 'get'
  })
}

/**
 * 获取题目列表
 */
export function getContestProblemList(contestId) {
  return request({
    url: `contests/${contestId}/problems`,
    method: 'get'
  })
}

/**
 * 获取比赛题目详细信息
 */
export function getProblemDetails(cid, displayId) {
  return request({
    url: `contests/${cid}/problems?displayId=${displayId}`,
    method: 'get'
  })
}

/**
 * 获取比赛评测记录
 */
export function getContestSubmissions(cid, params) {
  return request({
    url: `contests/${cid}/submissions`,
    method: 'get',
    params
  })
}

/**
 * 获取普通比赛的排名
 */
export function getContestRank(cid, params) {
  return request({
    url: `contests/${cid}/rank`,
    method: 'get',
    params
  })
}

// 注册私有比赛权限
export function registerContest(cid, password) {
  return request({
    url: 'contests/register',
    method: 'post',
    data: {
      cid,
      password
    }
  })
}

// 获取注册比赛权限
export function getContestAccess(cid) {
  return request({
    url: 'contests/access',
    method: 'get',
    params: { cid }
  })
}

export default { getContests, getContest, getContestProblemList, getProblemDetails, getContestSubmissions, getContestRank,
  registerContest, getContestAccess }

