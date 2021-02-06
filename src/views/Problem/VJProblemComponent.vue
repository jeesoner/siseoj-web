<template>
  <div class="problem-body">
    <div class="function-bar">
      <el-select
        v-model="searchOJId"
        class="bar-search-item-select"
        size="mini"
        placeholder="请选择OJ"
      />
      <el-input
        v-model="searchProId"
        class="bar-search-item-input"
        size="mini"
        placeholder="查找题号"
      />
      <el-input
        v-model="searchTitle"
        class="bar-search-item-input-width"
        size="mini"
        placeholder="查找标题"
      />
      <el-input
        v-model="searchResource"
        class="bar-search-item-input-width"
        size="mini"
        placeholder="查找来源"
      />
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
    <el-pagination
      layout="prev, pager, next"
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
        label="OJ名"
        prop="originOJ"
        min-width="20%"
      />
      <el-table-column
        label="题号"
        prop="originProb"
        min-width="20%"
      />
      <el-table-column
        label="题目标题"
        min-width="30%"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="toSubmit(scope.row.problemId)"
          >{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        min-width="30%"
      >
        <template slot-scope="scope">
          <i
            v-if="scope.row.status===0"
            class="el-icon-success"
          />
          <i
            v-else-if="scope.row.status===1"
            class="el-icon-loading"
          />
          <i
            v-else
            class="el-icon-warning"
          />

          {{ formatterDate(scope.row.triggerTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="题目源"
        min-width="40%"
      >
        <template slot-scope="scope">
          <div v-html="scope.row.source" />
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      class="bottom-pagination"
      layout="prev, pager, next"
      :current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      @current-change="switchPage"
    />
  </div>
</template>

<script>
import formatterDate from '../../utils/formatterDate'
export default {
  props: {
  },
  data() {
    return {
      searchTitle: '',
      searchOJId: '',
      searchProId: '',
      searchResource: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      isSearch: false,
      loading: false
    }
  },
  mounted() {
    this.getProlem()
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
      this.searchTitle = ''
      this.searchOJId = ''
      this.searchProId = ''
      this.searchResource = ''
      this.getProlem()
    },
    toSubmit(pid) {
      // this.$router.push({ path: '/Submit', query: { pid: pid } })
    },
    async getProlem() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('pageNum', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('OJId', this.searchOJId)
      params.append('category', 'all')
      params.append('probNum', this.searchProId)
      params.append('title', this.searchTitle)
      params.append('source', this.searchResource)
      const dataProblemsByPage = await this.$http
        .get('/problem/vj/list', params)
        .catch(() => {
          this.loading = false
        })
      if (dataProblemsByPage.code === 10000) {
        this.tableData = dataProblemsByPage.datas[0].data
        this.total = dataProblemsByPage.datas[0].recordsTotal
        this.$notify({
          title: '与Virtual Judge同步成功',
          duration: 2000,
          type: 'success',
          position: 'top-left',
          dangerouslyUseHTMLString: true,
          offset: 40,
          showClose: false,
          message: '同步时间为：<strong>' + formatterDate(dataProblemsByPage.datas[1]) + '</strong>'
        })
      } else {
        this.$message.error('题目获取失败！')
        this.$notify({
          title: '与Virtual Judge同步失败',
          duration: 2000,
          type: 'error',
          position: 'top-left',
          dangerouslyUseHTMLString: true,
          offset: 40,
          showClose: false,
          message: '同步时间为：<strong>' + formatterDate(dataProblemsByPage.datas[1]) + '</strong><br/>可能原因：Virtual Judge挂了'
        })
      }
      this.loading = false
    },
    // 获取用户解答状态
    async getProblemSovle() {
      // let params = new URLSearchParams()
      // params.append('username', this.$store.getters.getUsername)
      // let dataProblemSolve = await this.$http.get('/problem/getProblemSolve', params)
      // let dataTempSolve = dataProblemSolve.datas[0]
      // for (let i = 0; i < dataTempSolve.length; i++) {
      //   this.problemSolveMap.set(dataTempSolve[i].pid, dataTempSolve[i].solved)
      // }
    },
    async getProblemTags() {
      // let params = new URLSearchParams()
      // let dataProblemTags = await this.$http
      //   .get('/problem_tag/get', params)
      // let dataTempTags = dataProblemTags.datas[0]
      // if (typeof dataTempTags === 'undefined') {
      //   return
      // }
      // dataTempTags.unshift({
      //   id: '',
      //   name: '-'
      // })
      // this.problemTags = dataTempTags
    },
    async getProblemTagRecords() {
      // let params = new URLSearchParams()
      // let dataProblemTags = await this.$http
      //   .get('/problemTag/getAllProblemTagRecord', params)
      // let dataTempTags = dataProblemTags.datas[0]
    },
    formatterDate(val) {
      return formatterDate(val)
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
  width: 100px;
  margin-right: 20px;
}

.bar-search-item-input-width {
  width: 200px;
  margin-right: 20px;
}

.bar-search-item-select {
  width: 150px;
  margin-right: 15px;
}

.bar-search-item {
  margin-right: 15px;
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

.el-icon-success {
  color: green;
}

.el-icon-warning {
  color: red;
}
</style>
