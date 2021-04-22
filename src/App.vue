<template>
  <div id="app">
    <Head />
    <div class="oj-content">
      <transition name="el-fade-in-linear">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive">
            <!-- 这里是会被缓存的视图组件 -->
          </router-view>
        </keep-alive>
      </transition>
      <transition name="el-fade-in-linear">
        <router-view v-if="!$route.meta.keepAlive">
          <!-- 这里是不会被缓存的视图组件 -->
        </router-view>
      </transition>
    </div>
    <div class="footer">
      <a style="color:#1E9FFF" href="#">粤ICP备×××××××号-1</a>
      <p>
        Powered by
        <a href="#" style="color:#1E9FFF">Cijee</a>
      </p>
    </div>
  </div>
</template>

<script>
import Head from '@/components/HeadComponent'

export default {
  components: {
    Head
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
.oj-content {
  margin-top: 90px;
  padding: 0 5px;
}
.footer {
  height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  font-size: small;
}
.history-select-row {
  background-color: #ECF5FF !important;
}
</style>
