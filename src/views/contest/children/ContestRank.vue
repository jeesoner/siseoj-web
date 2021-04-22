<template>
  <div>
    <el-table
      v-loading="loading"
      :data="rankList"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :cell-style="setCellColor"
    >
      <el-table-column label="名次" type="index" width="80" align="center" />
      <el-table-column label="参赛者" show-overflow-tooltip prop="username" width="200" />
      <el-table-column label="总分" prop="score" align="center" />
      <el-table-column
        v-for="problem in contestProblem"
        :key="problem.displayId"
        align="center"
      >
        <template v-slot:header>
          <span><a style="color:#495060;">{{ String.fromCharCode(Number(problem.displayId) + 65) }}</a></span>
        </template>
        <template slot-scope="{ row }">
          <span v-if="row.details[problem.displayId]" style="font-weight: bold; color: rgb(82, 196, 26);">
            <i v-if="row.details[problem.displayId].score === 0" class="el-icon-check" />
            <span v-else>{{ getScore(row.details[problem.displayId].score) }}</span>
          </span><br>
          <span v-if="row.details[problem.displayId] && row.details[problem.displayId].runningTime" class="time">
            {{ getTime(row.details[problem.displayId].runningTime) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
  </div>
</template>

<script>
import contestApi from '@/api/contest/contest'
import Pagination from '@/components/Pagination'
import moment from 'moment'

export default {
  name: 'ContestRank',
  components: { Pagination },
  data() {
    return {
      loading: false,
      // 查询参数
      queryParams: {},
      total: 10,
      pagination: {
        size: 10,
        current: 1
      },
      contestProblem: [],
      rankList: []
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.search()
  },
  methods: {
    init() {
      this.$store.dispatch('getContestProblems').then((res) => {
        this.contestProblem = res
      }).catch(() => {})
    },
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
      contestApi.getContestRank(this.$route.params.contestId, params).then(res => {
        this.total = res.total
        this.rankList = res.records
        console.log(res)
        this.loading = false
      }).catch((error) => {
        this.loading = false
        console.log(error)
      })
    },
    setCellColor({ row, column, rowIndex, columnIndex }) {
      // 题目是在第四行开始，所以要>=3
      if (columnIndex >= 3) {
        const item = row.details[this.contestProblem[columnIndex - 3].displayId]
        // 如果存在该题目信息
        if (item) {
          if (item.score >= 0) {
            return 'background-color: #D9F0C7; border: 1px solid  #fff; padding: 0;'
          } else {
            return 'background-color: #FFDDDD; border: 1px solid #fff; padding: 0;'
          }
        } else {
          return 'border: 1px solid #fff; padding: 0;'
        }
      }
    },
    getScore(value) {
      if (value > 0) {
        return '+' + value
      } else {
        return value
      }
    },
    getTime(value) {
      const time = moment.duration(value, 'seconds')
      const hours = time.hours()
      const minutes = time.minutes()
      return '(' + moment({ h: hours, m: minutes }).format('HH:mm') + ')'
    }
  }
}
</script>

<style scoped>
.time {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
</style>
