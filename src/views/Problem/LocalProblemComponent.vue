<template>
  <div class="problem-body">
    <div class="function-bar">
      <el-checkbox
        v-model="myCollection"
        class="bar-search-item"
      >我的收藏</el-checkbox>
      <el-input
        v-model="searchTitle"
        class="bar-search-item-input"
        size="mini"
        placeholder="请输入标题"
      >
        <template slot="prepend">标题</template>
      </el-input>
      <el-select
        v-model="searchTag"
        class="bar-search-item-select"
        size="mini"
        placeholder="请选择标签"
      >
        <el-option
          v-for="item in problemTags"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        size="mini"
        class="bar-search-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSelect()"
      >筛选</el-button>
      <el-button
        size="mini"
        class="bar-search-item"
        type="info"
        icon="el-icon-s-grid"
        @click="handleBackToAll"
      >查看全部</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
    >
      <el-table-column
        v-if="this.$store.getters.getIsLogin"
        label="是否解决"
        min-width="20%"
      >
        <template slot-scope="scope">
          <span :class="scope.row.isSolved==='✔'?'success-row':scope.row.isSolved==='？'?'warning-row':'error-row'">{{ scope.row.isSolved }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pid"
        label="#"
        min-width="20%"
      />
      <el-table-column
        prop="title"
        label="题目标题"
        min-width="70%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toSubmit(scope.row.pid)"
          >{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="通过率（通过人数/总提交数）"
        min-width="50%"
      >
        <template slot-scope="scope">
          {{ parseFloat((scope.row.acceptCount ? scope.row.acceptCount / (scope.row.acceptCount + scope.row.attemptCount) : 0) * 100).toFixed(1) }}%
        </template>
      </el-table-column>
      <el-table-column
        label="题目难度"
        min-width="20%"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.levelId === 1 ? 'success' : scope.row.levelId === 2 ? 'warning' : 'danger'"
            effect="dark"
          > {{ scope.row.level.name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="题目来源"
        prop="source.name"
        min-width="20%"
      />
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
import crudTag from '@/api/problemset/tag'
import curdProblem from '@/api/problemset/problem'

export default {
  props: {
  },
  data() {
    return {
      myCollection: false,
      searchTitle: '',
      searchTag: '',
      problemTags: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      isSearch: false,
      loading: false
    }
  },
  mounted() {
    this.getProlem()
    this.getProblemTags()
  },
  methods: {
    switchPage(val) {
      this.currentPage = val
      this.getProlem()
    },
    handleSelect() {
      this.currentPage = 1
      this.getProlem()
    },
    handleBackToAll() {
      this.currentPage = 1
      this.myCollection = false
      this.searchTitle = ''
      this.searchTag = ''
      this.getProlem()
    },
    toSubmit(pid) {
      this.$router.push({ path: '/Submit', query: { pid: pid }})
    },
    // 将筛选逻辑放在后端去做
    async getProlem() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('current', this.currentPage)
      params.append('size', this.pageSize)
      params.append('tagId', this.searchTag)
      params.append('title', this.searchTitle)
      curdProblem.getPage(params).then(res => {
        this.tableData = res.records
        this.total = res.total
      })
      this.loading = false
    },
    // 获取用户解答状态
    async getProblemSovle() {
      const params = new URLSearchParams()
      params.append('username', this.$store.getters.getUsername)
      const dataProblemSolve = await this.$http.get('/problem/getProblemSolve', params)
      const dataTempSolve = dataProblemSolve.datas[0]
      for (let i = 0; i < dataTempSolve.length; i++) {
        this.problemSolveMap.set(dataTempSolve[i].pid, dataTempSolve[i].solved)
      }
    },
    // 获取所有题目标签
    getProblemTags() {
      crudTag.getAll().then(res => {
        this.problemTags = res
        console.log(res)
      })
    },
    getProblemTagRecords() {
      // let params = new URLSearchParams()
      // let dataProblemTags = await this.$http
      //   .get('/problemTag/getAllProblemTagRecord', params)
      // let dataTempTags = dataProblemTags.datas[0]
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Submit') {
      from.meta.keepAlive = true
    } else {
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
  float: left;
  width: 250px;
  margin-right: 20px;
}

.bar-search-item-select {
  float: left;
  width: 200px;
  margin-right: 20px;
}

.bar-search-item {
  float: left;
  margin-right: 20px;
}

.search-button {
  float: left;
}

.bottom-pagination {
  float: right;
  margin-bottom: 10px;
}

.success-row {
  font-weight: bold;
  color: green;
}

.error-row {
  font-weight: bold;
  color: red;
}

.warning-row {
  font-weight: bold;
  color: blue;
}
</style>
