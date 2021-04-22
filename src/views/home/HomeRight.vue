<template>
  <div>
    <el-card id="topborder">
      <div slot="header">
        我的
      </div>
      <div v-if="this.$store.getters.isAuthenticated">
        亲爱的 {{ this.$store.getters.getUsername }}：
        <br>
        今天你尝试了{{ todayTry }}题，AC了 {{ todayAc }} 题，真是美好的一天呢
      </div>
      <div v-else>
        还没登录？赶快<a href="/login">登录</a>解锁更多内容！
      </div>
    </el-card>
    <el-card id="topborder">
      <div slot="header">
        <span class="title-text"><i class="el-icon-medal-1" /> Rating榜</span>
        <el-link
          type="info"
          class="elcard-showmore-link"
          href="rank"
        >查看全部</el-link>
      </div>
      <el-table
        v-loading="query.ratingLoading"
        :data="ratingTop"
        :cell-style="{padding:5+'px'}"
      >
        <el-table-column
          type="index"
          label="#"
          min-width="20%"
        />
        <el-table-column
          label="用户名"
          min-width="50%"
        >
          <template slot-scope="scope">
            <span
              :style="selectColor(scope)"
              @click="toUser(scope.row.uid)"
            >{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Rating"
          min-width="30%"
        >
          <template slot-scope="scope">
            <span
              :style="selectColor(scope)"
              @click="toUser(scope.row.uid)"
            >{{ scope.row.rating }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card id="topborder">
      <div slot="header">
        <span class="title-text"><i class="el-icon-medal-1" /> AC榜</span>
        <el-link
          type="info"
          class="elcard-showmore-link"
          href="rank"
        >查看全部</el-link>
      </div>
      <el-table
        v-loading="query.acceptLoading"
        :data="acTop"
        :cell-style="{padding:5+'px'}"
      >
        <el-table-column
          type="index"
          label="#"
          min-width="20%"
        />
        <el-table-column
          label="用户名"
          min-width="50%"
        >
          <template slot-scope="scope">
            <div
              :style="selectColor(scope)"
              @click="toUser(scope.row.uid)"
            >{{ scope.row.nickname }}</div>
          </template></el-table-column>
        <el-table-column
          label="AC题数"
          min-width="30%"
        >
          <template slot-scope="scope">
            <div
              :style="selectColor(scope)"
              @click="toUser(scope.row.uid)"
            >{{ scope.row.accept }}</div>
          </template></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { RATING_LEVEL_REVERSE } from '@/utils/constants'
import rankApi from '@/api/rank/rank'

export default {
  data() {
    return {
      todayAc: 0,
      todayTry: 0,
      acTop: [],
      acbTop: [],
      ratingTop: [],
      activeTop: [],
      query: {
        ratingLoading: false,
        acceptLoading: false
      },
      RATING_LEVEL_REVERSE: {}
    }
  },
  created() {
    this.RATING_LEVEL_REVERSE = Object.assign({}, RATING_LEVEL_REVERSE)
  },
  mounted() {
    this.initRank()
  },
  methods: {
    selectColor(scoped) {
      if (scoped.$index < 3) {
        return 'cursor:pointer; color: ' + RATING_LEVEL_REVERSE[6 - scoped.$index].color
      }
    },
    initRank() {
      this.query.ratingLoading = true
      this.query.acceptLoading = true
      rankApi.getRank({ current: 1, size: 7, type: 1 }).then(res => {
        this.ratingTop = res.records
        this.query.ratingLoading = false
      })
      rankApi.getRank({ current: 1, size: 7, type: 2 }).then(res => {
        this.acTop = res.records
        this.query.acceptLoading = false
      })
    },
    async getAllTop() {
      const params = new URLSearchParams()
      params.append('pageNum', 1)
      params.append('pageSize', 10)
      const dataRank = await this.$http.get('/border/mini', params)
      this.ratingTop = dataRank.datas[0]
      this.acTop = dataRank.datas[1]
      this.acbTop = dataRank.datas[2]
      this.activeTop = dataRank.datas[3]
    },
    toUser(uid) {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push({ name: 'UserHome', query: { uid }})
      } else {
        this.$notify({
          title: '提示',
          message: '登录后才能查看这个用户的主页哦',
          type: 'warning',
          offset: 100,
          duration: 3000
        })
      }
    }

  }
}
</script>

<style scoped >
#topborder {
  margin-bottom: 15px;
}

/* 卡片标题上的查看更多 */
.elcard-showmore-link {
  float: right;
  font-size: 14px;
  line-height: 14px;
}
.showmore-link {
  float: right;
  font-size: 14px;
}

.border-level-one {
  color: darkcyan;
}
.border-level-one:hover {
  cursor: pointer;
}
.border-level-two {
  color: blue;
}
.border-level-two:hover {
  cursor: pointer;
}
.border-level-three {
  color: #ff0080;
}
.border-level-three:hover {
  cursor: pointer;
}
.border-level-four {
  color: #ff0000;
}
.border-level-four:hover {
  cursor: pointer;
}
.border-level-five {
  color: #ff8000;
}
.border-level-five:hover {
  cursor: pointer;
}
</style>
