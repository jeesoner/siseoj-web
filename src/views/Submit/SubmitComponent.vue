<template>
  <div
    v-loading="loading"
    class="submitinfo-body"
    element-loading-text="正在提交中"
  >
    <div
      id="left-box"
      class="left-box"
    >
      <div class="title-box">
        <h1 class="title-font">
          {{ problemData.title ? problemData.title : '题目' }}
        </h1>
        时间限制: <el-tag type="info">{{ problemInfo.timeLimit ? problemInfo.timeLimit : '0' }} ms</el-tag>
        内存限制:<el-tag type="info">{{ problemInfo.memoryLimit ? problemInfo.memoryLimit : '0' }} MB</el-tag>
      </div>
      <el-card
        id="problem-card"
        class="problem-detail-card"
      >
        <div slot="header">题目描述</div>
        <div
          class="detail-card-body"
          v-html="problemInfo.description ? problemInfo.description : '【没有描述】'"
        />
      </el-card>
      <el-card
        id="problem-card"
        class="problem-detail-card"
      >
        <div slot="header">输入格式</div>
        <div
          class="detail-card-body"
          v-html="problemInfo.inputFormat?problemInfo.inputFormat : '【没有输入】'"
        />
      </el-card>
      <el-card
        id="problem-card"
        class="problem-detail-card"
      >
        <div slot="header">输出格式</div>
        <div
          class="detail-card-body"
          v-html="problemInfo.outputFormat ? problemInfo.outputFormat : '【没有输出】'"
        />
      </el-card>
      <el-card
        v-if="problemInfo.inputCase"
        id="problem-card"
        class="problem-detail-card"
      >
        <div slot="header">输入样例</div>
        <div
          class="detail-card-body"
          v-html="problemInfo.inputCase"
        />
      </el-card>
      <el-card
        v-if="problemInfo.outputCase"
        id="problem-card"
        class="problem-detail-card"
      >
        <div slot="header">输出样例</div>
        <div
          class="detail-card-body"
          v-html="problemInfo.outputCase"
        />
      </el-card>
      <!-- <el-card id="problem-card"
                 class="problem-detail-card">
          <div slot="header">题目统计信息
            <el-link type="info"
                     class="elcard-showmore-link">查看更多</el-link>
          </div>
          <div class="detail-card-body">
            <div class="echarts-box"
                 id="submit-echarts"></div>
            <div class="echarts-box"
                 id="acuser-echarts"></div>
          </div>
        </el-card> -->
    </div>

    <div class="right-box">
      <div class="code-editor-box">
        请选择语言：
        <el-select
          v-model="compileLanguage"
          class="language-select"
          size="medium"
          :disabled="!this.$store.getters.getIsLogin"
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
          <aceEditor
            class="full-code-editor"
            :language="compileLanguage"
            :is-full="true"
            :value="code"
            @input="getCode"
          />
        </el-dialog>
        <aceEditor
          id="ace-editor"
          class="code-editor"
          :language="compileLanguage"
          :value="code"
          @input="getCode"
        />
        <el-button
          type="primary"
          :disabled="!this.$store.getters.getIsLogin"
          @click="handleSubmit"
        >提交代码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import aceEditor from '@/components/AceEditor'
import echarts from 'echarts'
import echartStyle from '../../utils/echarts/shine.json'
import crudProblem from '@/api/problemset/problem'
export default {
  components: {
    aceEditor
  },
  props: {
    pid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      myChartSubmit: '',
      myChartsAcUser: '',
      dataProblemMain: '',
      dataProblemDetail: '',
      dataProblemSamples: [],
      problemData: {},
      problemInfo: {},
      isSolved: false,
      problemIsStar: false,
      code: '',
      fullEditor: false,
      compileLanguage: 'C/C++',
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
      activeIndex: ['1']
    }
  },
  watch: {
    pid(val) {
      this.getProblem()
    }
  },
  mounted() {
    // this.initEcharts()
    this.getProblem()
    if (!this.$store.getters.getIsLogin) {
      // this.activeIndex = []
      this.$notify({
        title: '提示',
        message: '登录后才能作答哦',
        type: 'warning',
        offset: 100,
        duration: 3000
      })
    } else {
      this.activeIndex.push('1')
    }
  },
  methods: {
    handleFullScreen() {
      this.fullEditor = true
    },
    initEcharts() {
      const obj = echartStyle
      echarts.registerTheme('shine', obj)
      this.myChartSubmit = echarts.init(document.getElementById('submit-echarts'), 'shine')
      this.myChartSubmit.showLoading()
      this.myChartsAcUser = echarts.init(document.getElementById('acuser-echarts'))
      this.myChartsAcUser.showLoading()
    },
    getProblem() {
      if (this.$store.getters.getIsLogin) {
        crudProblem.get(this.pid).then(res => {
          this.problemData = res
          this.problemInfo = res.problemInfo
        })
      } else {
        this.$notify({
          title: '提示',
          message: '登录后才能提交题目',
          type: 'warning',
          offset: 100,
          duration: 3000
        })
      }
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
    async onSubmit() {
      const params = new URLSearchParams()
      params.append('pid', this.pid)
      params.append('username', this.$store.getters.getUsername)
      params.append('code', this.code)
      params.append('language', this.compileLanguage)
      // FIXME: 暂时固定时间和内存限制
      params.append('timeLimit', 1000)
      params.append('memoryLimit', 128000)
      // 如果有本地判题标记，优先提交到本地
      let url = '/judge_status/submit/post'
      if (this.dataProblemDetail.judgeOption === 1) {
        url = '/judge_status/submit/post'
      } else {
        // url = '/submit/submitProblem'
      }
      const dataSubmitProblem = await this.$http.post(url, params)
      this.logger.i(dataSubmitProblem.datas)
      if (dataSubmitProblem.code === 10000) {
        this.$message.success('提交成功！')
      } else {
        this.$message.error(dataSubmitProblem.msg)
      }
      this.$router.push({ path: '/Status' })
    },
    getCode(code) {
      this.code = code
    },
    handleSubmit() {
      if (this.code.length <= 50) {
        this.$message.warning('不可提交空白代码')
      } else {
        this.loading = true
        this.onSubmit()
      }
    },
    handleChangeLanguage(val) {
      this.compileLanguage = val
    }
  }

}
</script>

<style scoped>
.submitinfo-body {
  width: 100%;
  margin: auto;
  margin-top: 0px;
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
  height: 680px;
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

#problem-card {
  margin-bottom: 10px;
  margin-right: 14px;
}

.code-editor-box {
  text-align: center;
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
