<template>
  <el-card class="box-card">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="Account">
        <template slot="title">
          <i class="el-icon-setting"> 账户设置</i>
        </template>
        <component :is="Account" />
      </el-collapse-item>
       <el-collapse-item name="UserInfo">
        <template slot="title">
          <i class="el-icon-setting"> 个人信息</i>
        </template>
        <component :is="UserInfo" />
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
<script>
import Account from './Account'
import UserInfo from './UserInfo'
export default {
  components: {
    Account,
    UserInfo
  },
  data() {
    return {
      Account: 'Account',
      UserInfo: 'UserInfo',
      activeName: 'Account'
    }
  }
}
</script>
<style scoped>
@media screen and (min-width: 1200px) {
  .box-card {
    margin-left: 10%;
    margin-right: 10%;
  }
}
::v-deep .el-collapse-item__header {
  font-size: 18px;
  color: #409eff;
}
</style>
