<template>
  <div class="problem-body">
    <div class="function-bar">
      <el-input
        v-model="searchNick"
        class="bar-search-item-input"
        size="mini"
        placeholder="请输入昵称"
      >
        <template slot="prepend">用户昵称</template>
      </el-input>
      <el-input
        v-model="searchPid"
        class="bar-search-item-input"
        size="mini"
        placeholder="请输入题号"
      >
        <template slot="prepend">题号</template>
      </el-input>
      <el-select
        v-model="searchResult"
        class="bar-search-item-select"
        size="mini"
        placeholder="评测结果"
      >
        <el-option
          v-for="item in resultList"
          :key="item.value"
          :class="switchResultClass(item.name)"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="searchLanguage"
        class="bar-search-item-select"
        size="mini"
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
        @click="handleSelect"
      >筛选</el-button>
      <el-button
        size="mini"
        class="bar-search-item"
        type="info"
        icon="el-icon-s-grid"
        @click="handleBackToAll"
      >查看全部</el-button>
    </div>
    <el-pagination
      layout="prev, pager, next, jumper"
      :current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      @current-change="switchPage"
    />
    <el-table
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column
        prop="id"
        label="#"
        min-width="8%"
      />
      <el-table-column
        label="昵称"
        min-width="12%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toUser(scope.row.username)"
          >{{ scope.row.nick }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="题目"
        min-width="6%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toSubmit(scope.row.problemId)"
          >{{ scope.row.problemId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="评测结果"
        min-width="14%"
      >
        <template slot-scope="scope">
          <el-tag
            size="medium"
            effect="dark"
            :type="switchResultColor(scope.row.result)"
          >{{ scope.row.result }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column
        label="代码"
        min-width="8%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toCodeView(scope.row.id)"
          >{{ scope.row.language }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="timeUsed"
        label="耗时"
        min-width="8%"
      />
      <el-table-column
        prop="memoryUsed"
        label="使用内存"
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
        min-width="14%"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.submitTime).toLocaleString(
            'chinese',
            { hour12: false }
          ) }}</span></template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="bottom-pagination"
      layout="prev, pager, next, jumper"
      :current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      @current-change="switchPage"
    />
  </div>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      searchNick: '',
      searchPid: '',
      searchLanguage: '',
      searchResult: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      isSearch: false,
      loading: false,
      resultList: [
        { name: '-', value: '' },
        { name: 'Pending...', value: 'Pending...' },
        { name: 'Accepted', value: 'Accepted' },
        { name: 'Wrong Answer', value: 'Wrong Answer' },
        { name: 'Compilation Error', value: 'Compilation Error' },
        { name: 'Runtime Error', value: 'Runtime Error' },
        { name: 'Time Limit Exceeded', value: 'Time Limit Exceeded' },
        { name: 'Memory Limit Exceeded', value: 'Memory Limit Exceeded' },
        { name: 'Output Limit Exceeded', value: 'Output Limit Exceeded' },
        { name: 'Presentation Error', value: 'Presentation Error' },
        { name: 'System Error', value: 'System Error' },
        // { name: 'Running......', value: 'Running......' },
        { name: 'Submit Error', value: 'Submit Error' },
        { name: 'Judging...', value: 'Judging...' },
        { name: 'Score', value: 'Score' }
      ],
      langList: [
        { name: '-', value: '' },
        { name: 'G++', value: 'G++' },
        { name: 'GCC', value: 'GCC' },
        { name: 'JAVA', value: 'JAVA' },
        { name: 'Python2', value: 'Python2' },
        { name: 'G++11', value: 'G++11' },
        { name: 'GCC11', value: 'GCC11' },
        { name: 'VC++', value: 'VC++' },
        { name: 'C#', value: 'C#' },
        { name: 'GO 1.8', value: 'GO 1.8' },
        { name: 'JavaScript', value: 'JavaScript' },
        { name: 'Pascal', value: 'Pascal' }
      ]
    }
  },
  mounted() {
    this.getStatus()
  },
  methods: {
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
    toSubmit(val) {
      this.$router.push({ path: '/Submit', query: { pid: val }})
    },
    toCodeView(val) {
      if (this.$store.getters.getIsLogin) {
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
      if (this.$store.getters.getIsLogin) {
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
    switchResultColor(str) {
      if (str === 'Accepted' || str === 'Score 100') {
        return 'success'
      } else if (str === 'Presentation Error') {
        return 'warning'
      } else if (str === 'Pending...' || str === 'Judging...') {
        return 'info'
      } else if (str === 'Submit Error' || str.substring(0, 5) === 'Score') {
        return ''
      } else {
        return 'danger'
      }
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
  margin: 0;
  margin-bottom: 20px;
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

.bottom-pagination {
  float: right;
  margin-bottom: 10px;
}

.green-font {
  font-weight: bold;
  color: green;
}

.orange-font {
  font-weight: bold;
  color: orange;
}

.grey-font {
  font-weight: bold;
  color: grey;
}

.blue-font {
  font-weight: bold;
  color: blue;
}

.red-font {
  font-weight: bold;
  color: red;
}
</style>
