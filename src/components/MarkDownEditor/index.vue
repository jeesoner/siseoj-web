<template>
  <div class="markdown-body" :style="handleHeight">
    <mavon-editor ref="md" v-model="currentValue" code-style="dracula" :ishljs="true" @imgAdd="$imgAdd" @change="handleChange" />
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
const config = require('../../settings.js')
export default {
  name: 'MdEditor',
  components: {
    mavonEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    height: [Number]
  },
  data() {
    return {
      currentValue: this.value,
      contentHeight: this.height + 'px'
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    },
    currentValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleChange(value, render) {
      this.$emit('inputValue', value)
      this.$emit('inputRender', render)
    },
    handleHeight() {
      if (this.height) {
        return this.height
      } else {
        return ''
      }
    },
    // 绑定@imgAdd event
    async $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      const data = await this.$http.uploadFile('/file/upload', formdata)
      console.log(data)
      this.$refs.md.$img2Url(pos, config.serverUrl + data.datas[0])
    }
  }
}
</script>

<style>
.markdown-body {
  width: 100%;
}
</style>
