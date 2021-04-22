import { getToken, setToken, getUser, setUser, clear } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/login'
import storage from '@/utils/storage'

const state = {
  user: getUser(),
  token: getToken(),
  loginFailNum: 0
}

const getters = {
  user: state => state.user || {},
  token: state => state.token || '',
  loginFailNum: state => state.loginFailNum || 0,
  isAuthenticated: (state, getters) => {
    return !!getters.token
  },
  isSuperAdmin: (state, getters) => {
    return !!(getters.user && getters.user.username === 'root')
  }
}

const mutations = {
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  // 设置用户信息
  SET_USER: (state, user) => {
    state.user = user
    setUser(user)
  },
  // 设置头像
  changeAvatar: (state, avatar) => {
    state.user.avatar = avatar
  },
  // 登录失败次数
  incrLoginFailNum(state, { success }) {
    if (!success) {
      state.loginFailNum += 1
    } else {
      state.loginFailNum = 0
    }
  },
  clearUserAndToken(state) {
    state.token = ''
    state.user = {}
    state.loginFailNum = 0
    clear()
    storage.clear()
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const rememberMe = userInfo.rememberMe
    return new Promise((resolve, reject) => {
      login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
        // 根据rememberMe判断是否设置token到cookie中
        setToken(res.token, rememberMe)
        // 将token设置到store中
        commit('SET_TOKEN', res.token)
        // 设置用户信息
        setUserInfo(res.user, commit)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        setUserInfo(res, commit)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('clearUserAndToken')
        resolve()
      }).catch(error => {
        commit('clearUserAndToken')
        reject(error)
      })
    })
  },
  incrLoginFailNum({ commit }, success) {
    commit('incrLoginFailNum', { success: success })
  },
  clearUserAndToken({ commit }) {
    commit('clearUserAndToken')
  },
  setUserInfo({ commit }, user) {
    commit('SET_USER', user)
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  // if (res.roles.length === 0) {
  //   commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  // } else {
  //   commit('SET_ROLES', res.roles)
  // }
  commit('SET_USER', res.user)
}

export default {
  state,
  getters,
  actions,
  mutations
}
