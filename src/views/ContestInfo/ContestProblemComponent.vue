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
      layout="total, prev, pager, next, jumper"
      :current-page="currentPage"
      :total="total"
      :page-size="50"
      @current-change="switchPage"
    />
    <el-table
      v-loading="loading"
      style="width:100%;"
      :data="tableData"
    >
      <el-table-column
        label="是否解决"
        min-width="20%"
      >
        <template slot-scope="scope">
          <span :class="scope.row.isSolved==='✔'?'success-row':scope.row.isSolved==='?'?'error-row':''">{{ scope.row.isSolved }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="#"
        min-width="20%"
      />
      <el-table-column
        prop="Title"
        label="题目标题"
        min-width="80%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toSubmit(scope.row.id)"
          >{{ scope.row.Title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="Ratio"
        label="通过率（通过人数/总提交数）"
        min-width="20%"
      />
    </el-table>
  </div>
</template>

<script>
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
      total: 0,
      tableData: [],
      problemSolveMap: new Map(),
      isSearch: false,
      loading: false
    }
  },
  mounted() {
    // 如果不是显示比赛界面
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
    // add by axiang [20190714] 船新升级版逻辑，将筛选逻辑放在后端去做
    async getProlem() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('pageNum', this.currentPage)
      params.append('tagId', this.searchTag)
      params.append('title', this.searchTitle)
      params.append('username', this.$store.getters.getUsername)
      params.append('isStar', this.myCollection)
      const dataProblemsByPage = await this.$http
        .get('/problem/getProblems', params)
        .catch(() => {
          this.loading = false
        })
      this.tableData = []
      const tableDataTemp = dataProblemsByPage.datas[0]
      this.total = dataProblemsByPage.datas[1]
      if (this.problemSolveMap.size === 0) {
        await this.getProblemSovle()
      }
      for (let i = 0; i < tableDataTemp.length; i++) {
        const isSolvedTemp = this.problemSolveMap.get(tableDataTemp[i].pid) === 0 ? '?'
          : this.problemSolveMap.get(tableDataTemp[i].pid) === 1 ? '✔' : undefined
        this.tableData.push({
          isSolved: isSolvedTemp,
          // isSolved: this.problemSolveMap.get(tableDataTemp[i].pid),
          id: tableDataTemp[i].pid,
          Title: tableDataTemp[i].title,
          Ratio: tableDataTemp[i].strRadio +
            '(' +
            tableDataTemp[i].totalAcUser +
            '/' +
            tableDataTemp[i].totalSubmit +
            ')'
        })
      }
      this.loading = false
    },
    async getProblemSovle() {
      const params = new URLSearchParams()
      params.append('username', this.$store.getters.getUsername)
      const dataProblemSolve = await this.$http.get('/problem/getProblemSolve', params)
      const dataTempSolve = dataProblemSolve.datas[0]
      const map = new Map()
      for (let i = 0; i < dataTempSolve.length; i++) {
        map.set(dataTempSolve[i].pid, dataTempSolve[i].solved)
      }

      this.problemSolveMap = map
    },
    async getProblemTags() {
      const params = new URLSearchParams()
      const dataProblemTags = await this.$http
        .get('/problemTag/getAllProblemTag', params)
      const dataTempTags = dataProblemTags.datas[0]
      if (typeof dataTempTags === 'undefined') {
        return
      }
      dataTempTags.unshift({
        id: '',
        name: '-'
      })
      this.problemTags = dataTempTags
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
  /* background-color: aqua; */
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
}

.search-button {
  float: left;
}

.el-pagination {
  float: left;
}

.success-row {
  font-weight: bold;
  color: green;
}

.error-row {
  font-weight: bold;
  color: blue;
}
</style>
