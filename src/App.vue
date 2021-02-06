<template>
  <div id="app">
    <el-container>
      <el-header>
        <Head />
      </el-header>
      <el-main>
        <transition
          name="fade"
          mode="out-in"
        >
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
              <!-- 这里是会被缓存的视图组件 -->
            </router-view>
          </keep-alive>
        </transition>
        <transition
          name="fade"
          mode="out-in"
        >
          <router-view v-if="!$route.meta.keepAlive">
            <!-- 这里是会被缓存的视图组件 -->
          </router-view>
        </transition>
      </el-main>
      <el-footer height="90px">
        <Foot />
      </el-footer>
    </el-container>
    <BackTop />
  </div>
</template>

<script>
import Head from '@/components/HeadComponent'
import Foot from '@/components/FootComponent'
import BackTop from './components/BackTopComponent'

export default {
  components: {
    Head,
    Foot,
    BackTop
  },
  // 自定义指令
  directives: {},
  data() {
    return {
    }
  },
  created() {
    // 每次刷新时，将sessionStorge内的内容还原到store内，解决刷新后数据丢失的问题
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }
    // 页面刷新后store内容会清空，这里在页面刷新前将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  methods: {}
}
</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.el-header {
  position: fixed;
  width: 100%;
  z-index: 2000;
  background-color: #f5f5f5;
  // box-shadow: 5px 5px 5px #888888;
}

.el-main {
  margin-top: 60px;
  background-color: #ffffff;
}

.el-footer {
  box-shadow: 0px 0px 5px 2px #888888;
  background-color: #f5f5f5;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave {
  opacity: 1;
}

.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s;
}
</style>
