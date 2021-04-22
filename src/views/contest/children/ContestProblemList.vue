<template>
  <div>
    <el-table
      v-loading="loading"
      :data="problems"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      stripe
    >
      <el-table-column
        width="50"
      >
        <template v-if="isAuthenticated && isGetStatusOk" slot-scope="{ row }">
          <el-tooltip
            :content="JUDGE_STATUS[row.userStatus].name"
            placement="top"
          >
            <i
              v-if="row.userStatus === 1"
              class="el-icon-check"
              :style="getIconColor(row.userStatus)"
            />
            <i
              v-else-if="row.userStatus !== -1"
              class="el-icon-close"
              :style="getIconColor(row.userStatus)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        min-width="80"
      />
      <el-table-column
        prop="title"
        label="题目标题"
        show-overflow-tooltip
        min-width="200"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="goContestProblem(scope.row.displayId)"
          >{{ scope.row.displayTitle }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="accept" label="AC" min-width="80" />
      <el-table-column prop="total" label="Total" min-width="80" />
      <el-table-column
        label="AC Rate"
        min-width="80"
      >
        <template slot-scope="scope">
          {{ getPercentage(scope.row.accept, scope.row.total).toFixed(2) }}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { JUDGE_STATUS } from '@/utils/constants'
import { mapGetters } from 'vuex'
import curdProblem from '@/api/problemset/problem'

export default {
  name: 'ContestProblemList',
  data() {
    return {
      contestId: 0,
      loading: false,
      problems: [],
      isGetStatusOk: false,
      JUDGE_STATUS: {}
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  created() {
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS)
  },
  mounted() {
    this.contestId = this.$route.params.contestId
    this.getContestProblems()
  },
  methods: {
    getContestProblems() {
      this.loading = true
      this.$store.dispatch('getContestProblems').then((res) => {
        this.problems = res
        this.getUserProblemStatus()
        this.loading = false
      }).catch(() => {})
    },
    getPercentage(accept, total) {
      if (total) {
        return Math.round((accept / total) * 10000) / 100.0
      } else {
        return 0
      }
    },
    // 获取用户解答状态
    getUserProblemStatus() {
      // 如果是登录状态
      if (this.isAuthenticated) {
        this.isGetStatusOk = false
        // 如果没有题目则不查询用户解答情况
        if (this.problems.length <= 0) return
        const pidList = []
        const isContestProblemList = true
        this.problems.forEach(value => {
          pidList.push(value.pid)
        })
        curdProblem.getUserProblemStatus(pidList, isContestProblemList, this.contestId).then(res => {
          for (let i = 0; i < this.problems.length; i++) {
            this.problems[i]['userStatus'] = res[this.problems[i].pid].status
            this.problems[i]['userScore'] = res[this.problems[i].pid].score
          }
          this.isGetStatusOk = true
        }).catch(() => {
          this.isGetStatusOk = false
        })
      }
    },
    getIconColor(status) {
      return (
        'font-weight: 600;font-size: 16px;color:' + JUDGE_STATUS[status].rgb
      )
    },
    // 前往题目详情页
    goContestProblem(displayId) {
      this.$router.push({
        name: 'ContestProblemDetails',
        params: {
          contestId: this.$route.params.contestId,
          pid: displayId
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
