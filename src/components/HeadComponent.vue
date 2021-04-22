<template>
  <div id="header">
    <el-menu
      :default-active="activeMenuName"
      mode="horizontal"
      router
      active-text-color="#2196f3"
      text-color="#495060"
      background-color="#eee"
    >
      <div class="logo">
        <el-image style="width: 139px; height: 50px" :src="imgUrl" fit="scale-down" />
      </div>
      <el-menu-item index="/home"><i class="el-icon-s-home" />主页</el-menu-item>
      <el-menu-item index="/problems"><i class="el-icon-menu" />题库</el-menu-item>
      <el-menu-item index="/status"><i class="el-icon-s-marketing" />评测</el-menu-item>
      <el-menu-item index="/contest"><i class="el-icon-trophy" />比赛</el-menu-item>
      <el-menu-item index="/rank"><i class="el-icon-s-data" />排名</el-menu-item>
      <el-menu-item index="/discuss"><i class="el-icon-s-comment" />讨论</el-menu-item>

      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <el-button
            type="primary"
            round
            @click="handleBtnClick('Login')"
          >登录
          </el-button>
          <el-button
            round
            type="danger"
            style="margin-left: 5px"
            @click="handleBtnClick('Register')"
          >注册
          </el-button>
        </div>
      </template>
      <template v-else class="menu-right-side">
        <el-dropdown
          class="drop-menu"
          @command="handleRoute"
        >
          <span class="el-dropdown-link">
            {{ user.nickname }}<i class="el-icon-caret-bottom" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/user-home">个人主页</el-dropdown-item>
            <el-dropdown-item command="/status?mine=true">评测记录</el-dropdown-item>
            <el-dropdown-item command="/setting">设置</el-dropdown-item>
            <el-dropdown-item v-if="isSuperAdmin" command="/admin">管理</el-dropdown-item>
            <el-dropdown-item divided command="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <avatar
          :username="user.username"
          :inline="true"
          :size="30"
          color="#FFF"
          :src="baseApi + '/avatar/' + avatar"
          class="drop-avatar"
        />
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from 'vue-avatar'

export default {
  name: 'Head',
  components: { Avatar },
  data() {
    return {
      type: false,
      datas: [],
      avatarUrl: '',
      imgUrl: require('@/assets/logo.png')
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isSuperAdmin', 'user', 'baseApi']),
    unReadMsgCount() {
      return this.$store.getters.getUnReadMsgCount
    },
    activeMenuName() {
      return '/' + this.$route.path.split('/')[1]
    },
    avatar() {
      return this.$store.getters.user.avatar
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleBtnClick(mode) {
      if (mode === 'Register') {
        this.$router.push({ name: 'Register' })
      } else {
        this.$router.push({ name: 'Login' })
      }
    },
    handleRoute(route) {
      if (route === 'logout') {
        this.logout()
      } else if (route && route.indexOf('admin') < 0) { // 不是去管理端的路由
        this.$router.push(route)
      } else {
        window.open('/admin/')
      }
    },
    logout() {
      // 请求后端登出
      this.$store.dispatch('logout')
      this.$router.push({ path: '/' })
      this.$message({
        message: '您已退出登录',
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped >
#header {
  min-width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  z-index: 2000;
  background-color: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
}
.logo {
  margin-left: 2%;
  margin-right: 2%;
  float: left;
  width: 139px;
  height: 42px;
  margin-top: 5px;
}
.menu-right-side {
  float: right;
}
.btn-menu {
  font-size: 16px;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}
.drop-menu {
  float: right;
  margin-right: 30px;
  position: relative;
  font-weight: 500;
  right: 10px;
  margin-top: 20px;
  font-size: 18px;
}
.drop-avatar {
  float: right;
  margin-right: 15px;
  position: relative;
  margin-top: 16px;
}
</style>
