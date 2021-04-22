<template>
  <div class="setting-main">
    <el-row :gutter="20">
      <el-col :sm="24" :md="10" :lg="10">
        <div class="left">
          <p class="section-title">修改密码</p>
          <el-form
            ref="formPassword"
            class="setting-content"
            :model="formPassword"
            :rules="rulePassword"
          >
            <el-form-item label="旧的密码" prop="oldPassword">
              <el-input v-model="formPassword.oldPassword" type="password" />
            </el-form-item>
            <el-form-item label="新的密码" prop="newPassword">
              <el-input v-model="formPassword.newPassword" type="password" />
            </el-form-item>
            <el-form-item label="确认新的密码" prop="againPassword">
              <el-input v-model="formPassword.againPassword" type="password" />
            </el-form-item>
          </el-form>
          <el-popover
            v-model="visible.passwordSlideBlock"
            placement="top"
            width="350"
            trigger="click"
          >
            <el-button
              slot="reference"
              type="primary"
              :loading="loading.btnPassword"
              :disabled="disabled.btnPassword"
            >修改密码</el-button>
            <slide-verify
              v-show="!verify.passwordSuccess"
              ref="passwordSlideBlock"
              :l="42"
              :r="10"
              :w="325"
              :h="100"
              :accuracy="3"
              slider-text="请向右滑动验证"
              @success="changePassword"
              @again="onAgain('password')"
            />
            <el-alert
              v-show="verify.passwordSuccess"
              title="验证成功"
              type="success"
              :description="verify.passwordMsg"
              :center="true"
              :closable="false"
              show-icon
            />
          </el-popover>
        </div>
        <el-alert
          v-show="visible.passwordAlert.show"
          :title="visible.passwordAlert.title"
          :type="visible.passwordAlert.type"
          :description="visible.passwordAlert.description"
          :closable="false"
          effect="dark"
          style="margin-top:15px"
          show-icon
        />
      </el-col>
      <el-col :md="4" :lg="4">
        <div class="separator hidden-md-and-down" />
        <p />
      </el-col>
      <el-col :sm="24" :md="10" :lg="10">
        <div class="right">
          <p class="section-title">修改邮箱</p>
          <el-form
            ref="formEmail"
            class="setting-content"
            :model="formEmail"
            :rules="ruleEmail"
          >
            <el-form-item label="当前的密码" prop="password">
              <el-input v-model="formEmail.password" type="password" />
            </el-form-item>
            <el-form-item label="旧的邮箱">
              <el-input v-model="formEmail.oldEmail" disabled />
            </el-form-item>
            <el-form-item label="新的邮箱" prop="newEmail">
              <el-input v-model="formEmail.newEmail" />
            </el-form-item>
          </el-form>
          <el-popover
            v-model="visible.emailSlideBlock"
            placement="top"
            width="350"
            trigger="click"
          >
            <el-button
              slot="reference"
              type="primary"
              :loading="loading.btnEmailLoading"
              :disabled="disabled.btnEmail"
            >修改邮箱</el-button>
            <slide-verify
              v-show="!verify.emailSuccess"
              ref="emailSlideBlock"
              :l="42"
              :r="10"
              :w="325"
              :h="100"
              :accuracy="3"
              slider-text="请向右滑动验证"
              @success="changeEmail"
              @again="onAgain('email')"
            />
            <el-alert
              v-show="verify.emailSuccess"
              title="验证成功"
              type="success"
              :description="verify.emailMsg"
              :center="true"
              :closable="false"
              show-icon
            />
          </el-popover>
        </div>
        <el-alert
          v-show="visible.emailAlert.show"
          :title="visible.emailAlert.title"
          :type="visible.emailAlert.type"
          :description="visible.emailAlert.description"
          :closable="false"
          effect="dark"
          style="margin-top:15px"
          show-icon
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import userApi from '@/api/user/user'
import { encrypt } from '@/utils/rsaEncrypt'

