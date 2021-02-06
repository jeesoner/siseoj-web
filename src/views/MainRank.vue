<template>
  <!--TODO: add by axiang [20190702] 颜色表示的逻辑非常糟糕，等待重构 -->
  <div class="docker">
    <el-card class="box-card">
      <div slot="header">用户排名</div>
      <div class="search-bar">
        <el-input
          v-model="input"
          placeholder="Username"
          size="mini"
          style="width:250px"
        >
          <template slot="prepend">查找</template>
        </el-input>
        <el-button
          icon="el-icon-search"
          type="primary"
          size="mini"
          @click="getSearch(1)"
        >确定</el-button>
      </div>

      <div class="functionBar">
        <el-pagination
          class="pagination"
          layout="prev, pager, next"
          :current-page="currentPage"
          :total="currentTotal*10"
          @current-change="getList"
        />

      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
      >
        <el-table-column
          type="index"
          label="积分排行"
          width="100"
          :index="indexMethod"
        >Rank</el-table-column>
        <el-table-column
          label="用户名"
          width="200"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.acnum>=0&&scope.row.acnum<=100"
              style="cursor:pointer;color:gray"
              @click="toUser(scope.row)"
            >{{ scope.row.username }}</div>
            <div
              v-if="scope.row.acnum>=100&&scope.row.acnum<=500"
              style="cursor:pointer;color:blue"
              @click="toUser(scope.row)"
            >{{ scope.row.username }}</div>
            <div
              v-if="scope.row.acnum>=500&&scope.row.acnum<=700"
              style="cursor:pointer;color:purple"
              @click="toUser(scope.row)"
            >{{ scope.row.username }}</div>
            <div
              v-if="scope.row.acnum>=700&&scope.row.acnum<=1000"
              style="cursor:pointer;color:#FF6A6A"
              @click="toUser(scope.row)"
            >{{ scope.row.username }}</div>
            <div
              v-if="scope.row.acnum>=1000"
              style="cursor:pointer;color:orange"
              @click="toUser(scope.row)"
            >{{ scope.row.username }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          width="220"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.acnum>=0&&scope.row.acnum<=100"
              style="color:gray"
            >{{ scope.row.nick }}</div>
            <div
              v-if="scope.row.acnum>=100&&scope.row.acnum<=500"
              style="color:blue"
            >{{ scope.row.nick }}</div>
            <div
              v-if="scope.row.acnum>=500&&scope.row.acnum<=700"
              style="color:purple"
            >{{ scope.row.nick }}</div>
            <div
              v-if="scope.row.acnum>=700&&scope.row.acnum<=1000"
              style="color:orange"
            >{{ scope.row.nick }}</div>
            <div
              v-if="scope.row.acnum>=1000"
              style="color:#FFD700"
            >{{ scope.row.nick }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="motto"
          label="个性宣言"
          width="500"
        />
        <el-table-column label="AC数">
          <template slot-scope="scope">
            <div
              v-if="scope.row.acnum>=0&&scope.row.acnum<=100"
              style="color:gray"
            >{{ scope.row.acnum }}</div>
            <div
              v-if="scope.row.acnum>=100&&scope.row.acnum<=500"
              style="color:blue"
            >{{ scope.row.acnum }}</div>
            <div
              v-if="scope.row.acnum>=500&&scope.row.acnum<=700"
              style="color:purple"
            >{{ scope.row.acnum }}</div>
            <div
              v-if="scope.row.acnum>=700&&scope.row.acnum<=1000"
              style="color:orange"
            >{{ scope.row.acnum }}</div>
            <div
              v-if="scope.row.acnum>=1000"
              style="color:#FFD700"
            >{{ scope.row.acnum }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: '',
      input: '',
      Rank: 0,
      currentPage: 1,
      currentTotal: 0,
      tableData: [],
      isSearch: false
    }
  },
  mounted() {
    this.getAcRank(this.currentPage)
  },
  methods: {
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
      return index + (this.currentPage - 1) * 50 + 1
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
