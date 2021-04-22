<template>
  <div class="contest-body">
    <el-card class="box-card">
      <div slot="header">题库</div>
      <div class="function-bar">
        <el-input
          v-model="queryParams.keyword"
          class="bar-search-item-input"
          size="mini"
          placeholder="请输入比赛名称"
          clearable
        />
        <el-select
          v-model="queryParams.status"
          class="bar-search-item-select"
          size="mini"
          placeholder="请选择比赛状态"
          clearable
        >
          <el-option label="Scheduled" value="-1" />
          <el-option label="Running" value="0" />
          <el-option label="Ended" value="1" />
        </el-select>
        <el-button
          size="mini"
          class="bar-search-item"
          type="primary"
          icon="el-icon-search"
          @click="search"
        >搜索</el-button>
      </div>
      <p v-show="contests.length === 0" id="no-contest">暂无比赛</p>
      <ol id="contest-list">
        <li v-for="contest in contests" :key="contest.title" :style="getBorderColor(contest)">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :xs="10" :sm="4" :md="3" :lg="2">
              <img class="trophy" :src="acmSrc" width="95px" alt="图片不见了">
            </el-col>
            <el-col :xs="10" :sm="16" :md="19" :lg="20" class="contest-main">
              <p class="title">
                <a class="entry" style="cursor: pointer" @click.stop="toContest(contest)">
                  {{ contest.title }}
                </a>
                <template v-if="contest.auth === 1">
                  <i class="el-icon-lock" size="20" style="color:#d9534f" />
                </template>
                <template v-if="contest.auth === 2">
                  <i class="el-icon-lock" size="20" style="color:#f0ad4e" />
                </template>
              </p>
              <ul class="detail">
                <li>
                  <i class="el-icon-date" aria-hidden="true" style="color: #3091f2" />
                  {{ contest.startTime }}
                </li>
                <li>
                  <i class="el-icon-time" aria-hidden="true" style="color: #3091f2" />
                  {{ getDuration(contest.startTime,contest.endTime) }}
                </li>
                <li>
                  <el-tooltip :content="CONTEST_TYPE_REVERSE[contest.type].tips" placement="top" effect="light">
                    <el-button
                      size="mini"
                      round
                    >
                      {{ CONTEST_TYPE_REVERSE[contest.type]['name'] }}
                    </el-button>
                  </el-tooltip>
                </li>
                <li>
                  <el-tooltip :content="CONTEST_AUTH_REVERSE[contest.auth].tips" placement="top" effect="light">
                    <el-tag
                      :type="CONTEST_AUTH_REVERSE[contest.auth]['color']"
                      effect="plain"
                    >
                      {{ CONTEST_AUTH_REVERSE[contest.auth]['name'] }}
                    </el-tag>
                  </el-tooltip>
                </li>
              </ul>
            </el-col>
            <el-col :xs="4" :sm="4" :md="2" :lg="2" style="text-align: center">
              <el-tag
                effect="dark"
                :color="CONTEST_STATUS_REVERSE[contest.status]['color']"
                size="medium"
              >
                {{ CONTEST_STATUS_REVERSE[contest.status]['name'] }}
              </el-tag>
            </el-col>
          </el-row>
        </li>
      </ol>
      <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    </el-card>
  </div>
</template>

<script>
import { CONTEST_STATUS_REVERSE, CONTEST_AUTH_REVERSE, CONTEST_TYPE_REVERSE, CONTEST_AUTH } from '@/utils/constants'
import Pagination from '@/components/Pagination'
import time from '@/utils/time'
import contestApi from '@/api/contest/contest'
import { mapGetters } from 'vuex'

export default {
  name: 'Contests',
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
      tableData: [],
      acmSrc: require('@/assets/image/acm.jpg'),
      contests: [],
      CONTEST_STATUS_REVERSE: {},
      CONTEST_AUTH_REVERSE: {},
      CONTEST_TYPE_REVERSE: {}
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  mounted() {
    this.CONTEST_STATUS_REVERSE = Object.assign({}, CONTEST_STATUS_REVERSE)
    this.CONTEST_AUTH_REVERSE = Object.assign({}, CONTEST_AUTH_REVERSE)
    this.CONTEST_TYPE_REVERSE = Object.assign({}, CONTEST_TYPE_REVERSE)
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
      // 分页查询
      contestApi.getContests(params).then(res => {
        this.contests = res.records
        this.total = res.total
      }).catch(() => {})
    },
    getDuration(startTime, endTime) {
      return time.duration(startTime, endTime)
    },
    getBorderColor(contest) {
      return 'border-left: 4px solid ' + CONTEST_STATUS_REVERSE[contest.status]['color']
    },
    toContest(contest) {
      if (
        contest.type !== CONTEST_AUTH.PRIVATE &&
        !this.isAuthenticated
      ) {
        this.$message.warning('请先登录')
        this.$router.push({ name: 'Login' })
      } else {
        this.$router.push({
          name: 'ContestDetails',
          params: { contestId: contest.id }
        })
      }
    }
  }
}
</script>

<style scoped>
.contest-body {
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
  font-size: 14px;
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

#no-contest {
  text-align: center;
  font-size: 16px;
  padding: 20px;
}
@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 2px;
  }
  ol{
    padding-inline-start: 5px;
  }
  ::v-deep .el-card__header {
    margin-bottom: 5px;
  }
}
@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}
::v-deep .el-card__header {
  border-bottom: 0px;
}

#contest-list > li {
  padding: 5px;
  margin-left: -20px;
  margin-top: 10px;
  width: 100%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
  list-style: none;
}
#contest-list .trophy {
  height: 70px;
  margin-left: 10px;
  margin-right: -20px;
}
#contest-list .contest-main {
  text-align: left;
}
#contest-list .contest-main .title {
  font-size: 18px;
  padding-left: 8px;
  margin-bottom: 0;
}
#contest-list .contest-main .title a.entry {
  color: #495060;
}
#contest-list .contest-main .title a:hover {
  color: #2d8cf0;
  border-bottom: 1px solid #2d8cf0;
}
#contest-list .contest-main .detail {
  padding-left: 0;
  padding-bottom: 10px;
}
#contest-list .contest-main li {
  display: inline-block;
  padding: 10px 0 0 10px;
}
.el-tag--dark {
  border-color: #fff;
}
</style>
