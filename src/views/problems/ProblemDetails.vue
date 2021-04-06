<template>
  <div class="submit-body">
    <div v-loading="loading" class="submit-info-body" element-loading-text="正在提交中">
      <el-row>
        <el-col :sm="24" :md="24" :lg="12">
          <el-card>
            <div class="title-box">
              <h1 class="title-font">
                {{ getProblemId(pid) }}. {{ problemData.problem.title }}
              </h1>
              时间限制: <el-tag type="info">{{ problemData.problem.timeLimit }} ms</el-tag>
              内存限制: <el-tag type="info">{{ problemData.problem.memoryLimit }} MB</el-tag>
            </div>
            <el-card shadow="never" class="problem-card">
              <div slot="header" class="problem-card-header">题目描述</div>
              <div class="detail-card-body" v-html="problemData.problem.description ? problemData.problem.description : '【没有描述】'" />
            </el-card>
            <el-card shadow="never" class="problem-card">
              <div slot="header" class="problem-card-header">输入描述</div>
              <div class="detail-card-body" v-html="problemData.problem.input ? problemData.problem.input : '无'" />
            </el-card>
            <el-card shadow="never" class="problem-card">
              <div slot="header" class="problem-card-header">输出描述</div>
              <div class="detail-card-body" v-html="problemData.problem.output ? problemData.problem.output : '无'" />
            </el-card>
            <div v-for="example in problemData.problem.examples" :key="example.input">
              <el-card v-show="example.input" shadow="never" class="problem-card">
                <div slot="header" class="problem-card-header">输入样例</div>
                <div class="detail-card-body" style="white-space: pre-line;" v-text="example.input" />
              </el-card>
              <el-card v-show="example.output" shadow="never" class="problem-card">
                <div slot="header" class="problem-card-header">输出样例</div>
                <div class="detail-card-body" style="white-space: pre-line;" v-text="example.output" />
              </el-card>
            </div>
            <el-card v-if="problemData.problem.hint" shadow="never" class="problem-card">
              <div slot="header" class="problem-card-header">提示</div>
              <div class="detail-card-body" v-html="problemData.problem.hint" />
            </el-card>
          </el-card>
        </el-col>
        <el-col :sm="24" :md="24" :lg="12">
          <el-card>
            <div class="code-editor-box">
              请选择语言：
              <el-select
                v-model="language"
                class="language-select"
                size="medium"
                :disabled="!this.$store.getters.isAuthenticated"
                @change="handleChangeLanguage"
              >
                <el-option
                  v-for="item in languageType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- 全屏显示编辑框 -->
              <el-button
                icon="el-icon-full-screen"
                type="primary"
                size="mini"
                round
                plain
                @click="fullEditor = true"
              >全屏</el-button>
              <el-dialog
                :visible.sync="fullEditor"
                custom-class="dialog-body"
                :fullscreen="true"
              >
                <ace-editor
                  class="full-code-editor"
                  :language="language"
                  :is-full="true"
                  :value="code"
                  @input="getCode"
                />
              </el-dialog>
              <ace-editor
                id="ace-editor"
                class="code-editor"
                :language="language"
                :value="code"
                @input="getCode"
              />
              <el-button
                type="primary"
                :loading="loading"
                :disabled="!this.$store.getters.isAuthenticated"
                @click="submitCode"
              >提交</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import AceEditor from '@/components/AceEditor'
import echarts from 'echarts'
import echartStyle from '../../utils/echarts/shine.json'
import { stringToExamples, markdownToHtml } from '@/utils'
import { generateCodeKey } from '@/utils/constants'
import { mapActions, mapGetters } from 'vuex'
import problemApi from '@/api/problemset/problem'
import submissionApi from '@/api/submission/submit'
import storage from '@/utils/storage'

