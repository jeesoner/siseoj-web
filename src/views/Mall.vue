<template>
  <!-- TODO: 没做分页，一页到底，但是后端API做了分页 add by foxfox [20190812]  -->
  <div class="mall-body">
    <div class="carousel-body">
      <el-carousel>
        <el-carousel-item
          v-for="item in 4"
          :key="item"
        >
          <img
            class="picture"
            :src="src"
          >
          <!-- <el-image class="picture"
                    :src="src"
                    :fits="fits"></el-image> -->
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-col
      v-for="item in dataMallInfo"
      :key="item.id"
      :span="4"
      class="main-col"
    >
      <el-card
        class="product-card"
        shadow="hover"
        :body-style="{ padding: '0px' }"
      >
        <div
          class="product-box"
          @click="toProductDetail(item.id)"
        >
          <img
            class="product-image"
            :src="item.pictureUrl.split(';')[0]"
          >
          <div>
            <font size="4">{{ item.name }}</font>
            <br>
            <font
              size="5"
              color="orange"
            >{{ item.cost }}</font>ACB
          </div>
        </div>
      </el-card>
    </el-col>
  </div>

</template>

<script>
export default {
  data() {
    return {
      dataMallInfo: [],
      fits: ['scale-down'],
      src: 'http://thumbs.dreamstime.com/b/%E5%9C%A8%E8%86%9D%E4%B8%8A%E5%9E%8B%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%A8%AA%E5%B9%85%E7%9A%84%E7%BC%96%E7%A8%8B%E7%9A%84-%E7%A0%81-96880909.jpg'
    }
  },
  mounted() {
    this.getMalldata()
  },
  methods: {
    toProductDetail(gid) {
      if (this.$store.getters.getIsLogin) {
        this.$router.push({ path: 'ProductDetail', query: { id: gid }})
      } else {
        this.$notify({
          title: '提示',
          message: '登录后才能查看商城内容',
          type: 'warning',
          offset: 100,
          duration: 3000
        })
      }
    },
    async getMalldata() {
      const params = new URLSearchParams()
      params.append('pageNum', 1)
      // TODO: 暂时设置为100，显示100个商品
      params.append('pageSize', 100)
      const dataMall = await this.$http.get('/mall/list', params)
      if (dataMall.code === 10000) {
        this.dataMallInfo = dataMall.datas[0]
      } else {
        this.$message.warning('没有任何商品')
      }
    }
  }

}
</script>

<style scoped>
.mall-body {
  width: 90%;
  min-height: 800px;
  margin: auto;
  background-color: #fafafa;
}

.main-col {
  margin-left: 85px;
}

.carousel-body {
  margin: auto;
}

.picture {
  height: 250px;
  width: 100%;
  margin: auto;
}

.product-image {
  width: 100%;
  height: 75%;
  display: block;
}

.product-main {
  width: 1400px;
  margin: 0;
}

.product-card {
  cursor: pointer;
  height: 310px;
  margin-bottom: 20px;
}

.product-box {
  width: 100%;
  height: 310px;
}
</style>
