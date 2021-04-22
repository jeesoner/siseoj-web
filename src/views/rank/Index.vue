<template>
  <div class="docker">
    <el-card class="box-card">
      <div slot="header">用户排名</div>
      <div class="function-bar">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名或昵称"
          size="mini"
          style="width:250px"
        />
        <el-select v-model="queryParams.type" size="mini" placeholder="榜单类型">
          <el-option label="Rating榜" value="1" />
          <el-option label="Accept榜" value="2" />
        </el-select>
        <el-button
          size="mini"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-search"
          @click="search()"
        >搜索</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        highlight-current-row
      >
        <el-table-column width="100" type="index" label="排名" :index="indexMethod" />
        <el-table-column
          label="用户名"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          width="220"
        >
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column
          prop="motto"
          label="个性签名"
          width="500"
          show-overflow-tooltip
        />
        <el-table-column label="AC数">
          <template slot-scope="scope">
            {{ scope.row.accept }}
          </template>
        </el-table-column>
        <el-table-column label="Solved数">
          <template slot-scope="scope">
            {{ scope.row.solved }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="Rating"
        >
          <template slot-scope="scope">{{ scope.row.rating }}</template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    </el-card>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import rankApi from '@/api/rank/rank'

export default {
  name: 'Rank',
  components: { Pagination },
  data() {
    return {
      // 查询参数
      queryParams: {
        type: '1'
      },
      total: 10,
      pagination: {
        size: 10,
        current: 1
      },
      loading: '',
      input: '',
      Rank: 0,
      currentPage: 1,
      currentTotal: 0,
      tableData: [],
      isSearch: false
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    fetch(params = {}) {
      params.size = this.pagination.size
      params.current = this.pagination.current
      this.loading = true
      // 分页查询
      rankApi.getRank(params).then(res => {
        console.log(res.records)
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    async getAcRank(val) {
      this.tableData = []
      this.loading = true
      const params = new URLSearchParams()
      params.append('pagenum', val)
      this.currentPage = val
      const dataUserRank = await this.$http.get('/rank/GUserRank', params)
      this.loading = false
      this.currentTotal = dataUserRank.datas[0]
      // console.log(this.currentTotal)
      this.tableData = dataUserRank.datas[1]
      this.Rank = 0
    },
    async getSearch(val) {
      if (this.input !== null) {
        this.loading = true
        this.currentPage = val
        this.isSearch = true
        const params = new URLSearchParams()
        params.append('username', this.input)
        params.append('pagenum', this.currentPage)
        const dataUserRankByName = await this.$http.post('/rank/GUserRankByName', params)
        this.loading = false
        this.tableData = []
        this.currentTotal = dataUserRankByName.datas[0]
        this.tableData = dataUserRankByName.datas[1]
      }
    },
    getList(val) {
      if (this.isSearch) {
        this.getSearch(val)
      } else {
        this.getAcRank(val)
      }
    },
    indexMethod(index) {
      return 1 + index + (this.pagination.current - 1) * this.pagination.size
    },
    toUser(row) {
      this.$router.push({ path: '/User', query: { username: row.username }})
    }
  }
}
</script>
<style scoped>
.docker {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 700px;
}
.box-card {
  width: 85%;
  height: 100%;
  min-height: 500px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  margin-top: 2%;
  margin-bottom: 2%;
}
.function-bar {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.functionBar {
  width: 100%;
  margin: 0;
  padding: 0;
  height: 50px;
  border-bottom: 1px solid silver;
}

.search-bar {
  width: 40%;
}

.pagination {
  float: left;
  margin-left: 10px;
  height: 30px;
  margin-top: 10px;
}

.input {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  height: 30px;
  width: 200px;
}
</style>
