<template>
  <div>
    <div class="section-title">头像设置</div>
    <div class="section-main">
      <avatar
        :username="formProfile.username"
        :inline="true"
        :size="130"
        color="#FFF"
        style="margin-bottom:15px"
        :src="baseApi + '/avatar/' + avatar"
      />
      <template v-if="!avatarOption.imgSrc">
        <el-upload
          class="upload-container"
          action=""
          drag
          :before-upload="handleSelectFile"
        >
          <div style="padding: 20px 0">
            <i class="el-icon-upload" style="color: #3399ff;font-size:52px" />
            <p>将头像图片拖放到此处，或者单击手动选择。</p>
          </div>
        </el-upload>
      </template>

      <template v-else>
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <div class="cropper-main inline">
              <vueCropper
                ref="cropper"
                auto-crop
                fixed
                :auto-crop-width="200"
                :auto-crop-height="200"
                :img="avatarOption.imgSrc"
                :output-size="avatarOption.size"
                :output-type="avatarOption.outputType"
                :info="true"
                @realTime="realTime"
              />
            </div>
            <div class="cropper-btn">
              <el-tooltip
                class="item"
                effect="dark"
                content="向左旋转90°"
                trigger="hover"
                placement="bottom"
              >
                <el-button
                  icon="el-icon-refresh-left"
                  size="mini"
                  @click="rotate('left')"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="向右旋转90°"
                trigger="hover"
                placement="bottom"
              >
                <el-button
                  icon="el-icon-refresh-right"
                  size="mini"
                  @click="rotate('right')"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="关闭图像截取"
                trigger="hover"
                placement="bottom"
              >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="reselect"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                trigger="hover"
                content="确定图像截取"
                placement="bottom"
              >
                <el-button
                  icon="el-icon-check"
                  size="mini"
                  @click="finishCrop"
                />
              </el-tooltip>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="cropper-preview" :style="previewStyle">
              <div :style="preview.div">
                <img :src="avatarOption.imgSrc" :style="preview.img">
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <el-dialog
        :visible.sync="uploadModalVisible"
        title="上传头像"
        width="350px"
      >
        <div class="upload-modal">
          <p class="notice">你的头像将被设置为如下:</p>
          <img :src="uploadImgSrc">
        </div>
        <div slot="footer">
          <el-button
            :loading="loadingUploadBtn"
            type="primary"
            @click="uploadAvatar"
          >确定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="section-title">用户设置</div>
    <el-form ref="formProfile" :model="formProfile">
      <el-row :gutter="30" justify="space-around">
        <el-col :md="10" :xs="24">
          <el-form-item label="昵称">
            <el-input v-model="formProfile.nickname" :maxlength="50" />
          </el-form-item>
          <el-form-item label="学校">
            <el-input v-model="formProfile.school" :maxlength="50" />
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="formProfile.course" :maxlength="25" />
          </el-form-item>
        </el-col>
        <el-col :md="4" :lg="4">
          <div class="separator hidden-md-and-down" />
          <p />
        </el-col>
        <el-col :md="10" :xs="24">
          <el-form-item label="个性签名">
            <el-input v-model="formProfile.motto" :maxlength="50" />
          </el-form-item>
          <el-form-item label="博客地址">
            <el-input v-model="formProfile.blog" />
          </el-form-item>
          <el-form-item label="Github">
            <el-input v-model="formProfile.github" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center;margin-top:10px">
      <el-button
        type="primary"
        :loading="loadingSaveBtn"
        @click="updateUserInfo"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import avatar from 'vue-avatar'
import {mapActions, mapGetters} from 'vuex'
import userApi from '@/api/user/user'
import { filterEmptyValue } from '@/utils/index'

