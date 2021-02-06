import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_APIURL,
  timeout: 20000 // 请求超过时间
})

// request 拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.getToken) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
      if (config.url === '/upload/avatar') { // 上传头像路径
        config.headers.post['Content-Type'] = 'multipart/form-data'
      } else {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      }
    }
    return config
  },
  error => {
    console.log(error)
    Notification.error('服务器繁忙，请稍后重试！')
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 请求成功，返回data里的数据
    if (res.success) {
      return res.data
    } else { // 请求失败
      if (res.code === 70001) { // 凭据失效，请重新登录
        // 调用退出登录，清空缓存的token和isLogin
        store.dispatch('logout').then(() => {
          Notification.error({
            title: '错误',
            message: '当前登录状态已过期，请重新登录！'
          })
        })
      } else if (res.code === 70002) { // 无权限访问
        Notification.error({
          title: '错误',
          message: res.message
        })
      } else {
        Notification.error({
          title: '错误',
          message: '未知错误'
        })
        console.log(res.code, res.message)
      }
      return Promise.reject(res.message).catch(e => {})
    }
  },
  error => {
    if (String(error).toLowerCase().indexOf('timeout') !== -1) {
      Notification.error({
        title: '错误',
        message: '服务器繁忙，请稍后重试'
      })
    } else if (!error.response) {
      Notification.error({
        title: '错误',
        message: '服务器没有响应'
      })
    } else if (error.response.status === 404) {
      Notification.error({
        title: '错误',
        message: '服务器好像挂了，要不等等试试'
      })
    } else if (error.response.status === 500) {
      Notification.error({
        title: '错误',
        message: '服务器内部错误！错误原因：' + error.response.data.message
      })
    } else {
      Notification.error({
        title: '错误',
        message: error.response.data.message
      })
    }
    return Promise.reject(error)
  }
)

export default service
