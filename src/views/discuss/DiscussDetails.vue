<template>
  <div class="discuss-body">
    <el-card class="card-body">
      <div class="discuss-head">
        <h1>{{ discuss.title }}</h1>
        <el-row style="font-size: 15px; color: #333333;">
          <el-col :xs="24" :md="12">{{ discuss.nickname }}</el-col>
          <el-col :xs="24" :md="2">浏览数：{{ discuss.views }}</el-col>
          <el-col :xs="24" :md="2">点赞数：{{ discuss.likes }}</el-col>
          <el-col :xs="24" :md="8"><div>最后修改于：{{ discuss.modifyTime }}</div></el-col>
        </el-row>
      </div>
      <hr style="background-color: black">
      <div class="discuss-content" v-html="discuss.content" />
    </el-card>
  </div>
</template>
<script>
import discussApi from '@/api/discuss/discuss'
import { markdownToHtml } from '@/utils'

export default {
  data() {
    return {
      id: null,
      discuss: {
        title: '',
        content: '',
        views: 0,
        likes: 0
      }
    }
  },
  watch: {
    $route() {
      this.id = this.$route.params.id
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.init()
    this.backConfirm = true
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css'
  },
  methods: {
    init() {
      this.getDiscuss(this.id)
    },
    getDiscuss(id) {
      discussApi.get(id).then(res => {
        this.discuss = res
        this.discuss.content = markdownToHtml(res.content)
      })
    }
  }
}
</script>
<style scoped>
.discuss-body{
  width: 100%;
  min-height: 700px;
  padding-top: 0;
  margin: 0 0 20px;
}
.card-body{
  width: 70%;
  min-height: 450px;
  display: block;
  margin: auto;
}
.discuss-head{
  margin: 20px;
}
.discuss-content{
  margin: 20px;
}
</style>
