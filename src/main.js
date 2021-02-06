import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import logger from './utils/logger'
import VueHighlightJS from 'vue-highlightjs'
import ace from 'ace-builds'
import './assets/css/global.css'
import './assets/css/elcard.css'
import './assets/css/elcollapse.css'
import './assets/css/rank.css'
import './assets/icons' // 图标
import service from './api/http'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueHighlightJS)
Vue.use(ace)

Vue.prototype.$http = service
Vue.prototype.logger = logger

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
