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
      <el-scrollbar style="height:100%">
        <div class="title-box">
          <h1 class="title-font">
            {{ dataProblemDetail.title?dataProblemDetail.title:'题目' }}
          </h1>
          时间限制: <el-tag type="info">{{ dataProblemMain.timeLimit?dataProblemMain.timeLimit:'0MS' }}</el-tag>
          内存限制:<el-tag type="info">{{ dataProblemMain.memoryLimit?dataProblemMain.memoryLimit:'0KB' }}</el-tag>
          <br>64位Integer的IO类型:<el-tag type="info">{{ dataProblemMain.intFormat?dataProblemMain.intFormat:'-' }}</el-tag>
        </div>
        <div v-if="this.$store.getters.getIsLogin">
          <el-link
            v-if="isSolved"
            type="success"
            icon="el-icon-check"
          >已解决</el-link>
          <el-link
            v-else
            type="danger"
            icon="el-icon-close"
          >未解决</el-link>
          | <el-link
            v-if="dataProblemDetail.judgeOption===0"
            type="warning"
          > 本地判题</el-link>
          <el-link
            v-else
            type="danger"
          > 第三方判题</el-link>
          | <el-link
            v-if="dataProblemMain.spj===1"
            type="danger"
          >特判</el-link>
          <el-link
            v-else
            type="success"
          >结果匹配</el-link>
        </div>
        <el-card
          id="problem-card"
          class="problem-detail-card"
        >
          <div slot="header">题目描述</div>
          <div
            class="detail-card-body"
            v-html="dataProblemMain.description?dataProblemMain.description:'没有描述'"
          />
        </el-card>
        <el-card
          id="problem-card"
          class="problem-detail-card"
        >
          <div slot="header">输入</div>
          <div
            class="detail-card-body"
            v-html="dataProblemMain.input?dataProblemMain.input:'没有输入'"
          />
        </el-card>
        <el-card
          id="problem-card"
          class="problem-detail-card"
        >
          <div slot="header">输出</div>
          <div
            class="detail-card-body"
            v-html="dataProblemMain.output?dataProblemMain.output:'没有输出'"
          />
        </el-card>
        <div
          v-for="item in dataProblemSamples"
          :key="item"
        >
          <el-card
            id="problem-card"
            class="problem-detail-card"
          >
            <div slot="header">输入样例 {{ item.caseOrder+1 }}</div>
            <div
              class="detail-card-body"
              v-html="item.inputCase?item.inputCase:'没有输入样例'"
            />
          </el-card>
          <el-card
            id="problem-card"
            class="problem-detail-card"
          >
            <div slot="header">输出样例 {{ item.caseOrder+1 }}</div>
            <div
              class="detail-card-body"
              v-html="item.outputCase?item.outputCase:'没有输出样例'"
            />
          </el-card>
        </div>
      </el-scrollbar>
    </div>

    <div class="right-box">
      <el-collapse
        id="submit-collapse"
        v-model="activeIndex"
      >
        <el-collapse-item
          title="答题"
          name="1"
        >
          <div v-if="readOnly">
            <h2>未在作答时间内无法作答</h2>
          </div>
          <div
            v-else
            class="code-editor-box"
          >
            请选择语言：
            <el-select
              v-model="compileLanguage"
              class="language-select"
              size="medium"
              :disabled="readOnly"
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
              fullscreen="true"
            >
              <aceEditor
                class="full-code-editor"
                :language="compileLanguage"
                :read-only="readOnly"
                :is-full="true"
                :value="code"
                @input="getCode"
              />
            </el-dialog>
            <aceEditor
              id="ace-editor"
              class="code-editor"
              :language="compileLanguage"
              :read-only="readOnly"
              :value="code"
              @input="getCode"
            />
            <el-button
              type="primary"
              :disabled="readOnly"
              @click="handleSubmit"
            >提交代码</el-button>
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item
          title="题解"
          name="2"
        >
          <el-card>最佳题解：
            无
          </el-card>
          <el-card>添加题解：
            <el-divider></el-divider>
            <div v-if="this.isSolved">
              <markdownEditor
                :text="answerText"
                @input="getText"
              ></markdownEditor>
              <el-button
                type="primary"
                size="mini"
              >提交</el-button>
            </div>
            <div v-else>解答该题后才能添加题解哦</div>
          </el-card>
        </el-collapse-item> -->
      </el-collapse>
    </div>
  </div>
</template>

<script>
import aceEditor from '@/components/AceEditor'
// import markdownEditor from '@/components/MarkDownEditor'
export default {
  components: {
    aceEditor
    // markdownEditor
  },
  props: {
    pid: {
      type: String,
      default: ''
    },
    cid: {
      type: String,
      default: ''
    },
    readOnly: {
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
      isSolved: false,
      problemIsStar: false,
      code: '',
      // 题解内容
      // answerText: '# 第 ' + this.pid + ' 题题解\n ##\n ##\n ##\n::: hljs-right \n#### Editor by :  ' + this.$store.getters.getUsername + '\n:::',
      fullEditor: false,
      compileLanguage: 'G++',
      languageType: [
        {
          value: 'G++',
          label: 'G++'
        },
        {
          value: 'GCC',
          label: 'GCC'
        },
        {
          value: 'JAVA',
          label: 'JAVA'
        },
        {
          value: 'Python',
          label: 'Python2'
        }
      ],
      activeIndex: []
    }
  },
  watch: {
    pid(val) {
      this.getProblem()
    }
  },
  mounted() {
    this.getProblem()
    if (!this.$store.getters.getIsLogin) {
      this.activeIndex = []
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
    async getProblem() {
      const params = new URLSearchParams()
      const pidTemp = this.pid
      params.append('problemId', pidTemp)
      params.append('username', this.$store.getters.getUsername)
      const dataProblem = await this.$http.get('/problem/info/get', params)
      this.dataProblemDetail = dataProblem.datas[0]
      this.dataProblemMain = dataProblem.datas[1]
      this.dataProblemSamples = dataProblem.datas[2]
      this.isSolved = dataProblem.datas[3]
      if (this.dataProblemSamples.length === 0) {
        this.dataProblemSamples[0] = {
          caseOrder: 0,
          inputCase: '',
          outputCase: ''
        }
      }
    },
    async onSubmit() {
      const params = new URLSearchParams()
      params.append('pid', this.pid)
      params.append('cid', this.cid)
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
      this.$emit('toPane', '3')
    },
    getCode(code) {
      this.code = code
    },
    getText(text) {
      this.answerText = text
    },
    handleSubmit() {
      this.loading = true
      this.onSubmit()
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

.problem-detail-card {
  margin-bottom: 20px;
  margin-right: 14px;
}

.detail-card-body {
  font-size: 16px;
  margin: 0;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
