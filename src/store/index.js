import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import contest from '@/store/modules/contest'
import api from '@/store/modules/api'

Vue.use(Vuex)
// 全局参数
const state = {
  unReadMsgCount: 0,
  activeIndex: '',
  modalStatus: {
    mode: 'Login', // or 'register',
    visible: false
  }
}

// 全局get方法，全局参数需要用get方法才能拿到
const getters = {
  getUnReadMsgCount: state => state.unReadMsgCount,
  modalStatus: state => state.modalStatus,
  baseApi: state => state.api.baseApi
}

// 全局set方法
const mutations = {
  setUnReadMsgCount(state, unReadMsgCount) {
    state.unReadMsgCount = unReadMsgCount
  },
  changeModalStatus(state, { mode, visible }) {
    if (mode !== undefined) {
      state.modalStatus.mode = mode
    }
    if (visible !== undefined) {
      state.modalStatus.visible = visible
    }
  }
}

// 全局异步操作变更数据
const actions = {
  changeModalStatus({ commit }, payload) {
    commit('changeModalStatus', payload)
  },
  changeDomTitle({ commit, state }, payload) {
    if (payload && payload.title) {
      window.document.title = payload.title + ' - Niu Code'
    } else {
      window.document.title = state.route.meta.title + ' - Niu Code'
    }
  }
}

export default new Vuex.Store({
  modules: {
    contest,
    user,
    api
  },
  state,
  getters,
  mutations,
  actions
})
