<template>
  <div class="info-body">
    <el-card
      id="userInfo"
      class="box-card-userInfo"
      shadow="always"
    >
      <div class="user-avatar">
        <img
          class="avatar-img"
          :src="userCustomInfo.avatarUrl"
        >
        <img
          class="seal-img"
          :src="userCustomInfo.sealUrl"
        >
      </div>
      <div>
        <h1>
          <span class="user-adjective">{{ userCustomInfo.adjectiveTitle }}</span>
          的
          <span class="user-noun">{{ userCustomInfo.articleTitle }}</span>
          <span class="user-nick">{{ userBaseInfo.nick }}</span>
        </h1>
        <h2>{{ userBaseInfo.motto }}</h2>
      </div>
      <!-- TODO: 暂时使用style，之后替换为css -->
      <div class="info-detail">
        <span style="color:blue;font-size:26px;">{{ userBaseInfo.nick }}</span>
        (<span style="color:orange;font-size:26px;">{{ userBaseInfo.username }}</span>)在
        <span> {{ formatterDate(userBaseInfo.registerTime) }} </span>加入FJUT Coder，
        来自 <span style="color:white;font-size:26px;">{{ userBaseInfo.school }}</span>。
        <tr />
        目前共参加了 <span style="color:blue;font-size:26px;">[xxx]</span> 场积分赛，
        目前积分达到了<span style="color:orange;font-size:26px;">{{ userBaseInfo.rating }}</span>，
        在所有人中排名第 <span style="color:red;font-size:26px;">{{ userBaseInfo.ranking }} </span>。
        <tr />
        已经在我们的平台上AC过<span style="color:red;font-size:26px;">{{ userBaseInfo.acNum }}</span>道题目，
        已经<span v-html="userBaseInfo.acDes" />了，
        一共提交过<span style="color:red;font-size:26px;">{{ userBaseInfo.totalSubmit }}</span>次。
        <tr />
        一共给<span style="color:red;font-size:26px;">[xxx]</span>道题目贴过标签，
        当前有<span style="color:red;font-size:26px;">{{ userBaseInfo.acb }}</span>ACB。<br>
        <div v-if="rewardInfo.length !== 0">
          <span style="color:#eeeeee;font-size:26px;">正式队员经历：</span><br>
          <span
            v-for="item in rewardInfo"
            :key="item"
            style="font-size:20px;"
          >
            {{ item }}<br>
          </span>
        </div>

      </div>
      <div id="info-radar" />
      <div
        v-if="!isVisitor"
        class="info-permission"
      >
        【拥有权限】<br>
        <el-tag
          v-for="per in userPerList"
          :key="per"
          effect="dark"
          type="success"
          size="small"
        >{{ per }}</el-tag>
      </div>
    </el-card>
    <el-card class="box-card">
      <div id="graph-rating-change" />
    </el-card>
    <el-card class="box-card">
      <div id="graph-submit-change" />
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        已解决题目:{{ problemSolved.length }}
      </div>
      <div
        v-for="item in problemSolved"
        :key="item"
      >
        <div
          class="problem-id"
          @click="toSubmit(item)"
        >{{ item }}</div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        尝试过但是仍未解决的题目列表：{{ problemSolving.length }}
      </div>
      <div
        v-for="item in problemSolving"
        :key="item"
      >
        <div
          class="problem-id"
          @click="toSubmit(item)"
        >
          {{ item }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import formatterDate from '../utils/formatterDate'

export default {
  data() {
    return {
      userBaseInfo: '',
      userCustomInfo: '',
      rewardInfo: [],
      radar: [],
      title: '',
      userPerList: [],
      problemSolved: [],
      problemSolving: [],
      isVisitor: false
    }
  },
  created() {

  },
  mounted() {
    if (this.$store.getters.getIsLogin) {
      let username = ''
      // 如果路径中带参数则为访客模式
      if (this.$route.query.username) {
        this.isVisitor = true
        username = this.$route.query.username
      } else {
        this.isVisitor = false
        username = this.$store.getters.getUsername
        this.getUserPermission(username)
      }
      this.getUserInfo(username)
      this.getRadarData(username)
      this.getRewardInfo(username)
      this.getRatingRecord(username)
      this.getSubmitRecord(username)
      this.getStatusProblems(username)
    } else {
      this.$message.warning('登录后查看！')
    }
  },
  methods: {
    formatterDate(str) {
      return formatterDate(str, 'yyyy年MM月dd日')
    },
    async getUserInfo(username) {
      const params = new URLSearchParams()
      params.append('username', username)
      const dataUserInfo = await this.$http.get('/user/info', params)
      this.userBaseInfo = dataUserInfo.datas[0]
      this.userCustomInfo = dataUserInfo.datas[1]
      this.userBaseInfo.totalSubmit = dataUserInfo.datas[2]
      if (this.userBaseInfo.acNum >= 0 && this.userBaseInfo.acNum <= 10) {
        this.userBaseInfo.acDes = '<font color="rgb(128, 128, 128)" size="5px">找到编程的大门</font>'
      } else if (this.userBaseInfo.acNum <= 100) {
        this.userBaseInfo.acDes = '<font color="rgb(64, 191, 64)" size="6px">有点东西</font>'
      } else if (this.userBaseInfo.acNum <= 400) {
        this.userBaseInfo.acDes = '<font color="rgb(0, 255, 0)" size="7px">渐入佳境</font>'
      } else if (this.userBaseInfo.acNum <= 1000) {
        this.userBaseInfo.acDes = '<font color="rgb(0, 0, 255)" size="8px">无人能挡</font>'
      } else {
        this.userBaseInfo.acDes = '<font color="red" size="10px">独步天下</font>'
      }
    },
    async getRewardInfo(username) {
      const params = new URLSearchParams()
      params.append('username', username)
      const dataAwardInfo = await this.$http.get('/user/award', params)
      this.rewardInfo = dataAwardInfo.datas[0]
      console.log(this.rewardInfo)
    },
    async getRadarData(username) {
      const params = new URLSearchParams()
      params.append('username', username)
      const dataUserRadar = await this.$http.get('/problem/radar', params)
      const tempRadarData = dataUserRadar.datas[0]
      for (let i = 0; i < tempRadarData.length; i++) {
        this.radar.push(tempRadarData[i].score)
      }
      this.setRadar()
    },
    async getUserPermission() {
      // let username = this.$store.getters.getUsername
      // let params = new URLSearchParams()
      // params.append('username', username)
      // let dataUserPermission = await this.$http
      //   .get('/permission/getUserPermission', params)
      // let perListTemp = dataUserPermission.datas[0]
      // for (let i = 0; i < perListTemp.length; i++) {
      //   this.userPerList.push(userPerType[perListTemp[i]])
      // }
    },
    setRadar() {
      const myChart = echarts.init(document.getElementById('info-radar'))
      const option = {
        tooltip: {},
        radar: {
          name: {
            textStyle: {
              color: 'white'
            }
          },
          indicator: [
            { name: '基础', max: 100 },
            { name: '数据结构', max: 100 },
            { name: '数学', max: 100 },
            { name: '几何', max: 100 },
            { name: '图论', max: 100 },
            { name: '搜索', max: 100 },
            { name: '动态规划', max: 100 }
          ]
        },
        series: [
          {
            name: this.userBaseInfo.nick + '的技能雷达图，显示数字为百分比',
            type: 'radar',
            itemStyle: { normal: { areaStyle: { type: 'default' }}},
            data: [{ value: this.radar }]
          }
        ]
      }
      myChart.setOption(option)
    },
    async getRatingRecord(username) {
      // let params = new URLSearchParams()
      // params.append('username', username)
      // let dataRatingGraph = await this.$http
      //   .get('/user/getRatingGraph', params)
      //   .catch(() => {

      //   })
      // this.ratingrecord = dataRatingGraph.datas[0]
      // this.setGraphRatingChange()
    },
    setGraphRatingChange() {
      const myChart = echarts.init(document.getElementById('graph-rating-change'))
      const option = {
        tooltip: {},
        title: {
          text: 'Rating变化',
          x: 'center'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Object.keys(this.ratingrecord)
        },
        yAxis: {
          name: 'submit',
          type: 'value'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: 'Rating变化',
            type: 'line',
            areaStyle: {},
            data: Object.values(this.ratingrecord)
          }
        ]
      }
      myChart.setOption(option)
    },
    async getSubmitRecord(username) {
      // let params = new URLSearchParams()
      // params.append('username', username)
      // let dataAllStatusByUsername = await this.$http
      //   .post('/status/GAllStatusByUsername', params)
      //   .catch(() => {

      //   })
      // this.submitrecord = dataAllStatusByUsername.datas[0]
      // this.setGraphSubmitChange()
    },
    setGraphSubmitChange() {
      const myChart = echarts.init(document.getElementById('graph-submit-change'))
      const option = {
        tooltip: {},
        title: {
          text: '最近1年提交记录',
          x: 'center'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.submitrecord ? Object.keys(this.submitrecord) : '无'
        },
        yAxis: {
          name: 'submit',
          type: 'value'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: '提交记录',
            type: 'line',
            areaStyle: {},
            data: this.submitrecord ? Object.values(this.submitrecord) : 0
          }
        ]
      }
      myChart.setOption(option)
    },
    async getStatusProblems(username) {
      // let params = new URLSearchParams()
      // params.append('username', username)
      // params.append('status', 1)
      // let dataProblemSolving = await this.$http
      //   .post('/user/GStatusProblems', params)
      //   .catch(() => {

      //   })
      // this.problemSolved = dataProblemSolving.datas[0]
      // params.set('status', 0)
      // let dataProblemSolved = await this.$http
      //   .post('/user/GStatusProblems', params)
      //   .catch(() => {

      //   })
      // this.problemSolving = dataProblemSolved.datas[0]
    },
    toSubmit(val) {
      this.$router.push({ path: '/Submit', query: { pid: val }})
    }
  }

}
</script>

