<template>
  <div class="submit-body">
    <SubmitComponent :pid="this.$route.query.pid" />
  </div>
</template>

<script>
import SubmitComponent from './SubmitComponent'
export default {
  components: {
    SubmitComponent
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Status') {
      to.meta.keepAlive = false
      next()
    } else {
      this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        // 如果取消跳转地址栏会变化
        window.history.go(1)
      })
    }
  }

}
</script>

<style scoped>
.submit-body {
  width: 95%;
  margin: auto;
  margin-top: 0px;
  min-height: 700px;
  font-size: 15px;
}
</style>
