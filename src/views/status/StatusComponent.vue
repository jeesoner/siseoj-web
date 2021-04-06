<template>
  <div class="problem-body">
    <div class="function-bar">
      <el-input
        v-model="queryParams.username"
        class="bar-search-item-input"
        size="mini"
        clearable
        placeholder="请输入昵称"
      />
      <el-input
        v-model="queryParams.pid"
        class="bar-search-item-input"
        size="mini"
        clearable
        placeholder="请输入题号"
      />
      <el-select
        v-model="queryParams.status"
        class="bar-search-item-select"
        size="mini"
        clearable
        placeholder="评测结果"
      >
        <el-option
          v-for="item in resultList"
          :key="item.value"
          :style="getStatusFontColor(item.value)"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="queryParams.language"
        class="bar-search-item-select"
        size="mini"
        clearable
        placeholder="语言"
      >
        <el-option
          v-for="item in langList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-button
        size="mini"
        class="bar-search-item"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >搜索</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column
        prop="id"
        label="Run ID"
        min-width="5%"
      />
      <el-table-column
        label="用户名"
        min-width="12%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toUser(scope.row.username)"
          >{{ scope.row.username }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="题目"
        min-width="6%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="goProblemDetails(scope.row.pid)"
          >{{ scope.row.pid }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="评测结果"
        min-width="15%"
      >
        <template slot-scope="scope">
          <el-tag size="mini" effect="dark" :type="getStatusColor(scope.row.status)">
            <i
              v-if="scope.row.status === JUDGE_STATUS_RESERVE['pending'] ||
                scope.row.status === JUDGE_STATUS_RESERVE['judging']"
              class="el-icon-loading"
            />
            {{ JUDGE_STATUS[scope.row.status].name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="语言"
        min-width="8%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toCodeView(scope.row.id)"
          >{{ LANGUAGE[scope.row.language] }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="耗时(ms)"
        min-width="8%"
      />
      <el-table-column
        prop="memory"
        label="使用内存(KB)"
        min-width="8%"
      />
      <el-table-column
        prop="codeLength"
        label="代码长"
        min-width="6%"
      />
      <el-table-column
        prop="submitTime"
        label="提交时间"
        min-width="16%"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime }}</span></template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { JUDGE_STATUS, JUDGE_STATUS_RESERVE, LANGUAGE } from '@/utils/constants'
import submitApi from '@/api/submission/submit'

export default {
  components: { Pagination },
  data() {
    return {
      // 查询参数
      queryParams: {},
      total: 10,
      pagination: {
        size: 10,
        current: 1
      },
      searchNick: '',
      searchPid: '',
      searchLanguage: null,
      searchResult: null,
      currentPage: 1,
      pageSize: 20,
      tableData: [],
      isSearch: false,
      loading: false,
      resultList: [
        { name: 'Pending', value: 0 },
        { name: 'Accepted', value: 1 },
        { name: 'Wrong Answer', value: 2 },
        { name: 'Compilation Error', value: 3 },
        { name: 'Runtime Error', value: 4 },
        { name: 'Time Limit Exceeded', value: 5 },
        { name: 'Memory Limit Exceeded', value: 6 },
        { name: 'Output Limit Exceeded', value: 7 },
        { name: 'Presentation Error', value: 8 },
        { name: 'System Error', value: 9 },
        { name: 'Submitted Failed', value: 11 },
        { name: 'Judging', value: 12 }
      ],
      langList: [
        { name: 'C/C++', value: 1 },
        { name: 'Java', value: 2 },
        { name: 'Python', value: 3 }
      ],
      JUDGE_STATUS: null,
      LANGUAGE: null,
      JUDGE_STATUS_RESERVE: null
    }
  },
  mounted() {
    this.search()
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS)
    this.LANGUAGE = Object.assign({}, LANGUAGE)
    this.JUDGE_STATUS_RESERVE = Object.assign({}, JUDGE_STATUS_RESERVE)
  },
  methods: {
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    fetch(params = {}) {
      this.loading = true
      params.size = this.pagination.size
      params.current = this.pagination.current
      // 分页查询
      submitApi.getSubmissions(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        // 刷新标志
        let refresh = false
        for (const v of res.records) {
          if (v.status === JUDGE_STATUS_RESERVE['pending'] ||
              v.status === JUDGE_STATUS_RESERVE['judging']) {
            refresh = true
          }
        }
        if (refresh) {
          this.checkSubmissionsStatus()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 对当前提交列表 状态为Pending和Judging的提交记录每2秒查询一下最新结果
    checkSubmissionsStatus() {
      // TODO
    },
    switchPage(val) {
      this.currentPage = val
      this.getStatus()
    },
    handleSelect() {
      this.currentPage = 1
      this.getStatus()
    },
    handleBackToAll() {
      this.currentPage = 1
      this.searchLanguage = '-'
      this.searchResult = '-'
      this.searchNick = ''
      this.searchPid = ''
      this.getStatus()
    },
    goProblemDetails(pid) {
      this.$router.push({ name: 'ProblemDetails', params: { pid }})
    },
    toCodeView(val) {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push({ path: '/CodeView', query: { id: val }})
      } else {
        this.$notify({
          title: '提示',
          message: '登录后才能查看这个评测的解答详情哦',
          type: 'warning',
          offset: 100,
          duration: 3000
        })
      }
    },
    toUser(val) {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push({ path: '/User', query: { username: val }})
      } else {
        this.$notify({
          title: '提示',
          message: '登录后才能查看这个用户的主页哦',
          type: 'warning',
          offset: 100,
          duration: 3000
        })
      }
    },
    getStatusColor(status) {
      return JUDGE_STATUS[status].type
    },
    getStatusFontColor(status) {
      return 'color: ' + JUDGE_STATUS[status].color
    },
    switchResultColor(str) {
      return JUDGE_STATUS[str].type
    },
    switchResultClass(str) {
      if (str === '-') {
        return ''
      } else if (str === 'Accepted' || str === 'Score 100') {
        return 'green-font'
      } else if (str === 'Presentation Error') {
        return 'orange-font'
      } else if (str === 'Pending...' || str === 'Judging...') {
        return 'grey-font'
      } else if (str === 'Submit Error' || str.substring(0, 5) === 'Score') {
        return 'blue-font'
      } else {
        return 'red-font'
      }
    },
    async getStatus() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('pageNum', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('nick', this.searchNick)
      params.append('problemId', this.searchPid)
      params.append('result', this.searchResult)
      params.append('language', this.searchLanguage)
      const dataStatus = await this.$http
        .get('/judge_status/list', params)
        .catch(() => {
          this.loading = false
        })
      if (dataStatus.code !== 10000) {
        this.$message.error('评测列表获取失败！')
      }
      this.tableData = dataStatus.datas[0]
      this.total = dataStatus.datas[1]
      this.loading = false
    }
  },
  beforeRouteLeave(to, from, next) {
    // 如果是点击到代码详情或者题目列表时，离开评测页面时让评测页面缓存
    if (to.name === 'CodeView' || to.name === 'Submit') {
      from.meta.keepAlive = true
    } else {
      // 否则，离开评测页面不缓存
      from.meta.keepAlive = false
    }
    next()
  }
}
</script>

<style scoped>
.problem-body {
  width: 100%;
  min-height: 700px;
  padding-top: 0;
  margin: 0 0 20px;
  font-family: 微软雅黑, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.function-bar {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
}

.bar-search-item-input {
  width: 16%;
  margin-right: 20px;
}

.bar-search-item-select {
  width: 15%;
  margin-right: 20px;
}

.bar-search-item {
  margin-right: 20px;
}
</style>
