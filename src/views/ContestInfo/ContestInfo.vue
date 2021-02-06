<template>
  <div class="contestinfo-body">
    <h1>{{ contestInfo.title }}</h1>
    <el-tabs
      v-model="activeTab"
      type="border-card"
    >
      <el-tab-pane
        label="主页"
        name="1"
      >
        <div class="detail-box">
          比赛时间：
          {{ formatterDate(contestInfo.beginTime) }}
          -
          {{ formatterDate(contestInfo.endTime) }}
          <br>
          比赛状态：
          <span :class="switchStatusClass(contestInfo.status)">{{ contestInfo.status }}</span>
          <br>
          比赛说明：
          <el-card>
            <span v-html="contestInfo.description?contestInfo.description:'无'" />
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="题目列表"
        name="2"
        style="padding:0px;margin:0px;"
      >
        <!-- A~Z的按钮 -->
        <el-button
          v-for="item in ProblemList"
          :key="item.problemId"
          type="info"
          plain
          @click="switchProblem(item.problemId)"
        >{{ String.fromCharCode(item.problemOrder + 65) }}</el-button>
        <el-divider />
        <ContestSubmitComponent
          v-if="showSubmit && ProblemList.length"
          :read-only="contestInfo.status!=='正在进行'"
          :pid="selectedPid"
          :cid="String($route.query.cid)"
          @toPane="switchTabPane"
        />
      </el-tab-pane>
      <el-tab-pane
        label="在线评测"
        name="3"
      >
        <ContestStatusComponent
          v-if="contestInfo.statusReadOut === 1"
          :cid="contestId"
          :contest-info="contestInfo"
        />
        <span
          v-else
          class="detail-red-font"
        >本场比赛不允许查看评测记录</span>
      </el-tab-pane>
      <el-tab-pane
        label="实时排名"
        name="4"
      >
        <!-- TODO: 滚版 -->
        <div v-if="contestInfo.showBorderList === 1" />
        <span
          v-else
          class="detail-red-font"
        >本场比赛不允许查看实时排名</span>
      </el-tab-pane>
      <el-tab-pane
        label="在线讨论"
        name="5"
      >
        <!-- 在线聊天 -->
        <ContestOnlineDiscussComponent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import ContestProblemComponent from '../views/ContestInfo/ContestProblemComponent'
import ContestSubmitComponent from './ContestSubmitComponent'
import ContestStatusComponent from './ContestStatusComponent'
import ContestOnlineDiscussComponent from './ContestOnlineDiscussComponent'
import formatterDate from '../../utils/formatterDate'

export default {
  components: {
    // ContestProblemComponent,
    ContestSubmitComponent,
    ContestStatusComponent,
    ContestOnlineDiscussComponent
  },
  data() {
    return {
      contestId: '',
      contestInfo: '',
      selectedPid: '1',
      ProblemList: [],
      activeTab: '1',
      showSubmit: false,
      showStatus: false
    }
  },
  created() {
    this.contestId = String(this.$route.query.cid)
    this.showStatus = true
  },
  mounted() {
    this.getContest()
    this.getProblemList()
  },
  methods: {
    async getContest() {
      const params = new URLSearchParams()
      params.append('contestId', this.contestId)
      params.append('username', this.$store.getters.getUsername)
      const dataContest = await this.$http
        .get('/contest/info', params)
        .catch(() => {
        })
      this.contestInfo = dataContest.datas[0]
      const currentTime = new Date()
      if (currentTime < new Date(this.contestInfo.beginTime)) {
        this.contestInfo.status = '未开始'
      } else if (currentTime < new Date(this.contestInfo.endTime)) {
        this.contestInfo.status = '正在进行'
      } else {
        this.contestInfo.status = '已结束'
      }
    },
    async getProblemList() {
      this.contestId = String(this.$route.query.cid)
      const params = new URLSearchParams()
      params.append('contestId', this.contestId)
      const dataProblemList = await this.$http
        .get('/contest/problem/list', params)
        .catch(() => {
        })
      this.ProblemList = dataProblemList.datas[0]

      this.selectedPid = String(this.ProblemList[0].problemId)
      this.showSubmit = true
    },
    switchProblem(pid) {
      this.selectedPid = String(pid)
    },
    switchTabPane(val) {
      this.activeTab = val
    },
    switchStatusClass(val) {
      if (val === '正在进行') {
        return 'detail-green-font'
      } else if (val === '已结束') {
        return 'detail-red-font'
      } else {
        return 'detail-blue-font'
      }
    },
    formatterDate(val) {
      return formatterDate(val)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {
      // 如果取消跳转地址栏回退到之前位置
      window.history.go(1)
    })
  }
}
</script>

<style scoped>
.contestinfo-body {
  width: 90%;
  margin: auto;
  min-height: 800px;
  margin-bottom: 20px;
}

.detail-box {
  width: 80%;
  text-align: left;
  line-height: 40px;
  margin: auto;
  font-size: 18px;
}

.detail-font {
  font-size: 18px;
}

.detail-green-font {
  font-size: 18px;
  color: green;
  font-weight: bold;
}

.detail-blue-font {
  font-size: 18px;
  color: blue;
  font-weight: bold;
}

.detail-red-font {
  font-size: 18px;
  color: red;
  font-weight: bold;
}
</style>>
