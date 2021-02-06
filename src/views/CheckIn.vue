<template>
  <div class="clockin-body">
    <el-card
      class="calendar-card"
      :body-style="{ padding: '0px' }"
    >
      <template slot="header">
        签到日历
      </template>
      <Calendar
        lang="zh"
        :events="clockInDateArr"
      />
    </el-card>
    <div class="list-box">
      <!-- 你的签到记录 -->
      <el-card>
        <el-pagination
          style="float:left"
          layout="prev, pager, next"
          :total="tableData.length"
          :page-size="pagesize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
        />
        <el-table
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          max-height="600"
        >
          <el-table-column
            prop="time"
            label="签到时间"
            min-width="25%"
          />
          <el-table-column
            label="状态"
            min-width="15%"
          >
            <template slot-scope="scope">
              <div :class="('日常签到'===scope.row.sign)?'table-row-normal':('迟到'===scope.row.sign?'table-row-late':'table-row-other')">{{ scope.row.sign }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="ip"
            label="签到IP"
            min-width="20%"
          />
          <el-table-column
            prop="#"
            label="奖励ACB"
            min-width="15%"
          >
            <template>
              <!-- TODO: add by axiang [20190613] 奖励ACB内容暂时留空 -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

  </div>
</template>

<script>
// import Calendar from 'vue-calendar-component'
import Calendar from 'vue-fullcalendar'
import formatterDate from '../utils/formatterDate'

export default {
  components: {
    Calendar
  },
  data() {
    return {
      username: '',
      tableData: [],
      clockInDateArr: [],
      today: new Date(),
      pagesize: 10,
      currentTotal: 0,
      currentPage: 1
    }
  },
  created() {
    this.username = this.$store.getters.getUsername
    this.getUserAllClockInList()
  },
  // computed(){},
  // mounted: {},
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    // add by axiang [20190613] 获取签到列表
    async getUserAllClockInList() {
      const params = new URLSearchParams()
      params.append('username', this.username)
      params.append('pageNum', 1)
      params.append('pageSize', 40)
      const dataGetClockInList = await this.$http
        .get('/check_in/list', params)
      const dataClockIn = dataGetClockInList.datas[0]
      for (let i = 0; i < dataClockIn.length; i++) {
        const time = dataClockIn[i].checkTime
        const timeStr = formatterDate(time)
        let className = ''
        if (dataClockIn[i].info === '日常签到' || dataClockIn[i].sign === '正常签到') {
          className = 'clockInNormal'
        } else if (dataClockIn[i].info === '迟到') {
          className = 'clockInLate'
        } else {
          className = 'clockInOther'
        }
        this.clockInDateArr.push({
          title: '签到：' + dataClockIn[i].info,
          start: timeStr.split(' ')[0],
          end: timeStr.split(' ')[0],
          cssClass: className
        })
      }
      for (let i = 0; i < dataClockIn.length; i++) {
        const time = dataClockIn[i].checkTime
        const timeStr = formatterDate(time)
        this.tableData.push({
          username: dataClockIn[i].username,
          time: timeStr,
          sign: dataClockIn[i].info,
          ip: dataClockIn[i].ipAddress
        })
      }
    }
  }
}
</script>

<style  scoped>
.clockin-body {
  width: 90%;
  min-height: 600px;
  margin: auto;
}

.calendar-card {
  width: 48%;
  float: left;
  min-height: 400px;
}

.list-box {
  width: 50%;
  float: left;
  margin-left: 15px;
}

.table-row-normal {
  color: green;
  font-weight: bold;
}

.table-row-late {
  color: red;
  font-weight: bold;
}

.table-row-other {
  color: blue;
  font-weight: bold;
}
</style>
