import moment from 'moment'
import api from '@/api/http'
import contestApi from '@/api/contest/contest'
import { CONTEST_STATUS, CONTEST_AUTH } from '@/utils/constants'
import time from '@/utils/time'

const state = {
  now: moment(),
  intoAccess: false, // 私有比赛进入权限
  submitAccess: false, // 保护比赛的提交权限
  forceUpdate: false,
  contest: {
    id: 1,
    title: '测试',
    auth: 1,
    author: 'root',
    type: CONTEST_AUTH.PUBLIC,
    startTime: '2021-03-17 00:00:00',
    endTime: '2021-03-17 00:00:00',
    status: -1
  },
  contestProblems: [],
  itemVisible: {
    table: true,
    chart: true
  }
}

const getters = {
  contestStatus: (state, getters) => {
    return state.contest.status
  },
  contestRuleType: (state, getters) => {
    return state.contest.type
  },
  getIntoAccess: (state, getters) => {
    return state.intoAccess
  },
  isContestAdmin: (state, getters, _, rootGetters) => {
    return rootGetters.isAuthenticated &&
      (state.contest.author === rootGetters.user.username || rootGetters.isSuperAdmin)
  },
  canSubmit: (state, getters) => {
    return state.intoAccess || state.submitAccess || state.contest.type === CONTEST_AUTH.PUBLIC
  },
  contestMenuDisabled: (state, getters) => {
    // 比赛创建者或者超级管理员可以直接查看
    if (getters.isContestAdmin) return false
    // 公开和保护赛可以查看
    if (state.contest.type === CONTEST_AUTH.PUBLIC || state.contest.type === CONTEST_AUTH.PROTECT) {
      // 未开始不可查看
      return getters.contestStatus === CONTEST_STATUS.SCHEDULED
    }
    // 私有赛需要通过验证密码方可查看比赛
    return !state.intoAccess
  },

  // 榜单是否实时刷新
  ContestRealTimePermission: (state, getters, _, rootGetters) => {
    // 比赛若是已结束，便是最后榜单
    if (getters.contestStatus === CONTEST_STATUS.ENDED) {
      return true
    }
    // 比赛管理员直接可看到实时榜单
    if (getters.isContestAdmin) {
      return true
    }
    // 比赛是否开启
    if (state.contest.sealRank === true) {
      // 当前时间在封榜时间之后，即不刷新榜单
      return !now.isAfter(moment(state.contest.sealRankTime))
    } else {
      return true
    }
  },
  problemSubmitDisabled: (state, getters, _, rootGetters) => {
    // 比赛结束不可交题
    if (getters.contestStatus === CONTEST_STATUS.ENDED) {
      return true

      // 比赛未开始不可交题，除非是比赛管理者
    } else if (getters.contestStatus === CONTEST_STATUS.SCHEDULED) {
      return !getters.isContestAdmin
    }
    // 未登录不可交题
    return !rootGetters.isAuthenticated
  },
  // 是否需要显示密码验证框
  passwordFormVisible: (state, getters) => {
    // 如果是公开赛，保护赛，或已注册过，管理员都不用再显示
    console.log(state)
    return state.contest.auth !== CONTEST_AUTH.PUBLIC && !state.intoAccess && !getters.isContestAdmin
  },
  contestStartTime: (state) => {
    return moment(state.contest.startTime)
  },
  contestEndTime: (state) => {
    return moment(state.contest.endTime)
  },
  // 比赛计时文本显示
  countdown: (state, getters) => {
    // 还未开始的显示
    if (getters.contestStatus === CONTEST_STATUS.SCHEDULED) {
      const durationMs = getters.contestStartTime.diff(state.now, 'seconds')

      const duration = moment.duration(durationMs, 'seconds')
      // time is too long
      if (duration.weeks() > 0) {
        return 'Start At ' + duration.humanize()
      }
      const texts = time.secondFormat(durationMs)
      return texts
      // 比赛进行中的显示
    } else if (getters.contestStatus === CONTEST_STATUS.RUNNING) {
      // 倒计时文本显示
      const texts = time.secondFormat(getters.contestEndTime.diff(state.now, 'seconds'))
      return texts
    } else {
      return 'Ended'
    }
  },
  // 比赛开始到现在经过的秒数
  BeginToNowDuration: (state, getters) => {
    // 控制台会警告
    return moment.duration(state.now.diff(getters.contestStartTime, 'seconds'), 'seconds').asSeconds()
  },

  // 比赛进度条显示
  progressValue: (state, getters) => {
    // 还未开始的显示
    if (getters.contestStatus === CONTEST_STATUS.SCHEDULED) {
      return 0
      // 比赛进行中的显示
    } else if (getters.contestStatus === CONTEST_STATUS.RUNNING) {
      // 获取比赛开始到现在经过的秒数
      const duration = getters.BeginToNowDuration
      // 消耗时间除以整体时间
      return (duration / state.contest.duration) * 100
    } else {
      return 100
    }
  }
}

const mutations = {
  changeContest(state, payload) {
    state.contest = payload.contest
  },
  changeContestItemVisible(state, payload) {
    state.itemVisible = { ...state.itemVisible, ...payload }
  },
  changeRankForceUpdate(state, payload) {
    state.forceUpdate = payload.value
  },
  changeContestProblems(state, payload) {
    state.contestProblems = payload.contestProblems
  },
  changeContestRankLimit(state, payload) {
    state.rankLimit = payload.rankLimit
  },
  contestIntoAccess(state, payload) {
    state.intoAccess = payload.intoAccess
  },
  contestSubmitAccess(state, payload) {
    state.submitAccess = payload.submitAccess
  },
  clearContest(state) {
    state.contest = {}
    state.contestProblems = []
    state.intoAccess = false
    state.submitAccess = false
    state.itemVisible = {
      table: true,
      chart: true,
      realName: false
    }
    state.forceUpdate = false
  },
  now(state, payload) {
    state.now = payload.now
  },
  nowAdd1s(state) {
    state.now = moment(state.now.add(1, 's'))
  }
}

const actions = {
  getContest({ commit, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      contestApi.getContest(rootState.route.params.contestId).then((res) => {
        resolve(res)
        const contest = res
        commit('changeContest', { contest: contest })
        commit('now', { now: moment(contest.now) })
        if (contest.auth === CONTEST_AUTH.PRIVATE) {
          dispatch('getContestAccess', { type: CONTEST_AUTH.PRIVATE })
        }
      }, err => {
        reject(err)
      })
    })
  },
  getContestProblems({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      contestApi.getContestProblemList(rootState.route.params.contestId).then(res => {
        resolve(res)
        commit('changeContestProblems', { contestProblems: res })
      }, (err) => {
        commit('changeContestProblems', { contestProblems: [] })
        reject(err)
      })
    })
  },
  getContestAccess({ commit, rootState }, contestType) {
    return new Promise((resolve, reject) => {
      contestApi.getContestAccess(rootState.route.params.contestId).then(res => {
        if (contestType.type === CONTEST_AUTH.PRIVATE) {
          commit('contestIntoAccess', { intoAccess: res.access })
        } else {
          commit('contestSubmitAccess', { submitAccess: res.access })
        }
        resolve(res)
      }).catch()
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
