<template>
  <div class="ace-container">
    <div
      ref="ace"
      class="ace-editor"
    />
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/html'
import 'ace-builds/src-noconflict/snippets/css'
import 'ace-builds/src-noconflict/snippets/scss'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/text'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-javascript'

const modeArray = [{
  name: 'JavaScript',
  path: 'ace/mode/javascript'
}, {
  name: 'HTML',
  path: 'ace/mode/html'
}, {
  name: 'CSS',
  path: 'ace/mode/css'
}, {
  name: 'SCSS',
  path: 'ace/mode/scss'
}, {
  name: 'Json',
  path: 'ace/mode/json'
}, {
  name: 'Java',
  path: 'ace/mode/java'
}, {
  name: 'Text',
  path: 'ace/mode/text'
}, {
  name: 'C/C++',
  path: 'ace/mode/c_cpp'
}, {
  name: 'Python',
  path: 'ace/mode/python'
}]

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'C/C++'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    isFull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      aceEditor: null,
      toggle: false,
      wrap: true,
      EditThemePath: 'ace/theme/github',
      ReadOnlyThemePath: 'ace/theme/github',
      modePath: 'ace/mode/java',
      modeArray: modeArray
    }
  },
  watch: {
    language(val) {
      this.handleModelPathChange(this.language)
    },
    value(val) {
      // 双向绑定时，重新渲染界面会导致光标跳动，这里获得位置后再重置回去
      const position = this.aceEditor.getCursorPosition()
      this.aceEditor.getSession().setValue(this.value)
      this.aceEditor.moveCursorToPosition(position)
    }
  },
  mounted() {
    let Line = 28
    if (this.isFull) {
      Line = 33
    }
    this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: Line,
      minLines: Line,
      fontSize: 16,
      value: this.value ? this.value : '',
      theme: this.readOnly ? this.ReadOnlyThemePath : this.EditThemePath,
      mode: this.modePath,
      wrap: this.wrap,
      tabSize: 4
    })

    // 激活自动提示
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    })
    this.handleModelPathChange(this.language)
    this.logger.i(this.language)
    this.aceEditor.getSession().on('change', this.change)
    this.aceEditor.setReadOnly(this.readOnly)
  },
  methods: {
    change() {
      this.$emit('input', this.aceEditor.getSession().getValue())
    },
    handleModelPathChange(language) {
      for (let i = 0; i < modeArray.length; i++) {
        if (language === modeArray[i].name) {
          this.modePath = modeArray[i].path
          this.aceEditor.getSession().setMode(this.modePath)
          break
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.ace-container {
  min-height: 100px;
  // position: relative;
}
</style>
