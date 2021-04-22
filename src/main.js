import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import logger from '@/utils/logger'
import VueHighlightJS from 'vue-highlightjs'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/css/global.css'
import '@/assets/css/elcard.css'
import '@/assets/css/elcollapse.css'
import '@/assets/css/rank.css'
import '@/assets/icons' // 图标
import service from '@/api/http'
import SlideVerify from 'vue-monoplasty-slide-verify'
import VueCropper from 'vue-cropper'

Vue.config.productionTip = false

Vue.use(ElementUI) // Element UI
Vue.use(VueHighlightJS) // 代码高亮
Vue.use(SlideVerify) // 滑动验证码组件
Vue.use(VueCropper) // 图像截取

Vue.prototype.$http = service
Vue.prototype.logger = logger

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
