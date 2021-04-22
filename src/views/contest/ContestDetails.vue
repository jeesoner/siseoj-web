<template>
  <div class="contest-body">
    <el-row>
      <el-col :xs="24" :md="24" :lg="24">
        <el-card shadow="always">
          <div class="contest-title">
            <div slot="header">
              <span class="panel-title">{{ contest.title }}</span>
            </div>
          </div>
          <el-row>
            <el-col
              v-if="contest.auth != null"
              :span="12"
              class="text-align:left"
            >
              <el-tooltip
                :content="CONTEST_AUTH_REVERSE[contest['auth']]['tips']"
                placement="top"
              >
                <el-tag
                  :type="CONTEST_AUTH_REVERSE[contest.auth]['color']"
                  effect="plain"
                >
                  {{ CONTEST_AUTH_REVERSE[contest.auth]['name'] }}
                </el-tag>
              </el-tooltip>
            </el-col>
            <el-col :span="12" style="text-align:right">
              <el-tooltip
                :content="CONTEST_TYPE_REVERSE[contest.type]['tips']"
                placement="top"
              >
                <el-button v-if="contest" size="small" plain>
                  {{ CONTEST_TYPE_REVERSE[contest.type]['name'] }}
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
          <div class="contest-time">
            <el-row>
              <el-col :xs="24" :md="12" class="left">
                <p>
                  <i class="fa fa-hourglass-start" aria-hidden="true" />
                  开始于：{{ contest.startTime }}
                </p>
              </el-col>
              <el-col :xs="24" :md="12" class="right">
                <p>
                  <i class="fa fa-hourglass-end" aria-hidden="true" />
                  结束于：{{ contest.endTime }}
                </p>
              </el-col>
            </el-row>
          </div>
          <div class="slider">
            <el-slider
              v-model="progressValue"
              :format-tooltip="formatTooltip"
              :step="timeStep"
            />
          </div>
          <el-row>
            <el-col :span="24" style="text-align:center">
              <el-tag effect="dark" size="medium" :style="countdownColor">
                <i class="fa fa-circle" aria-hidden="true" />
                {{ countdown }}
              </el-tag>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div class="sub-menu">
      <!-- 判断是否需要密码验证 -->
      <el-card
        v-if="passwordFormVisible"
        class="password-form-card"
        style="text-align:center"
      >
        <div slot="header">
          <span class="panel-title">请输入密码</span>
        </div>
        <p class="password-form-tips">
          要进入私人比赛，请输入密码！
        </p>
        <el-input
          v-model="contestPassword"
          type="password"
          placeholder="请输入比赛密码"
          @keydown.enter.native="checkPassword"
        />
        <el-button
          type="primary"
          style="float:right;margin:5px"
          @click="checkPassword"
        >确定
        </el-button>
      </el-card>
      <!-- Tab栏 -->
      <el-tabs v-else v-model="activeName" @tab-click="tabClick">
        <el-tab-pane name="ContestDetails" lazy>
          <span slot="label"><i class="el-icon-s-home" />&nbsp;概述</span>
          <el-card class="box-card">
            <div class="markdown-body" v-html="contest.description" />
          </el-card>
        </el-tab-pane>

        <el-tab-pane
          name="ContestProblemList"
          lazy
          :disabled="contestMenuDisabled"
        >
          <span slot="label"><i class="fa fa-list" aria-hidden="true" />&nbsp;题目</span>
          <transition name="el-zoom-in-bottom">
            <router-view
              v-if="activeName === 'ContestProblemList'"
            />
          </transition>
        </el-tab-pane>

        <el-tab-pane
          name="ContestSubmissionList"
          lazy
          :disabled="contestMenuDisabled"
        >
          <span slot="label"><i class="el-icon-menu" />&nbsp;评测记录</span>
          <transition name="el-zoom-in-bottom">
            <router-view
              v-if="activeName === 'ContestSubmissionList'"
            />
          </transition>
        </el-tab-pane>

        <el-tab-pane name="ContestRank" lazy :disabled="contestMenuDisabled">
          <span
            slot="label"
          ><i class="fa fa-bar-chart" aria-hidden="true" />&nbsp;排名</span>
          <transition name="el-zoom-in-bottom">
            <router-view v-if="activeName === 'ContestRank'" />
          </transition>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import time from '@/utils/time'
import moment from 'moment'
import contestApi from '@/api/contest/contest'
import {
  CONTEST_AUTH,
  CONTEST_AUTH_REVERSE,
  CONTEST_STATUS,
  CONTEST_STATUS_REVERSE, CONTEST_TYPE,
  CONTEST_TYPE_REVERSE
} from '@/utils/constants'

