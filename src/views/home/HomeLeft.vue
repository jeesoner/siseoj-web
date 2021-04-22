<template>
  <div class="home-info-body">
    <el-card class="welcome-card">
      <div slot="header" class="content-center">
        <span class="panel-title home-title welcome-title">Welcome to Niu Code</span>
      </div>
      <div class="content-center">
        <h2>
          欢迎大家光临和使用本OJ
        </h2>
        <h3>
          这是一个的前后端分离的在线评测系统。
        </h3>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <i class="el-icon-document" /> 公告栏
      </div>
      <div v-html="message" />
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <i class="el-icon-link" /> 资源索引
      </div>
      <el-collapse id="download-file">
        <el-collapse-item name="1">
          <template slot="title">
            <div>浏览器下载</div>
          </template>
          <div>
            <el-tag type="danger">
              <el-link
                href="https://www.google.cn/chrome/"
                target="_blank"
                :underline="false"
                type="danger"
              >谷歌浏览器</el-link>
            </el-tag>
            <el-tag type="warning">
              <el-link
                href="https://www.firefox.com.cn/"
                target="_blank"
                :underline="false"
                type="warning"
              >火狐浏览器</el-link>
            </el-tag>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div>集成开发环境（IDE）下载</div>
          </template>
          <div>
            <el-tag type="success">
              <el-link
                href="http://www.codeblocks.org/"
                target="_blank"
                :underline="false"
                type="success"
              >Code::Blocks</el-link>
            </el-tag>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div>其他工具下载</div>
          </template>
          <div>
            <el-tag>
              <el-link
                href="http://120.78.128.11/file/jihehuaban.zip"
                target="_blank"
                :underline="false"
                type="primary"
              >几何画板</el-link>
            </el-tag>
            <el-tag type="info">
              <el-link
                href="http://120.78.128.11/file/upload/20160818/1471501247639019014.zip"
                target="_blank"
                :underline="false"
              >卡西欧计算器</el-link>
            </el-tag>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <div>友情链接</div>
          </template>
          <div>
            <el-tag type="success">
              <el-link
                href="http://github.com/cijee"
                target="_blank"
                :underline="false"
                type="success"
              >Github</el-link>
            </el-tag>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <!-- <el-card class="box-card"></el-card> -->
  </div>
</template>

<script>
import echarts from 'echarts'
import formatterDate from '../../utils/formatterDate'

export default {
  data() {
    return {
      message: 'Hello World~',
      loaded: false,
      recommendProblems: [],
      statusCount: [],
      days: 1000,
      myChart: ''
    }
  },
  created() {

  },
  mounted() {
    // this.getInfo()
    // this.getRecommendProblems()
    // this.getStatusCount()
    // this.initEcharts()
  },
  methods: {
    initEcharts() {
      this.myChart = echarts.init(document.getElementById('submit-charts'))
      this.myChart.showLoading()
    },
    async getInfo() {
      const params = new URLSearchParams()
      params.append('name', 'homePageNotify')
      const dataNotify = await this.$http.get('/system/info', params)
      if (dataNotify.code === 10000) {
        this.message = dataNotify.datas[0].value
      } else {
        this.message = '【公告获取失败】'
      }
    },
    async getRecommendProblems() {
      const params = new URLSearchParams()
      params.append('username', this.$store.getters.getUsername)
      const dataRecommend = await this.$http.get('/problem/recommend', params)
      this.recommendProblems = dataRecommend.datas[0]
      this.loaded = true
    },
    async getStatusCount() {
      const params = new URLSearchParams()
      params.append('days', this.days)
      const dataStatusCount = await this.$http.get('/judge_status/count', params)
      this.statusCount = dataStatusCount.datas[0]
      this.loadEcharts()
    },
    toSubmit(pid) {
      this.$router.push({ path: '/Submit', query: { pid: pid }})
    },
    loadEcharts() {
      const submitDays = []
      const totalCounts = []
      const acCounts = []
      for (const i of this.statusCount) {
        submitDays.push(formatterDate(i.submitDay, 'yyyy-MM-dd'))
        totalCounts.push(i.totalCount)
        acCounts.push(i.acCount)
      }
      const option = {
        title: {
          text: '本站最近' + this.days + '天提交记录'
        },
        tooltip: {
        },
        legend: {
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: submitDays || '无'
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 50
          }
        ],
        series: [
          {
            name: '当天提交记录数',
            type: 'line',

            data: totalCounts || 0
          },
          {
            name: '当天AC记录数',
            type: 'line',
            data: acCounts || 0
          }
        ]
      }
      this.myChart.setOption(option)
      this.myChart.hideLoading()
    }
  }
}
</script>

<style scoped>
.home-info-body {
  padding: 0;
  width: 100%;
  margin: 0;
}
.welcome-card {
  min-height: 200px;
  margin-bottom: 15px;
}
.content-center {
  text-align: center;
}
.welcome-title {
  font-weight: 600;
  font-size: 25px;
}
.box-card {
  min-height: 200px;
  margin-bottom: 15px;
}

#submit-charts {
  width: 100%;
  height: 400px;
}

.showmore-link {
  float: right;
  font-size: 14px;
}

.el-tag {
  margin-right: 14px;
}

.info-font {
  font-size: 16px;
  line-height: 35px;
}
</style>
