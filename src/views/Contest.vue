<template>
  <!-- FIXME: add by axiang [20190702] 交互性不明确，显示的内容不全面，功能不完整。建议重构，计划中-->
  <div class="contest-body">
    <el-card class="box-card">
      <div slot="header">比赛列表</div>
      <div class="contest-filter">
        <el-row
          type="flex"
          :gutter="15"
        >
          <el-col :span="5">
            <el-input
              v-model="searchName"
              placeholder="请输入比赛名称"
              size="mini"
            >
              <template slot="prepend">比赛名</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="searchPermission"
              placeholder="请选择权限"
              size="mini"
            >
              <el-option
                v-for="item in permissionType"
                :key="item.id"
                :class="switchPermissionClass(item.name)"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="searchStatus"
              placeholder="请选择状态"
              size="mini"
            >
              <el-option
                v-for="item in statusType"
                :key="item.id"
                :class="switchStatusClass(item.name)"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="handleSelect()"
            >筛选</el-button>
          </el-col>
        </el-row>
      </div>
      <el-pagination
        layout="total, prev, pager, next, jumper"
        :current-page="currentPage"
        :total="currentTotal"
        :page-size="pageSize"
        @current-change="swithPage"
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
          label="类型"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div :class="switchKindClass(scope.row.kind)">{{ scope.row.kind }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="比赛名称"
          min-width="30%"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="toContestInfo(scope.row)"
            >{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          min-width="15%"
        ><template slot-scope="scope">{{ new Date(scope.row.beginTime).toLocaleString('chinese', { hour12: false }) }}</template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          min-width="15%"
        ><template slot-scope="scope">{{ new Date(scope.row.endTime).toLocaleString('chinese', { hour12: false }) }}</template></el-table-column>
        <el-table-column
          label="权限"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div :class="switchPermissionClass(scope.row.permission)">{{ scope.row.permission }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="10%"
        >
          <template slot-scope="scope">
            <div :class="switchStatusClass(scope.row.status)">{{ scope.row.status }}</div>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        class="bottom-pagination"
        layout="total, prev, pager, next, jumper"
        :current-page="currentPage"
        :total="currentTotal"
        :page-size="pageSize"
        @current-change="swithPage"
      />
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage: 1,
      currentTotal: 0,
      pageSize: 20,
      tableData: [],
      searchName: '',
      searchPermission: '',
      searchStatus: '',

      isSearch: false,
      loading: false,
      permissionType: [
        { id: '', name: '-' },
        { id: 0, name: '公开' },
        { id: 1, name: '密码' },
        { id: 2, name: '私有' },
        { id: 3, name: '注册' },
        { id: 4, name: '正式' },
        { id: 5, name: '组队' }
      ],
      statusType: [
        { id: '', name: '-' },
        { id: 0, name: '未开始' },
        { id: 1, name: '正在进行' },
        { id: 2, name: '已结束' }

      ]
    }
  },
  watch: {
    /*
     多个比赛列表用的同一个组件，传入不同参数，
     如果单纯改变参数则不刷新。以下逻辑为强制刷新
     */
    '$route'(to, from) {
      this.currentPage = 1
      this.searchName = ''
      this.searchPermission = ''
      this.searchStatus = ''
      this.getContest()
    }
  },
  mounted() {
    this.getContest()
  },
  methods: {
    handleSelect() {
      this.currentPage = 1
      this.getContest()
    },
    async getContest() {
      this.loading = true
      this.tableData = []
      const params = new URLSearchParams()
      params.append('kind', this.$route.query.kind)
      params.append('pageNum', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('searchName', this.searchName)
      params.append('searchPermission', this.searchPermission)
      params.append('searchStatus', this.searchStatus)
      // params.append('ctype', xxx)
      // params.append('status',xxx)
      const dataAllContest = await this.$http.get('/contest/list', params)
      this.tableData = dataAllContest.datas[0]
      this.currentTotal = dataAllContest.datas[1]
      this.loading = false
    },
    swithPage(val) {
      this.currentPage = val
      this.getContest()
    },
    // CSS选择
    switchKindClass(val) {
      if (val === '练习') {
        return 'green-font'
      } else if (val === '积分') {
        return 'blue-font'
      } else if (val === '趣味') {
        return 'black-font'
      } else if (val === '正式') {
        return 'gray-font'
      } else if (val === 'DIY') {
        return 'lightcoral-font'
      } else {
        return ''
      }
    },
    // CSS选择
    switchPermissionClass(val) {
      if (val === '公开') {
        return 'green-font'
      } if (val === '密码') {
        return 'red-font'
      } if (val === '注册') {
        return 'blue-font'
      } if (val === '正式') {
        return 'orange-font'
      } else if (val === '私有') {
        return 'purple-font'
      } else {
        return 'black-font'
      }
    },
    switchStatusClass(val) {
      if (val === '正在进行') {
        return 'green-font'
      } else if (val === '已结束') {
        return 'red-font'
      } else {
        return 'blue-font'
      }
    },
    // toSignUp (row) {
    //   if (!this.$store.getters.getIsLogin) {
    //     this.$notify({
    //       title: '提示',
    //       message: '登录后才能查看哦',
    //       type: 'warning',
    //       offset: 100,
    //       duration: 3000
    //     })
    //   } else if (row.status === 2) {
    //     this.$message({
    //       message: '比赛已经结束，不能报名！',
    //       type: 'error'
    //     })
    //   } else if (row.status === 0) {
    //     this.$message({
    //       message: '比赛已开始，不能报名！',
    //       type: 'error'
    //     })
    //   } else {
    //     this.$router.push({
    //       path: '/ContestSignUp',
    //       query: {
    //         cid: row.id
    //       }
    //     })
    //   }
    // },
    async toContestInfo(row) {
      // console.log(row.id)
      if (!this.$store.getters.getIsLogin) {
        this.$notify({
          title: '提示',
          message: '登录后才能查看比赛内容',
          type: 'warning',
          offset: 100,
          duration: 3000
        })
      } else {
        // FIXME: 这里暂时还没详细判断限制条件，暂时注释掉，直接进入
        if (row.status === 1) {
          this.$message.warning('比赛还未开始，不允许查看！')
        } else {
          this.$router.push({
            path: '/ContestInfo',
            query: {
              cid: row.id
            }
          })
        }
      }
      // else {
      //
      // let params = new URLSearchParams()
      // params.append('cid', row.id)
      // params.append('username', this.$store.getters.getUsername)
      // let dataProblemByTitle = await this.$http
      //   .get('/problem/GProblemByTitle', params)
      //   .catch(() => { })
      // console.log(dataProblemByTitle)
      //   if (dataProblemByTitle.data[0] === '该用户已报名') {
      //     this.$router.push({
      //       path: '/ContestInfo',
      //       query: {
      //         cid: row.id
      //       }
      //     })
      //   } else {
      //     this.$message({
      //       message: '请先报名才能进入！',
      //       type: 'error'
      //     })
      //   }
      // } else if (row.ctype === 1 || row.ctype === 2) {
      //   this.$prompt('请输入密码', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   })
      //     .then(({
      //       value
      //     }) => {
      //       this.vertifyPassword(value, row.id)
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '取消输入'
      //       })
      //     })
      // } else {
      //   this.$router.push({
      //     path: '/ContestInfo',
      //     query: {
      //       cid: row.id
      //     }
      //   })
      // }
      // }
    }
  }
  // async vertifyPassword (val, val2) {
  //   let params = new URLSearchParams()
  //   params.append('password', val)
  //   params.append('cid', val2)
  //   let {
  //     data
  //   } = await this.$http
  //     .post('/CheckContestPassword', params)
  //     .catch(() => {
  //       this.$message({
  //         message: '服务器繁忙，请稍后再试！',
  //         type: 'error'
  //       })
  //     })
  //   if (data.data[0] === '密码输入错误') {
  //     this.$message({
  //       message: data.data[0],
  //       type: 'error'
  //     })
  //   } else {
  //     // add by axiang [20190618] 变量定义后从未使用，出错，待修改，先注释掉
  //     // this.$router.push({ path: '/ContestInfo', query: { cid: row.id } })
  //   }
  // },
}

</script>
<style scoped>
.contest-body {
  width: 90%;
  margin: auto;
}

.box-card {
  width: 90%;
  height: 100%;
  margin: auto;
}

.contest-head {
  background-color: #f5f5f5;
  height: 20px;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid #eeeeee;
  padding: 10px 15px;
  display: block;
}

.contest-filter {
  margin: 0;
  padding: 10px 15px;
  border-bottom: 1px solid #eeeeee;
  height: 30px;
  width: 100%;
}

.green-font {
  color: green;
  font-weight: bold;
}

.darkgreen-font {
  color: darkgreen;
  font-weight: bold;
}

.blue-font {
  color: blue;
  font-weight: bold;
}

.black-font {
  color: black;
  font-weight: bold;
}

.gray-font {
  color: gray;
  font-weight: bold;
}

.purple-font {
  color: purple;
  font-weight: bold;
}

.lightcoral-font {
  color: lightcoral;
  font-weight: bold;
}

.red-font {
  color: red;
  font-weight: bold;
}

.orange-font {
  color: darkorange;
  font-weight: bold;
}

.bottom-pagination {
  float: right;
  margin-bottom: 10px;
}
</style>
