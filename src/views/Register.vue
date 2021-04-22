<template>
  <el-card
    v-loading="loading"
    class="register-body"
  >
    <div slot="header">用户注册</div>
    <el-form
      ref="regForm"
      :rules="rules"
      :model="registerForm"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名，必须为合法字符，长度在4-16之间"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="registerForm.password"
          show-password
          placeholder="请输入密码，必须为合法字符，长度在6-16之间"
        />
      </el-form-item>
      <el-form-item
        label="重复密码"
        prop="passwordAgain"
      >
        <el-input
          v-model="registerForm.passwordAgain"
          show-password
          placeholder="请再次输入密码，需一致"
        />
      </el-form-item>
      <el-form-item
        label="昵称"
        prop="nickname"
      >
        <el-input
          v-model="registerForm.nickname"
          placeholder="昵称可以让别人更好记住你哦"
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="registerForm.gender">
          <el-radio label="0">保密</el-radio>
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="registerForm.email"
          placeholder="邮箱是唯一的找回密码方式"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="registerUser">确认</el-button>
        <el-button @click="resetForm('regForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { register } from '@/api/login'

export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      var reg = /^\w+$/
      if (!reg.test(value)) {
        callback(new Error('请输入字母、数字或者下划线'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      var reg = /^\w+$/
      if (!reg.test(value)) {
        callback(new Error('请输入字母、数字或者下划线'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      if (!reg.test(value)) {
        callback(new Error('邮箱不合法'))
      } else {
        callback()
      }
    }
    return {
      // 上传是否结束
      uploadComplete: false,
      loading: false,
      uploadAvatar: false,
      registerForm: {
        username: '',
        password: '',
        passwordAgain: '',
        nickname: '',
        gender: 0,
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在4-16个字符之间', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16个字符之间', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16个字符之间', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在1-8个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 监听是否完成头像上传
    // uploadComplete(val) {
    //   if (val) {
    //     this.registerUser()
    //   }
    // }
  },
  created() {
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 告诉头像组件上传图片
          this.uploadAvatar = true
          this.loading = true
          this.logger.i('onsubmit正常')
        } else {
          this.logger.e('onsubmit错误')
          return false
        }
      })
    },
    getAvatarUrl(val) {
      this.registerForm.avatarUrl = val
      this.uploadComplete = true
    },
    registerUser() {
      console.log('注册用户')
      const registerData = Object.assign({}, this.registerForm)
      register(registerData).then(res => {
        this.loading = true
        this.$message.success('注册成功！')
        this.$router.push({ name: 'Login' })
      }).catch(() => {
        this.loading = false
      })
      this.loading = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.register-body {
  width: 30%;
  min-height: 400px;
  margin: auto;
}
</style>
