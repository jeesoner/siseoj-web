<template>
  <div style="margin: 0px 0px 15px 0px;font-size: 14px;">
    <el-row class="header">
      <el-col :xs="24" :md="16" :lg="16">
        <div class="select-row">
          <span>Langs:</span>
          <span>
            <el-select
              :value="this.language"
              class="adjust"
              size="small"
              @change="onLangChange"
            >
              <el-option
                v-for="item in languages"
                :key="item"
                :value="item"
              >{{ item }}
              </el-option>
            </el-select>
          </span>
          <span>
            <el-tooltip content="重置代码" placement="top" style="">
              <el-button
                icon="el-icon-refresh"
                size="small"
                @click="onResetClick"
              />
            </el-tooltip>
          </span>
          <span>
            <el-tooltip content="上传文件" placement="top" style="">
              <el-button
                icon="el-icon-upload"
                size="small"
                @click="onUploadFile"
              />
            </el-tooltip>
          </span>
          <span>
            <input
              id="file-uploader"
              type="file"
              style="display: none"
              @change="onUploadFileDone"
            >
          </span>
        </div>
      </el-col>
      <el-col :xs="24" :md="8" :lg="8">
        <div class="select-row fl-right">
          <span>Theme:</span>
          <el-select
            :value="this.theme"
            class="adjust"
            size="small"
            @change="onThemeChange"
          >
            <el-option
              v-for="item in themes"
              :key="item.label"
              :value="item.value"
            >{{ item.label }}
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <codemirror
      ref="myEditor"
      :value="value"
      :options="options"
      @change="onEditorCodeChange"
    />
  </div>
</template>
<script>
import { codemirror } from 'vue-codemirror-lite'
import 'codemirror/mode/javascript/javascript'

// 风格对应的样式
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/material.css'

// mode
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'

export default {
  name: 'CodeMirror',
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    languages: {
      type: Array,
      default: () => {
        return ['C/C++', 'Java', 'Python']
      }
    },
    language: {
      type: String,
      default: 'C/C++'
    },
    theme: {
      type: String,
      default: 'solarized'
    }
  },
  data() {
    return {
      options: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-c++src',
        theme: 'solarized',
        // 显示行号
        lineNumbers: true,
        line: true,
        // 代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineWrapping: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        autofocus: true,
        styleActiveLine: true
      },
      mode: {
        // 'C': 'text/x-csrc',
        'C/C++': 'text/x-c++src',
        'Java': 'text/x-java',
        'Python': 'text/x-python'
      },
      themes: [
        { label: 'monokai', value: 'monokai' },
        { label: 'solarized', value: 'solarized' },
        { label: 'material', value: 'material' }
      ]
    }
  },
  computed: {
    editor() {
      // get current editor object
      return this.$refs.myEditor.editor
    },
    currentLanguage() {
      return this.language
    }
  },
  watch: {
    theme(newVal, oldVal) {
      this.editor.setOption('theme', newVal)
    }
  },
  mounted() {
    this.editor.setOption('mode', this.mode[this.language])
    this.editor.focus()
  },
  methods: {
    onEditorCodeChange(newCode) {
      this.$emit('update:value', newCode)
    },
    onLangChange(newVal) {
      this.editor.setOption('mode', this.mode[newVal])
      this.$emit('changeLang', newVal)
    },
    onThemeChange(newTheme) {
      this.editor.setOption('theme', newTheme)
      this.$emit('changeTheme', newTheme)
    },
    onResetClick() {
      this.$emit('resetCode')
    },
    onUploadFile() {
      document.getElementById('file-uploader').click()
    },
    onUploadFileDone() {
      const f = document.getElementById('file-uploader').files[0]
      const fileReader = new window.FileReader()
      const self = this
      fileReader.onload = function(e) {
        var text = e.target.result
        self.editor.setValue(text)
        document.getElementById('file-uploader').value = ''
      }
      fileReader.readAsText(f, 'UTF-8')
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 10px;
  margin-right: 5px;
  margin-left: 5px;
}
.header .adjust {
  width: 130px;
  margin-left: 5px;
}
.select-row {
  margin-top: 4px;
}
@media screen and (max-width: 768px) {
  .select-row span {
    margin-right: 2px;
  }
}
@media screen and (min-width: 768px) {
  .select-row span {
    margin-right: 5px;
  }
  .fl-right {
    float: right;
  }
}
</style>

<style>
.CodeMirror {
  height: auto !important;
}
.CodeMirror-scroll {
  min-height: 549px;
  max-height: 1000px;
}
</style>
