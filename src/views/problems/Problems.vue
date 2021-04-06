<template>
  <div class="problem-body">
    <el-card class="box-card">
      <div slot="header">题库</div>
      <div class="function-bar">
        <el-input
          v-model="queryParams.keyword"
          class="bar-search-item-input"
          size="mini"
          placeholder="请输入题号或标题"
          clearable
        />
        <el-select
          v-model="queryParams.tid"
          class="bar-search-item-select"
          size="mini"
          placeholder="请选择标签"
          clearable
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
          @click="search"
        >搜索</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        highlight-current-row
      >
        <el-table-column
          min-width="3%"
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
          prop="pid"
          label="ID"
          min-width="12%"
        />
        <el-table-column
          prop="title"
          label="题目标题"
          show-overflow-tooltip
          min-width="25%"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="toProblemDetails(scope.row.pid, scope)"
            >{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="题目难度"
          min-width="10%"
        >
          <template slot-scope="scope">
            <el-tag
              :type="getLevelColor(scope.row.difficulty)"
              effect="dark"
              size="small"
            > {{ PROBLEM_LEVEL[scope.row.difficulty].name }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          min-width="20%"
        >
          <template slot-scope="scope">
            <span
              v-for="tag in scope.row.tags"
              :key="tag.id"
              class="el-tag el-tag--mini el-tag--light is-hit"
              style="margin-right: 7px;margin-top:4px"
            >{{ tag.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="20%"
          label="题目来源"
          prop="source.name"
        />
        <el-table-column
          label="通过率"
          min-width="10%"
        >
          <template slot-scope="scope">
            {{ getPercentage(scope.row.accept, scope.row.total).toFixed(2) }}%
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PROBLEM_LEVEL, JUDGE_STATUS } from '@/utils/constants'
import Pagination from '@/components/Pagination'
import crudTag from '@/api/problemset/tag'
import curdProblem from '@/api/problemset/problem'
export default {
  name: 'Problems',
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
      isGetStatusOk: false,
      loading: false,
      PROBLEM_LEVEL: {},
      JUDGE_STATUS: {},
      // 表格数据
      tableData: [],
      problemTags: []
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  created() {
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS)
    this.PROBLEM_LEVEL = Object.assign({}, PROBLEM_LEVEL)
  },
  mounted() {
    this.search()
    this.getProblemTags()
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
      curdProblem.getProblems(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.getUserProblemStatus()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    toProblemDetails(pid, row) {
      this.$router.push({ name: 'ProblemDetails', params: { pid: pid }})
    },
    getLevelColor(difficulty) {
      return PROBLEM_LEVEL[difficulty].type
    },
    // 获取用户解答状态
    getUserProblemStatus() {
      // 如果是登录状态
      if (this.isAuthenticated) {
        this.isGetStatusOk = false
        // 如果没有题目则不查询用户解答情况
        if (this.tableData.length <= 0) {
          return
        }
        const pidList = []
        const isContestProblemList = false
        this.tableData.forEach(value => {
          pidList.push(value.pid)
        })
        curdProblem.getUserProblemStatus(pidList, isContestProblemList).then(res => {
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i]['userStatus'] = res[this.tableData[i].pid]
          }
          this.isGetStatusOk = true
        }).catch(() => {
          this.isGetStatusOk = false
        })
      }
    },
    // 获取所有题目标签
    getProblemTags() {
      crudTag.getAllTag().then(res => {
        this.problemTags = res
      })
    },
    getPercentage(accept, total) {
      if (total) {
        return Math.round((accept / total) * 10000) / 100.0
      } else {
        return 0
      }
    },
    getIconColor(status) {
      return (
        'font-weight: 600;font-size: 16px;color:' + JUDGE_STATUS[status].rgb
      )
    }
  }
}
</script>

<style scoped>
.problem-body {
  width: 100%;
  min-height: 700px;
  padding-top: 0;
  margin: 0 0 20px;
}

.box-card {
  width: 85%;
  min-height: 450px;
  display: block;
  margin: auto auto 2%;
  padding: 0;
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

</style>
