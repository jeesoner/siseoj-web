<template>
  <!-- TODO: add by axiang [20190702] 交互很糟糕，没有颜色区分 -->
  <div class="docker">
    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card"
    >
      <div
        slot="header"
        class="clearfix"
      >校集训队荣誉榜</div>
      <div class="functionBar">
        <el-pagination
          class="pagination"
          layout="prev, pager, next"
          :current-page="currentPage"
          :total="total"
          :page-size="30"
          @current-change="switchPage"
        />
      </div>
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
        highlight-current-row
      >
        <el-table-column
          prop="id"
          label="#"
          width="100"
        />
        <el-table-column
          label="时间"
          width="150"
        ><template slot-scope="scope">
          {{ formatter(scope.row.rewardDate) }}
        </template>
        </el-table-column>
        <el-table-column
          prop="realNameOne"
          label="队员1"
          width="100"
        />
        <el-table-column
          prop="realNameTwo"
          label="队员2"
          width="100"
        />
        <el-table-column
          prop="realNameThree"
          label="队员3"
          width="100"
        />
        <el-table-column
          prop="contestLevel"
          label="级别"
          width="200"
        />
        <el-table-column
          prop="awardLevel"
          label="奖项"
          width="150"
        />
        <el-table-column
          prop="description"
          label="备注"
        />
      </el-table>
    </el-card>
  </div>
</template>
<script>
import formatterDate from '../utils/formatterDate'
export default {
  data() {
    return {
      currentPage: 1,
      total: 0,
      tableData: [],
      isSearch: false
    }
  },
  mounted() {
    this.getHonorRank()
  },
  methods: {
    switchPage(val) {
      this.currentPage = val
      this.getHonorRank()
    },
    async getHonorRank() {
      this.tableData = []
      const params = new URLSearchParams()
      params.append('pageNum', this.currentPage)
      params.append('pageSize', 30)
      const dataHonorRank = await this.$http.get('/border/honor_rank', params)
      this.tableData = dataHonorRank.datas[0]
      this.total = dataHonorRank.datas[1]
    },
    formatter(val) {
      // 格式化日期
      return formatterDate(val, 'yyyy-MM-dd')
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.awardLevel === '金奖' || row.awardLevel === '一等奖') {
        return 'First-row'
      } else if (row.awardLevel === '银奖' || row.awardLevel === '二等奖') {
        return 'second-row'
      } else if (row.awardLevel === '铜奖' || row.awardLevel === '三等奖') {
        return 'third-row'
      }
      return 'other-row'
    }
  }

}
</script>
<style scoped>
.docker {
  margin: 2% 5% 2% 5%;
  width: 90%;
  min-height: 600px;
  padding: 0;
}

.box-card {
  width: 90%;
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

.button {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  height: 30px;
  width: 50px;
}
</style>