export default {
  components: {
    avatar
  },
  data() {
    return {
      loadingSaveBtn: false,
      loadingUploadBtn: false,
      uploadModalVisible: false,
      preview: {},
      uploadImgSrc: '',
      avatarOption: {
        imgSrc: '',
        size: 0.8,
        outputType: 'png'
      },

      formProfile: {
        id: '',
        username: '',
        nickname: '',
        motto: '',
        course: '',
        blog: '',
        school: '',
        github: ''
      }
    }
  },
  computed: {
    ...mapGetters(['baseApi']),
    avatar() {
      return this.$store.getters.user.avatar
    },
    previewStyle() {
      return {
        width: this.preview.w + 'px',
        height: this.preview.h + 'px',
        overflow: 'hidden'
      }
    }
  },
  mounted() {
    const profile = this.$store.getters.user
    Object.keys(this.formProfile).forEach((element) => {
      if (profile[element] !== undefined) {
        this.formProfile[element] = profile[element]
      }
    })
  },
  methods: {
    ...mapActions(['getInfo']),
    checkFileType(file) {
      if (!/\.(gif|jpg|jpeg|png|bmp|webp|GIF|JPG|PNG|WEBP)$/.test(file.name)) {
        this.$notify.warning({
          title: '文件类型不支持',
          message:
            file.name +
            '的文件格式不正确，请选择.gif,.jpg,.jpeg,.png,.bmp,.webp的图片文件。'
        })
        return false
      }
      return true
    },
    checkFileSize(file) {
      // max size is 2MB
      if (file.size > 2 * 1024 * 1024) {
        this.$notify.warning({
          title: '超出最大文件大小限制',
          message:
            '文件[' + file.name + ']太大, 您只能上传不大于2MB的图片文件！'
        })
        return false
      }
      return true
    },
    handleSelectFile(file) {
      const isOk = this.checkFileType(file) && this.checkFileSize(file)
      if (!isOk) {
        return false
      }
      const reader = new window.FileReader()
      reader.onload = (e) => {
        this.avatarOption.imgSrc = e.target.result
      }
      reader.readAsDataURL(file)
      return false
    },
    realTime(data) {
      this.preview = data
    },
    rotate(direction) {
      if (direction === 'left') {
        this.$refs.cropper.rotateLeft()
      } else {
        this.$refs.cropper.rotateRight()
      }
    },
    reselect() {
      this.$confirm('您确定取消该图像的截取？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.avatarOption.imgSrc = ''
      })
    },
    finishCrop() {
      this.$refs.cropper.getCropData((data) => {
        this.uploadImgSrc = data
        this.uploadModalVisible = true
      })
    },
    // 更新用户头像
    uploadAvatar() {
      this.$refs.cropper.getCropBlob((blob) => {
        const form = new window.FormData()
        const file = new window.File(
          [blob],
          'avatar.' + this.avatarOption.outputType
        )
        form.append('avatar', file)
        this.loadingUploadBtn = true
        userApi.changeAvatar(form).then((res) => {
          this.loadingUploadBtn = false
          this.$message.success('修改头像成功')
          this.uploadModalVisible = false
          this.avatarOption.imgSrc = ''
          this.$store.commit('changeAvatar', res.avatar)
        }).catch(() => {
          this.loadingUploadBtn = false
        })
      })
    },
    updateUserInfo() {
      this.loadingSaveBtn = true
      const updateData = filterEmptyValue(
        Object.assign({}, this.formProfile)
      )
      userApi.update(updateData).then((res) => {
        this.getInfo()
        this.$message.success('更新用户信息成功')
        this.loadingSaveBtn = false
      }).catch(() => {
        this.loadingSaveBtn = false
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__inner {
  height: 32px;
}
::v-deep .el-form-item__label {
  font-size: 12px;
  line-height: 20px;
}
.section-title {
  font-size: 21px;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 20px;
  line-height: 30px;
  text-align: center;
}
.section-main {
  text-align: center;
  margin-bottom: 20px;
}

::v-deep .upload-container .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 320px;
}
::v-deep .upload-container .el-upload:hover {
  border-color: #409eff;
}
.inline {
  display: inline-block;
}
.cropper-btn {
  margin: 10px 0;
}
.copper-img {
  width: 400px;
  height: 300px;
}

.cropper-main {
  flex: none;
  width: 400px;
  height: 300px;
}
.section-main .cropper-preview {
  flex: none;
  text-align: center;
  box-shadow: 0 0 1px 0;
}
@media screen and (max-width: 1080px) {
  .section-main .cropper-preview {
    margin: 0 auto;
  }
}
.upload-modal .notice {
  font-size: 16px;
  display: inline-block;
  vertical-align: top;
  padding: 10px;
}
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-upload-dragger {
  width: 100%;
  height: 100%;
}
.upload-modal img {
  box-shadow: 0 0 1px 0;
  border-radius: 50%;
  width: 250px;
  height: 250px;
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
