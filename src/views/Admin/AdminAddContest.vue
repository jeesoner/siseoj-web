<template>
  <div class="body">
    <div class="add-contest-box">
      <div class="left-box">
        <h3>添加比赛</h3>
        <el-form
          ref="formContest"
          :model="formContest"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item
            label="比赛类型："
            prop="contestKind"
          >
            <el-select v-model="formContest.contestKind">
              <el-option
                v-for="item in kindType"
                ref="contestKind"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="比赛标题："
            prop="contestTitle"
          >
            <el-input
              ref="contestTitle"
              v-model="formContest.contestTitle"
              placeholder="请输入比赛标题"
              size="medium"
              style="width:400px;"
            />
          </el-form-item>
          <el-form-item
            label="比赛权限："
            prop="contestType"
          >
            <el-select v-model="formContest.contestType">
              <el-option
                v-for="item in CType"
                ref="contestType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div v-if="formContest.contestType === '1'">
            <el-form-item label="输入密码：">
              <el-input show-password />
            </el-form-item>
          </div>

          <el-form-item
            v-if="formContest.contestType === '3'"
            label="注册时间："
          >
            <el-date-picker
              v-model="formContest.regStartEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="注册开始日期"
              end-placeholder="注册结束日期"
              align="right"
            />
          </el-form-item>
          <el-form-item
            label="起止时间："
            prop="contestStartEndTime"
          >
            <el-date-picker
              ref="contestStartEndTime"
              v-model="formContest.contestStartEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>
          <el-form-item
            label="选择赛题："
            prop="pidList"
          >
            <!-- <el-button type="info">点我添加</el-button> -->
            <el-input
              ref="pidList"
              v-model="formContest.pidList"
              placeholder="请输入题目ID，不同题目之间用空格"
              style="width:400px;"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit('formContest')"
            >添加比赛</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-box">
        比赛介绍：
        <RichTextEditor @input="getText" />
      </div>
    </div>

  </div>
</template>

<script>
import RichTextEditor from '../../components/RichTextEditor'
import FormatterDate from '../../utils/formatterDate.js'
export default {
  components: {
    RichTextEditor
  },
  data() {
    return {
      kindType: [
        {
          value: '0',
          label: '练习'
        }, {
          value: '1',
          label: '积分'
        }, {
          value: '2',
          label: '趣味'
        }, {
          value: '3',
          label: '正式'
        }, {
          value: '5',
          label: 'DIY'
        }],
      CType: [
        {
          value: '0',
          label: '公开'
        }, {
          value: '1',
          label: '密码'
        }, {
          value: '2',
          label: '私有'
        }, {
          value: '3',
          label: '注册'
        }, {
          value: '4',
          label: '正式'
        }, {
          value: '5',
          label: '组队'
        }
      ],
      formContest: {
        contestType: '',
        contestKind: '',
        contestTitle: '',
        contestStartEndTime: [],
        regStartEndTime: [],
        info: '',
        pidList: ''
      },
      rules: {
        contestKind: [
          { required: true, message: '请选择比赛类型', trigger: 'change' }
        ],
        contestTitle: [
          { required: true, message: '请输入比赛标题', trigger: 'change' }
        ],
        contestType: [
          { required: true, message: '请选择比赛权限', trigger: 'change' }
        ],
        contestStartEndTime: [
          { required: true, message: '请选择起始终止时间', trigger: 'change' }
        ],
        pidList: [
          // TODO: pidList匹配规则：四个数字一组，中间使用空格的字符串验证方法
          {}
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addContest()
          this.logger.i('onsubmit正常')
        } else {
          this.logger.e('onsubmit错误')
          return false
        }
      })
      // this.logger.me('onSubmit', '点击注册！')
    },
    async addContest() {
      const kind = this.formContest.contestKind
      const name = this.formContest.contestTitle
      const ctype = this.formContest.contestType
      const beginTime = FormatterDate(this.formContest.contestStartEndTime[0])
      const endTime = FormatterDate(this.formContest.contestStartEndTime[1])
      const registerBeginTime = FormatterDate(this.formContest.regStartEndTime[0])
      const registerEndTime = FormatterDate(this.formContest.regStartEndTime[1])
      const pidList = this.formContest.pidList
      const info = this.formContest.info
      const params = new URLSearchParams()
      params.append('username', this.$store.getters.getUsername)
      params.append('name', name)
      params.append('beginTime', beginTime)
      params.append('endTime', endTime)
      params.append('ctype', ctype)
      params.append('registerBeginTime', registerBeginTime)
      params.append('registerEndTime', registerEndTime)
      params.append('info', info)
      params.append('kind', kind)
      params.append('pidList', pidList)
      const dataSubmit = await this.$http
        .post('/contest/insertContest', params)
      if (dataSubmit.code === 100) {
        this.$alert('比赛信息添加成功！', '成功', {
          confirmButtonText: '确定',
          type: 'success',
          center: true
        })
      } else {
        this.$message.error(dataSubmit.msg)
      }
    },
    getText(val) {
      this.formContest.info = val
    }
  }
}
</script>

<style scoped>
.body {
  width: 100%;
  min-height: 400px;
}

.add-contest-box {
  width: 100%;
  min-height: 460px;
}

.left-box {
  float: left;
  width: 45%;
}

.right-box {
  float: left;
  width: 55%;
}
</style>