<style scoped >
.info-body {
  min-height: 800px;
  width: auto;
}

.box-card-userInfo {
  background: url(../assets/image/bg/bg_userindex.jpg);
  background-size: 100% 100%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 20px;
  width: auto;
  min-height: 400px;
  height: auto;
}

.box-card {
  background-size: 100% 100%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 15px;
  min-height: 100px;
  height: auto;
}

.user-avatar {
  text-align: center;
  width: 360px;
  height: 210px;
  margin: auto;
}

.avatar-img {
  position: absolute;
  border: 8px solid #eeeeee;
  border-radius: 180px;
  width: 180px;
  height: 180px;
}

.seal-img {
  text-align: center;
  width: 150px;
  height: 60px;
  margin-top: 140px;
  margin-left: 75px;
  z-index: 999;
  transform: rotate(-30deg);
}

.user-adjective {
  color: red;
}

.user-noun {
  color: green;
}

.user-nick {
  color: blue;
}

.info-detail {
  text-align: left;
  float: left;
  width: 790px;
  min-height: 100px;
  font-size: 20px;
  color: white;
  line-height: 40px;
}

#info-radar {
  float: right;
  min-width: 320px;
  height: 320px;
  padding: 5px;
}

#graph-rating-change {
  width: 100%;
  height: 400px;
}

#graph-submit-change {
  width: 100%;
  height: 400px;
}

.info-permission {
  float: left;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  min-height: 100px;
  min-width: 600px;
}

.el-tag {
  margin-bottom: 4px;
  margin-right: 14px;
}

.box-card-title {
  font-weight: bold;
  font-size: 18px;
}

.problem-id {
  color: #337ab7;
  float: left;
  width: 90px;
  cursor: pointer;
  margin-bottom: 10px;
  margin-left: 2%;
}

.problem-id:hover {
  color: blue;
  text-decoration: underline;
}
</style>
