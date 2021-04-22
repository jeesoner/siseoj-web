<template>
  <div class="docker">
    <el-card class="box-card">
      <div slot="header">{{ title }}</div>
      <el-form ref="form" :model="discuss" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="discuss.title" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="discuss.description" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <md-editor v-model="discuss.content" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" :loading="buttonLoading" @click="submitForm">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import MdEditor from '@/components/MarkDownEditor'
import discussApi from '@/api/discuss/discuss'
import discuss from '@/api/discuss/discuss'

export default {
  name: 'EditDiscuss',
  components: { MdEditor },
  data() {
    return {
      title: '新建帖子',
      discuss: {
        id: null,
        title: '',
        content: ''
      },
      buttonLoading: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.discuss.id = this.$route.params.id
    if (this.discuss.id) {
      discussApi.get(this.discuss.id).then(res => {
        this.discuss = res
      })
    }
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'Discuss' })
    },
    submitForm() {
      this.buttonLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = Object.assign({}, this.discuss)
          if (!data.id) {
            discussApi.add(data).then(res => {
              this.$message.success('创建帖子成功')
              this.buttonLoading = false
              this.$router.push({ name: 'Discuss' })
            }).catch(() => {
              this.buttonLoading = false
              this.$message.error('创建帖子失败')
            })
          } else {
            discussApi.update(data).then(res => {
              this.$message.success('更新帖子成功')
              this.buttonLoading = false
              this.$router.push({ name: 'Discuss' })
            }).catch(() => {
              this.buttonLoading = false
              this.$message.error('更新帖子失败')
            })
          }
        } else {
          return false
        }
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
</style>
