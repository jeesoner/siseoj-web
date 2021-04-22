<template>
  <div class="docker">
    <el-card class="box-card">
      <div slot="header">讨论区</div>
      <div class="function-bar">
        <el-input
          v-model="queryParams.keyword"
          class="bar-search-item-input"
          size="mini"
          placeholder="请输入标题"
          clearable
        />
        <el-button
          size="mini"
          class="bar-search-item"
          type="primary"
          icon="el-icon-search"
          @click="search"
        >搜索</el-button>
        <el-button
          size="mini"
          class="bar-search-item"
          @click="addDiscuss"
        >新建帖子</el-button>
      </div>
      <el-table
        v-loading="loading"
        style="width:100%;"
        :data="tableData"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column
          label="标题"
          width=""
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="toDiscussDetail(scope.row)"
            >{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="描述" show-overflow-tooltip prop="description" />
        <el-table-column
          prop="createTime"
          label="发布时间"
          width="200"
        />
        <el-table-column
          label="发布人"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.nickname }}
            <!-- <el-link
              type="primary"
              @click="toUser(scope.row)"
            >{{ scope.row.nickname }}</el-link> -->
          </template>
        </el-table-column>
        <el-table-column width="130px" align="center" fixed="right">
          <template v-if="scope.row.uid === user.id" slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)" />
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="del(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    </el-card>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import discussApi from '@/api/discuss/discuss'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 查询参数
      queryParams: {},
      total: 10,
      pagination: {
        size: 10,
        current: 1
      },
      input: '',
      loading: '',
      currentPage: 1,
      currentTotal: 0,
      tableData: [],
      isSearch: false,
      isLogin: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
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
      discussApi.getDiscuss().then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新建
    addDiscuss() {
      this.$router.push({ name: 'EditDiscuss' })
    },
    toDiscussDetail(data) {
      console.log(data)
      this.$router.push({ name: 'DiscussDetail', params: { id: data.id, discuss: data }})
    },
    edit(data) {
      this.$router.push({ name: 'EditDiscuss', params: { id: data.id }})
    },
    del(id) {
      discussApi.del(id).then(res => {
        this.$message.success('删除成功')
        this.search()
      })
    }
  }
}
</script>
<style scoped>
.docker {
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
  width: 200px;
  margin-right: 20px;
}

.bar-search-item-select {
  float: left;
  width: 200px;
  margin-right: 20px;
}

.discuss-head {
  background-color: #f5f5f5;
  height: 20px;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid #eeeeee;
  padding: 10px 15px;
  display: block;
}
.pagination {
  float: left;
  margin-left: 10px;
  height: 30px;
  margin-top: 10px;
}

.functionBar {
  width: 100%;
  margin: 0;
  padding: 0;
  height: 50px;
  border-bottom: 1px solid silver;
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
