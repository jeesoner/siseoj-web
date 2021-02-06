<template>
  <div class="foot-box">
    <h1 class="title-span">
      SISE Online Judge<span class="version-span"> v{{ version }}测试</span>
    </h1>
    <div class="link-box">
      <el-link @click="goReportBug">BUG反馈</el-link> | <el-link>FAQ</el-link>
    </div>
    <span class="power-span">Power by © Cijee</span>
    <BugReport
      :dialog-visible="showBugReport"
      @visiable="changeVisiable"
    />
  </div>
</template>

<script>
import BugReport from './BugReportComponent'
export default {
  components: {
    BugReport
  },
  data() {
    return {
      version: '1.0',
      showBugReport: false,
      date: new Date().toLocaleString('chinese', { hour12: false })
    }
  },
  mounted() {
    this.getVersion()
    const _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date().toLocaleString('chinese', { hour12: false }) // 修改数据date
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在vue实例销毁钱，清除定时器
    }
  },
  methods: {
    goReportBug() {
      this.showBugReport = true
    },
    changeVisiable(val) {
      this.showBugReport = false
    },
    async getVersion() {
      const params = new URLSearchParams()
      params.append('name', 'version')
      // const dataVersion = await this.$http.get('/system/info', params) TODO 需要重写
      // this.version = dataVersion.datas[0].value
    }
  }
}
</script>

<style scoped>
.foot-box {
  margin: 0;
  width: 100%;
  font-family: '微软雅黑', '宋体', 'Arial Narrow', Helvetica, sans-serif;
  font-size: 15px;
}

.title-span {
  margin: 4px;
}

.version-span {
  font-size: 14px;
}

.link-box {
  margin-bottom: 10px;
  padding: 0px;
}

.power-span {
  margin: 5px;
}
</style>
