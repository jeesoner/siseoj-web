<template>
  <div class="container">
    <div class="avatar-container">
      <avatar
        :username="profile.username"
        :inline="true"
        :size="130"
        color="#FFF"
        :src="baseApi + '/avatar/' + profile.avatar"
      />
    </div>
    <el-card class="box-card">
      <div>
        <p style="margin-top: 50px">
          <span
            class="emphasis"
          ><i class="fa fa-user-circle-o" aria-hidden="true" />
            {{ profile.username }}</span>
        </p>
        <p>
          <span><i class="fa fa-graduation-cap" aria-hidden="true" />
            {{ profile.school ? profile.school : '暂未设置' }}</span>
        </p>
        <p class="mood">
          <i class="fa fa-pencil-square-o" aria-hidden="true" />
          {{ profile.motto ? profile.motto : '暂无个性签名' }}
        </p>

        <hr id="split">

        <el-row :gutter="12">
          <el-col :md="8" :sm="24">
            <el-card shadow="always" class="submission">
              <p><i class="fa fa-th" aria-hidden="true" /> 提交</p>
              <p class="data-number">{{ profile.userRecord ? profile.userRecord.submissions : '--' }}</p>
            </el-card>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-card shadow="always" class="solved">
              <p>
                <i class="fa fa-check-circle" aria-hidden="true" /> 已解决
              </p>
              <p class="data-number">{{ profile.userAccepts.length }}</p>
            </el-card>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-card shadow="always" class="rating">
              <p><i class="fa fa-user-secret" aria-hidden="true" /> Rating</p>
              <p class="data-number">
                {{ profile.userRecord.rating ? profile.userRecord.rating : '--' }}
              </p>
            </el-card>
          </el-col>
        </el-row>

        <div id="problems">
          <div v-if="profile.userAccepts.length">
            已通过的题目列表
            <el-button
              type="primary"
              icon="el-icon-refresh"
              circle
              size="mini"
              @click="freshProblemId"
            />
          </div>
          <p v-else>暂无数据</p>
          <div class="user-accept">
            <div
              v-for="item of profile.userAccepts"
              :key="item.pid"
              class="problem-btn"
            >
              <el-button size="mini" type="success" @click="goProblem(item.pid)">{{ item.pid }}</el-button>
            </div>
          </div>
        </div>
        <div id="icons">
          <a
            v-if="profile.github"
            :href="profile.github"
            class="icon"
            target="_blank"
          >
            <i class="fa fa-github" />
          </a>
          <a
            v-if="profile.blog"
            :href="profile.blog"
            class="icon"
            target="_blank"
          >
            <i class="fa fa-pencil" />
          </a>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import userApi from '@/api/user/user'
import Avatar from 'vue-avatar'
export default {
  name: 'UserHome',
  components: {
    Avatar
  },
  data() {
    return {
      profile: {
        username: '暂无数据',
        avatar: '',
        school: '暂无数据',
        motto: '暂无数据',
        total: 0,
        rating: 0,
        userRecord: {
          submissions: 0
        },
        userAccepts: []
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'baseApi'])
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    ...mapActions(['changeDomTitle']),
    init() {
      const uid = this.$route.query.uid
      userApi.get(uid || this.user.id).then((res) => {
        this.changeDomTitle({ title: res.username })
        this.profile = res
      })
    },
    goProblem(pid) {
      this.$router.push({
        name: 'ProblemDetails',
        params: { pid }
      })
    },
    freshProblemId() {
      this.init()
      this.$message.success('更新成功！')
    }
  }
}
</script>

<style scoped>
.submission {
  background: skyblue;
  color: #fff;
  font-size: 14px;
}
.solved {
  background: #67c23a;
  color: #fff;
  font-size: 14px;
}
.rating {
  background: #dd6161;
  color: #fff;
  font-size: 14px;
}
.mood {
  font-style: italic;
  font-size: 15px;
}
.data-number {
  font-size: 20px;
  font-weight: 600;
}

.container p {
  margin-top: 8px;
  margin-bottom: 8px;
}
.box-card {
  text-align: center !important;
}
::v-deep .el-card__body {
  text-align: center;
}
@media screen and (max-width: 1080px) {
  .container {
    position: relative;
    width: 100%;
    margin-top: 200px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  .container .avatar-container {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    z-index: 1;
    margin-top: -90px;
  }
}

@media screen and (min-width: 1080px) {
  .container {
    position: relative;
    margin-top: 200px;
    margin-left: auto;
    margin-right: auto;
    width: 75%;
    text-align: center;
  }
  .container .avatar-container {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    z-index: 1;
    margin-top: -8%;
  }
}
.container .avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  box-shadow: 0 1px 1px 0;
}

.container .emphasis {
  font-size: 20px;
  font-weight: 600;
}
#problems {
  margin-top: 40px;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 18px;
}
.user-accept {
  margin-top: 15px;
}
.problem-btn {
  display: inline-block;
  margin: 5px;
}
#icons {
  margin-top: 50px;
}

#icons .icon {
  font-size: 20px;
  padding: 0 10px;
  color: #2196f3;
}
</style>
