import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Notification } from 'element-ui'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 10000 // 请求超过时间
})

// request 拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
      if (config.url === 'user/update-avatar') { // 上传头像路径
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
    if (response.data.success) {
      return response.data.data
    } else {
      Notification.error({
        title: '错误',
        message: response.data.message,
        duration: 3000
      })
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response) {
      // 处理超时
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '错误',
          message: '网络请求超时',
          duration: 3000
        })
        return Promise.reject(error)
      }
      switch (error.response.status) {
        // 401 未登录 token过期
        case 401:
          // 调用退出登录，清空缓存的token和isLogin
          store.dispatch('logout').then(() => {
            Notification.error({
              title: '错误',
              message: '当前登录状态已过期，请重新登录！'
            })
            // 跳转到登录页面
            router.push({ name: 'Login' })
          })
          break
        // 403 无权限访问或操作的请求
        case 403:
          Notification.error({
            title: '错误',
            message: error.response.data.message,
            duration: 3000
          })
          break
        case 404:
          Notification.error({
            title: '错误',
            message: '查询错误，找不到要请求的资源！',
            duration: 3000
          })
          // 跳转到404页面
          router.push({ name: 'NotFound' })
          break
        // 其他错误，直接抛出错误提示
        default:
          if (error.response.data) {
            Notification.error({
              title: '错误',
              message: error.response.data.message,
              duration: 3000
            })
          }
          break
      }
      return Promise.reject(error)
    } else {
      // 处理断网
      Notification.error({
        title: '错误',
        message: '与服务器链接出现异常，请稍后再尝试！',
        duration: 3000
      })
      return Promise.reject(error)
    }
  }
)

export default service