export default {
  data() {
    const oldPasswordCheck = [
      {
        required: true,
        trigger: 'blur',
        message: '必须输入旧的密码'
      },
      {
        trigger: 'blur',
        min: 6,
        max: 20,
        message: '密码长度应该在6-20之间'
      }
    ]
    const CheckAgainPassword = (rule, value, callback) => {
      if (value !== this.formPassword.newPassword) {
        callback(new Error('Password does not match'))
      }
      callback()
    }
    const CheckNewPassword = (rule, value, callback) => {
      if (this.formPassword.oldPassword !== '') {
        if (this.formPassword.oldPassword === this.formPassword.newPassword) {
          callback(new Error("The new password doesn't change"))
        } else {
          // 对第二个密码框再次验证
          this.$refs.formPassword.validateField('again_password')
        }
      }
      callback()
    }
    const CheckEmail = (rule, value, callback) => {
      if (this.formEmail.oldEmail !== '') {
        if (this.formEmail.oldEmail === this.formEmail.newEmail) {
          callback(new Error("The new email doesn't change"))
        }
      }
      callback()
    }
    return {
      loading: {
        btnPassword: false,
        btnEmail: false
      },
      disabled: {
        btnPassword: false,
        btnEmail: false
      },
      verify: {
        passwordSuccess: false,
        passwordMsg: '',
        emailSuccess: false,
        emailMsg: ''
      },
      visible: {
        passwordAlert: {
          type: 'success',
          show: false,
          title: '',
          description: ''
        },
        emailAlert: {
          type: 'success',
          show: false,
          title: '',
          description: ''
        },
        passwordSlideBlock: false,
        emailSlideBlock: false
      },
      formPassword: {
        oldPassword: '',
        newPassword: '',
        againPassword: ''
      },
      formEmail: {
        password: '',
        oldEmail: '',
        newEmail: ''
      },
      rulePassword: {
        oldPassword: oldPasswordCheck,
        newPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '必须输入新的密码'
          },
          {
            trigger: 'blur',
            min: 6,
            max: 20,
            message: '密码长度应该在6-20之间'
          },
          { validator: CheckNewPassword, trigger: 'blur' }
        ],
        againPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '请再次输入密码'
          },
          { validator: CheckAgainPassword, trigger: 'blur' }
        ]
      },
      ruleEmail: {
        password: oldPasswordCheck,
        newEmail: [
          {
            required: true,
            message: '必须输入新的邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            trigger: 'change',
            message: '邮箱格式不合法'
          },
          { validator: CheckEmail, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.formEmail.oldEmail = this.$store.getters.user.email || ''
  },
  methods: {
    changePassword(times) {
      this.verify.passwordSuccess = true
      const time = (times / 1000).toFixed(1)
      this.verify.passwordMsg = '本次耗时' + time + 's'
      setTimeout(() => {
        this.visible.passwordSlideBlock = false
        this.verify.passwordSuccess = false
        // 无论后续成不成功，验证码滑动都要刷新
        this.$refs.passwordSlideBlock.reset()
      }, 1000)
      this.$refs['formPassword'].validate((valid) => {
        if (valid) {
          this.loading.btnPassword = true
          const data = Object.assign({}, this.formPassword)
          data.oldPassword = encrypt(data.oldPassword)
          data.newPassword = encrypt(data.newPassword)
          delete data.againPassword
          userApi.changePassword(data).then((res) => {
            this.loading.btnPassword = false
            this.$message.success('修改密码成功，请重新登录')
            setTimeout(() => {
              this.visible.passwordAlert = false
              this.$store.dispatch('logout').then(() => {
                // 跳转到登录页面
                this.$router.push({ name: 'Login' })
              })
            }, 2000)
          }).catch(() => {
            this.$message.success('修改密码失败')
            this.loading.btnPassword = false
          })
        }
      })
    },
    changeEmail(times) {
      this.verify.emailSuccess = true
      const time = (times / 1000).toFixed(1)
      this.verify.emailMsg = '本次耗时' + time + 's'
      setTimeout(() => {
        this.visible.emailSlideBlock = false
        this.verify.emailSuccess = false
        // 无论后续成不成功，验证码滑动都要刷新
        this.$refs.emailSlideBlock.reset()
      }, 1000)
      this.$refs['formEmail'].validate((valid) => {
        if (valid) {
          this.loading.btnEmail = true
          const data = Object.assign({}, this.formEmail)
          data.password = encrypt(data.password)
          userApi.changeEmail(data).then((res) => {
            this.loading.btnEmail = false
            this.$message.success('修改邮箱成功')
            // 更新本地缓存
            this.$store.dispatch('getInfo').then(res => {
              this.$refs['formEmail'].resetFields()
              this.formEmail.oldEmail = res.user.email
            })
          }).catch(() => {
            this.$message.error('修改邮箱失败')
            this.loading.btnEmail = false
          })
        }
      })
    },
    onAgain(type) {
      if ((type = 'password')) {
        this.$refs.passwordSlideBlock.reset()
      } else {
        this.$refs.emailSlideBlock.reset()
      }
      this.$message.warning('速度过快，可能为机器操作！请重新验证！')
    }
  }
}
</script>

<style scoped>
.section-title {
  font-size: 21px;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 20px;
  line-height: 30px;
}
.left {
  text-align: center;
}
.right {
  text-align: center;
}
::v-deep .el-input__inner {
  height: 32px;
}
::v-deep .el-form-item__label {
  font-size: 12px;
  line-height: 20px;
}
.separator {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  border: 1px dashed #eee;
}
</style>