export default {
  name: 'ProblemDetail',
  components: {
    AceEditor
  },
  data() {
    return {
      pid: this.$route.params.pid,
      contestId: 0,
      loading: false,
      myChartSubmit: '',
      myChartsAcUser: '',
      dataProblemMain: '',
      dataProblemDetail: '',
      dataProblemSamples: [],
      problemData: {
        problem: {
          timeLimit: 0,
          memoryLimit: 0,
          examples: []
        },
        source: {},
        problemCount: {},
        tags: []
      },
      problemInfo: {},
      backConfirm: true,
      isSolved: false,
      problemIsStar: false,
      code: '',
      fullEditor: false,
      language: 'C/C++',
      languageType: [
        {
          value: '1',
          label: 'C/C++'
        },
        {
          value: '2',
          label: 'Java'
        }
      ],
      activeIndex: ['1'],
      submissionId: '',
      submitted: false,
      submitPwdVisible: false,
      submitPwd: '',
      result: {
        status: 9
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  watch: {
    $route() {
      this.pid = this.$route.params.pid
    },
    pid() {
      this.getProblem()
    }
  },
  mounted() {
    this.init()
    this.backConfirm = true
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css'
  },
  methods: {
    ...mapActions(['changeDomTitle']),
    // 根据路由name的分开请求
    init() {
      if (this.$route.params.contestId) {
        this.contestId = this.$route.params.contestId
      }
      this.getProblemDetail(this.pid, this.contestId)
    },
    getProblemDetail(pid, contestId) {
      const fun = this.$route.name === 'ProblemDetails' ? 'get' : 'getContestProblemDetails'
      problemApi[fun](pid, contestId).then(res => {
        this.changeDomTitle({ title: res.problem.title })
        this.problemData = res
        // 转化题目样例 字符串-->数组
        console.log(stringToExamples(res.problem.examples))
        this.problemData.problem['examples'] = stringToExamples(res.problem.examples)
        this.problemData.problem['description'] = markdownToHtml(res.problem.description)
        this.problemData.problem['input'] = markdownToHtml(res.problem.input)
        this.problemData.problem['output'] = markdownToHtml(res.problem.output)
        this.problemData.problem['hint'] = markdownToHtml(res.problem.hint)
        // 在beforeRouteEnter中修改了, 说明本地有code,不用更改配置
        // TODO
      })
    },
    handleFullScreen() {
      this.fullEditor = true
    },
    getProblemId(pid) {
      return this.$route.name === 'ProblemDetails' ? pid : String.fromCharCode(Number(pid) + 65)
    },
    initEcharts() {
      const obj = echartStyle
      echarts.registerTheme('shine', obj)
      this.myChartSubmit = echarts.init(document.getElementById('submit-echarts'), 'shine')
      this.myChartSubmit.showLoading()
      this.myChartsAcUser = echarts.init(document.getElementById('acuser-echarts'))
      this.myChartsAcUser.showLoading()
    },
    loadChartsSubmit() {
      const totalAc = this.dataProblemDetail.totalAc
      const others = this.dataProblemDetail.totalSubmit - this.dataProblemDetail.totalAc
      const option = {
        title: {
          text: '提交AC占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['总AC数', '其他']
        },
        series: [
          {
            name: '总AC数/总提交数',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: totalAc, name: '总AC数' },
              { value: others, name: '其他' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.myChartSubmit.setOption(option)
      this.myChartSubmit.hideLoading()
    },
    loadChartsAcUser() {
      const totalAcUser = this.dataProblemDetail.totalAcUser
      const others = this.dataProblemDetail.totalSubmitUser - this.dataProblemDetail.totalAcUser
      const option = {
        title: {
          text: '提交人数占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['通过数', '其他']
        },
        series: [
          {
            name: '通过人数/尝试次数',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: totalAcUser, name: '通过数' },
              { value: others, name: '其他' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.myChartsAcUser.setOption(option)
      this.myChartsAcUser.hideLoading()
    },
    getCode(code) {
      this.code = code
    },
    // 提交代码
    submitCode() {
      if (this.code.length <= 0) {
        this.$message.warning('不可提交空白代码')
        return
      }
      // TODO 比赛题目需要检查是否有权限提交
      this.loading = true
      this.submissionId = ''
      this.result = { status: 9 }
      this.submitting = true
      const data = {
        pid: this.pid, // 如果是比赛题目就为 display_id
        cid: this.contestId,
        code: this.code,
        language: this.language === 'Java' ? 2 : 1,
        timeLimit: this.problemData.problem.timeLimit,
        memoryLimit: this.problemData.problem.memoryLimit
      }
      submissionApi.submit(data).then(res => {
        this.submissionId = res.data && res.data.submitId
        // 定时检查状态
        this.submitting = false
        this.submissionExists = true
        this.loading = false
        this.$message.success('代码提交成功！')
      }).catch(() => {
        this.loading = false
      })
      // 设置退出提示框
      this.backConfirm = false
    },
    handleChangeLanguage(val) {
      this.language = val
    }
  },
  // 获取本地缓存中的该题的做题代码，代码语言，代码风格
  beforeRouteEnter(to, from, next) {
    const problemCode = storage.get(generateCodeKey(to.params.pid, to.params.contestId || 0))
    if (problemCode) {
      next((vm) => {
        vm.code = problemCode.code
      })
    } else {
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    // 缓存代码
    const contestId = from.params.contestId || 0
    storage.set(generateCodeKey(this.problemData.problem.pid, contestId), { code: this.code })
    next()
  }
}
</script>

<style scoped>
.submit-body {
  width: 95%;
  margin: 0px auto auto;
  min-height: 700px;
  font-size: 15px;
}
.submit-info-body {
  width: 100%;
  margin: 0px auto auto;
  min-height: 700px;
  font-size: 15px;
}

/* .full-box{
    width: 100%;
} */

.left-box {
  float: left;
  text-align: left;
  width: 50%;
  margin-bottom: 30px;
}

.right-box {
  float: right;
  margin-top: 20px;
  width: 50%;
  min-height: 700px;
}

.echarts-box {
  margin: 0;
  padding: 0;
  float: left;
  height: 320px;
  width: 320px;
}

.problem-card {
  margin-bottom: 10px;
  margin-right: 14px;
}

.problem-card-header {
  font-weight: bold;
}

.code-editor-box {
  text-align: center;
  padding-bottom: 10px;
  background-color: #eeeeee;
}

.language-select {
  margin-bottom: 10px;
  width: 20%;
  margin-right: 2%;
  z-index: 1;
}

.full-code-editor {
  width: 100%;
  height: 100%;
}

.code-editor {
  width: 100%;
  margin-bottom: 10px;
}

.title-box {
  width: 100%;
  min-height: 120px;
  text-align: center;
}

.title-font {
  font-size: 31px;
}

.el-tag {
  font-size: 14px;
  margin-right: 20px;
  margin-left: 5px;
}

.detail-card-body {
  font-size: 16px;
  margin: 0;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