export default {
  name: 'ContestDetails',
  data() {
    return {
      contestId: null,
      activeName: 'ContestDetails',
      timer: null,
      CONTEST_STATUS: {},
      CONTEST_STATUS_REVERSE: {},
      CONTEST_AUTH_REVERSE: {},
      CONTEST_TYPE_REVERSE: {},
      CONTEST_AUTH: {},
      btnLoading: false,
      contestPassword: ''
    }
  },
  computed: {
    timeStep() {
      // 时间段平分滑条长度
      return 100 / this.contest.duration
    },
    ...mapState({
      now: (state) => state.contest.now,
      contest: (state) => state.contest.contest,
      showMenu: (state) => state.contest.itemVisible.menu
    }),
    ...mapGetters([
      'contestMenuDisabled',
      'contestRuleType',
      'contestStatus',
      'countdown',
      'BeginToNowDuration',
      'isContestAdmin',
      'isSuperAdmin',
      'ContestRealTimePermission',
      'passwordFormVisible'
    ]),
    progressValue: {
      get: function() {
        return this.$store.getters.progressValue
      },
      set: function() {
      }
    },
    countdownColor() {
      return 'color:' + CONTEST_STATUS_REVERSE[this.contestStatus].color
    },
    showAdminHelper() {
      return this.isContestAdmin && this.contestRuleType === CONTEST_TYPE.GENERAL
    }
  },
  watch: {
    $route(route) {
      this.activeName = route.name
      if (route.name === 'ContestProblemDetails') {
        this.activeName = 'ContestProblemList'
      }
      this.contestId = route.params.contestId
      this.changeDomTitle({ title: this.contest.title })
    }
  },
  created() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.$store.commit('clearContest')
  },
  mounted() {
    this.contestId = this.$route.params.contestId
    this.activeName = this.$route.name
    if (this.activeName === 'ContestProblemDetails') {
      this.activeName = 'ContestProblemList'
    }
    this.CONTEST_STATUS = Object.assign({}, CONTEST_STATUS)
    this.CONTEST_STATUS_REVERSE = Object.assign({}, CONTEST_STATUS_REVERSE)
    this.CONTEST_AUTH_REVERSE = Object.assign({}, CONTEST_AUTH_REVERSE)
    this.CONTEST_TYPE_REVERSE = Object.assign({}, CONTEST_TYPE_REVERSE)
    this.CONTEST_AUTH = Object.assign({}, CONTEST_AUTH)
    this.$store.dispatch('getContest').then((res) => {
      this.changeDomTitle({ title: res.title })
      const data = res
      const endTime = moment(data.endTime)
      // 如果当前时间还是在比赛结束前的时间，需要计算倒计时
      if (endTime.isAfter(moment(data.now))) {
        // 实时更新时间
        this.timer = setInterval(() => {
          this.$store.commit('nowAdd1s')
        }, 1000)
      }
    })
  },
  methods: {
    ...mapActions(['changeDomTitle']),
    formatTooltip(val) {
      if (this.contest.status === CONTEST_STATUS.SCHEDULED) {
        // 还未开始
        return '00:00:00'
      } else if (this.contest.status === CONTEST_STATUS.RUNNING) {
        return time.secondFormat(this.BeginToNowDuration) // 格式化时间
      } else {
        return time.secondFormat(this.contest.duration)
      }
    },
    checkPassword() {
      if (this.contestPassword === '') {
        this.$message.error('请输入该比赛的密码！')
        return
      }
      this.btnLoading = true
      contestApi.registerContest(this.contestId, this.contestPassword).then(
        (res) => {
          this.$message.success('正在前往比赛页面')
          this.$store.commit('contestSubmitAccess', { access: true })
          this.btnLoading = false
        },
        (res) => {
          this.btnLoading = false
        }
      )
    },
    tabClick(tab) {
      const name = tab.name
      if (name !== this.$route.name) {
        this.$router.push({ name: name })
      }
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .contest-body {
    padding: 0 5%;
  }

  .contest-time .left {
    text-align: left;
  }

  .contest-time .right {
    text-align: right;
  }

  .password-form-card {
    width: 400px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 768px) {
  .contest-time .left,
  .contest-time .right {
    text-align: center;
  }
}

::v-deep .el-slider__button {
  width: 20px !important;
  height: 20px !important;
  background-color: #409eff !important;
}

::v-deep .el-slider__button-wrapper {
  z-index: 500;
}

::v-deep .el-slider__bar {
  height: 10px !important;
  background-color: #09be24 !important;
}

::v-deep .el-card__header {
  border-bottom: 0px;
}

::v-deep .el-tabs__nav-wrap {
  background: #fff;
  border-radius: 3px;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}

.panel-title {
  font-size: 22px;
}

.contest-title {
  text-align: center;
}

.contest-time {
  width: 100%;
  font-size: 16px;
}

.el-tag--dark {
  border-color: #fff;
}

.el-tag {
  background: #fff;
  border: 1px solid #e9eaec;
  font-size: 18px;
}

.sub-menu {
  margin-top: 15px;
}

.password-form-tips {
  text-align: center;
  font-size: 14px;
}

.box-card {
  background-color: #eeeeee;
}
</style>
