<template>
  <div class="avatar-body">
    <span>上传头像图片必须在 2M 以内，只能是 JPG 格式或者 PNG 格式!</span>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleAvatarChange"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
      >
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
      />
    </el-upload>
    <el-button
      v-if="imageUrl"
      size="small"
      type="danger"
      @click="clearAvatar"
    >清空图片</el-button>
  </div>
</template>

<script>
const config = require('../../config/oj.config.json')
export default {
  props: {
    doUpload: Boolean
  },
  data() {
    return {
      file: '',
      imageUrl: ''
    }
  },
  watch: {
    doUpload(val) {
      if (val) {
        this.uploadAvatar()
      }
    }
  },
  methods: {
    clearAvatar() {
      this.imageUrl = ''
    },
    handleAvatarChange(file, fileList) {
      this.file = file.raw
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async uploadAvatar() {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('type', 1)
      const data = await this.$http.post('/file/upload', formData)
      this.imageUrl = config.apiUrl + data.datas[0]
      this.$emit('returnUrl', this.imageUrl)
    }
  }
}
</script>

<style scoped>
.avatar-body {
  border: 1px dashed #d9d9d9;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 5px;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  border-radius: 5px;
}
</style>
