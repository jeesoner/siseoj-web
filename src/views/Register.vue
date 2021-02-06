<template>
  <el-card
    v-loading="loading"
    class="register-body"
  >
    <div slot="header">
      用户注册
    </div>
    <div class="left-body">
      <el-form
        ref="regForm"
        :rules="rules"
        :model="registerForm"
        label-width="80px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名，必须为合法字符，长度在4-16之间"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="oldpwd"
        >
          <el-input
            v-model="registerForm.oldpwd"
            show-password
            placeholder="请输入密码，必须为合法字符，长度在8-16之间"
          />
        </el-form-item>
        <el-form-item
          label="重复密码"
          prop="newpwd"
        >
          <el-input
            v-model="registerForm.newpwd"
            show-password
            placeholder="请再次输入密码，需一致"
          />
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="nick"
        >
          <el-input
            v-model="registerForm.nick"
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
        <el-form-item
          label="电话"
          prop="phone"
        >
          <el-input
            v-model="registerForm.phone"
            placeholder="有时候我们将通过电话联系您"
          />
        </el-form-item>
        <el-form-item label="学校">
          <el-input
            v-model="registerForm.school"
            placeholder="让我们知道你是哪个学校的大佬吧"
          />
        </el-form-item>
        <el-form-item label="学院">
          <el-input
            v-model="registerForm.faculty"
            placeholder="让我们知道你是哪个学院的大佬吧"
          />
        </el-form-item>
        <el-form-item label="专业">
          <el-input
            v-model="registerForm.major"
            placeholder="什么专业，这么厉害？"
          />
        </el-form-item>
        <el-form-item label="班级">
          <el-input
            v-model="registerForm.cla"
            placeholder="哪个班的，放学别走"
          />
        </el-form-item>
        <el-form-item label="学号">
          <el-input
            v-model="registerForm.studentId"
            placeholder="随便填填，实名认证后不能更改"
          />
        </el-form-item>
        <el-form-item label="毕业年份">
          <el-input
            v-model="registerForm.graduationYear"
            placeholder="苟富贵勿相忘"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="right-body">
      <el-form
        ref="registerForm"
        :rules="rules"
        :model="registerForm"
        label-width="80px"
      >
        <el-form-item label="头像">
          <Avatar
            :do-upload="uploadAvatar"
            @returnUrl="getAvatarUrl"
          />
        </el-form-item>
        <el-form-item label="宣言">
          <el-input
            v-model="registerForm.motto"
            placeholder="说点什么展示一下自己吧，50个字以内"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('regForm')"
          >立即注册账号</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import Avatar from '../components/AvatarComponent'

export default {
  components: {
    Avatar
  },
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
      if (value !== this.registerForm.oldpwd) {
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
    var validatePhone = (rule, value, callback) => {
      var reg = /^(13[0-9]{9})|(15[0-9][0-9]{8})|(18[0-9][0-9]{8})$/
      if (!reg.test(value)) {
        callback(new Error('电话号码不合法'))
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
        oldpwd: '',
        newpwd: '',
        nick: '',
        gender: '0',
        email: '',
        phone: '',
        school: '',
        faculty: '',
        major: '',
        cla: '',
        studentId: '',
        graduationYear: '',
        avatarUrl: '',
        motto: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在4-16个字符之间', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        oldpwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在8-16个字符之间', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        newpwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '长度在8-16个字符之间', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        nick: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在1-8个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 监听是否完成头像上传
    uploadComplete(val) {
      if (val) {
        this.registerUser()
      }
    }
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
    async registerUser() {
      const params = new URLSearchParams()
      params.append('avatarUrl', this.registerForm.avatarUrl)
      params.append('cla', this.registerForm.cla)
      params.append('email', this.registerForm.email)
      params.append('faculty', this.registerForm.faculty)
      params.append('gender', this.registerForm.gender)
      params.append('graduationYear', this.registerForm.graduationYear)
      params.append('major', this.registerForm.major)
      params.append('motto', this.registerForm.motto)
      params.append('nick', this.registerForm.nick)
      params.append('password', this.registerForm.oldpwd)
      params.append('phone', this.registerForm.phone)
      params.append('school', this.registerForm.school)
      params.append('studentId', this.registerForm.studentId)
      params.append('username', this.registerForm.username)
      const registerData = await this.$http.post('/user/register', params)
      if (registerData.code === 10000) {
        this.$message.success('注册成功! \n激活邮件已经发送到您的邮箱中，点击链接激活账号')
      } else {
        this.$message.error(registerData.msg)
      }
      this.loading = false
    }

  }
}
</script>

<style  scoped>
.register-body {
  width: 80%;
  min-height: 600px;
  margin: auto;
}

.left-body {
  float: left;
  width: 50%;
  min-height: 600px;
}

.right-body {
  float: left;
  width: 50%;
  min-height: 600px;
}
</style>
