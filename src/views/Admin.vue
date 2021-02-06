<template>
  <div class="admin-body">
    <el-card v-if="this.$store.getters.getIsAdmin" id="admin" class="admin-card">
      <div slot="header">
        <span>欢迎您，管理员：{{ this.$store.getters.getUsername }}</span><br>
        <!-- <span>您拥有以下权限：</span> -->
      </div>
      <el-tabs type="border-card" tab-position="left">
        <!-- <el-tab-pane label="新增题目"><AddProblem></AddProblem></el-tab-pane> -->
        <el-tab-pane label="本地题目">
          <LocalProblem />
        </el-tab-pane>
        <el-tab-pane label="文件上传">
          <FileUpload />
        </el-tab-pane>
        <el-tab-pane label="比赛管理">
          <AdminAddContest />
          <el-divider />
          <AdminUpdateContest />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card v-else id="admin" class="admin-card">
      <h1>对不起，你没有权限</h1>
    </el-card>
  </div>
</template>

<script>
// import AddProblem from './Admin/AdminAddProblem'
import LocalProblem from './Admin/AdminLocalProblem'
import FileUpload from './Admin/AdminFileUpload'
import AdminAddContest from './Admin/AdminAddContest'
import AdminUpdateContest from './Admin/AdminUpdateContest'
export default {
  name: 'Admin',
  components: {
    // AddProblem,
    LocalProblem,
    FileUpload,
    AdminAddContest,
    AdminUpdateContest
  },
  mounted() {
    if (!this.$store.getters.getIsAdmin) {
      // this.$router.push({ name: 'AccessDenied' })
    }
  }
}
</script>

<style scoped>
.admin-body {
  width: 90%;
  margin: auto;
  margin-bottom: 20px;
  min-height: 400px;
}

.admin-card {
  min-width: 1300px;
  min-height: 400px;
}
</style>
