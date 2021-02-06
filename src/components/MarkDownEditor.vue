<template>
  <div class="markdown-body">
    <mavon-editor ref="md" v-model="value" code-style="dracula" :ishljs="true" @imgAdd="$imgAdd" @change="handleChange" />
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
const config = require('../../config/oj.config.json')
export default {
  components: {
    mavonEditor
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {},
  mounted() {
    this.value = this.text
  },
  methods: {
    handleChange(value, render) {
      this.$emit('inputValue', value)
      this.$emit('inputRender', render)
    },
    // 绑定@imgAdd event
    async $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      const data = await this.$http.uploadFile('/file/upload', formdata)
      console.log(data)
      this.$refs.md.$img2Url(pos, config.apiUrl + data.datas[0])
    }
  }
}
</script>

<style>
.markdown-body {
  width: 100%;
}
</style>
