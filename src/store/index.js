import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/login'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 全局参数
  state: {
    username: '',
    avatarUrl: '',
    isLogin: false,
    isAdmin: false,
    isClockIn: false,
    unReadMsgCount: 0,
    token: getToken(),
    user: {},
    avatar: '',
    activeIndex: ''
  },
  // set方法
  mutations: {
    LOGOUT(state) {
      sessionStorage.clear()
      state.username = ''
      state.avatarUrl = ''
      state.isLogin = false
      state.isAdmin = false
      state.isClockIn = false
      state.unReadMsgCount = 0
      state.token = ''
    },
    // 设置token
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // 设置用户信息
    SET_USER: (state, user) => {
      state.user = user
    },
    // 设置头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    setUsername(state, username) {
      state.username = username
    },
    setAvatarUrl(state, avatarUrl) {
      state.avatarUrl = avatarUrl
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin
    },
    setIsAdmin(state, isAdmin) {
      state.isAdmin = isAdmin
    },
    setIsClockIn(state, isClockIn) {
      state.isClockIn = isClockIn
    },
    setUnReadMsgCount(state, unReadMsgCount) {
      state.unReadMsgCount = unReadMsgCount
    },
    setActiveIndex(state, activeIndex) {
      state.activeIndex = activeIndex
    }
  },
  // get方法，全局参数需要用get方法才能拿到
  getters: {
    getUsername: state => state.username,
    getAvatarUrl: state => state.avatarUrl,
    getIsLogin: state => state.isLogin,
    getIsAdmin: state => state.isAdmin,
    getIsClockIn: state => state.isClockIn,
    getUnReadMsgCount: state => state.unReadMsgCount,
    getToken: state => state.token,
    getActiveIndex: state => state.activeIndex,
    getUser: state => state.user
  },
  // 异步操作变更数据
  actions: {
    // 登录
    login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
        // 根据rememberMe判断是否设置token到cookie中
          setToken(res.token, rememberMe)
          // 将token设置到store中
          commit('SET_TOKEN', res.token)
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
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    }
  },
  modules: {
  }
})

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('setIsLogin', false)
  removeToken()
}

export const setUserInfo = (res, commit) => {
  commit('SET_USER', res.user)
  commit('setUsername', res.user.username)
}

export default store
