<template>
  <div class="main-body">
    <div class="head">
      <div class="head-content">
        <p>
          <a
            href="javascript:;"
            v="Mall"
          >商城</a>
        </p>
        <span class="pointer">
          <i class="el-icon-arrow-right" />
          {{ dataMallInfo.name }}
        </span>
      </div>
      <el-divider />
    </div>
    <div class="product">
      <div class="show-img">
        <div
          class="img-box"
          @mouseenter="showArrow"
          @mouseleave="hideArrow"
        >
          <img
            ref="showImg"
            class="img-product"
            :src="dataMallInfo.pictureUrl.split(';')[0]"
          >
          <span
            ref="arrowLeft"
            class="arrow-left"
          >
            <i class="el-icon-arrow-left" />
          </span>
          <span
            ref="arrowRight"
            class="arrow-right"
          >
            <i class="el-icon-arrow-right" />
          </span>
        </div>
        <div class="img-nav">
          <ul class="img">
            <li
              v-for="item in dataMallInfo.pictureUrl.split(';')"
              :key="item"
            >
              <img :src="item">
            </li>
          </ul>
        </div>
      </div>
      <div class="show-info">
        <div class="basic-info">
          <h2 class="product-name">{{ dataMallInfo.name }}</h2>
          <p class="product-description">学习新的技术走上人生巅峰！</p>
          <p class="product-price">{{ dataMallInfo.cost }} ACB</p>
        </div>
        <div class="product-number">
          <p>数量：</p>
          <div class="num-counter">
            <a
              href="javascript:;"
              class="decrease-btn"
              @click="decreaseNumber"
            >
              <i class="el-icon-minus" />
            </a>
            <span class="product-number">
              <input
                v-model="num"
                type="text"
                value="1"
                class="input-number"
                :min="1"
                :max="dataMallInfo.buyLimit"
                @change="handleChange"
              >
            </span>
            <a
              href="javascript:;"
              class="plus-btn"
              @click="plusNumber"
            >
              <i class="el-icon-plus" />
            </a>
          </div>
        </div>
        <div class="buy-service">
          <p>服务：</p>
          <ul class="show-service">
            <li class="service-content">7天无理由退货</li>
            <li class="service-content">包邮</li>
          </ul>
        </div>
        <div class="buy-operation">
          <a
            class="buy-btn"
            href="javascript:;"
            @click="purchase"
          >立即购买</a>
          <a
            class="shopcart-btn"
            href="javascript:;"
            @click="intoShopcart"
          >
            <i class="el-icon-shopping-cart-full" />
            加入购物车
          </a>
        </div>
      </div>
      <div class="show-detail">
        <h2>商品详情</h2>
        <el-divider />
        <div
          class="product-detail"
          v-html="dataMallInfo.description"
        />
      </div>
    </div>
    <div
      ref="scrollSide"
      class="scroll-side"
    >
      <div class="scroll-item">
        <span>100%<br>正品</span>
      </div>
      <div class="scroll-item">
        <span>七天无理由退货</span>
      </div>
      <div
        class="scroll-item cart"
        @click="showShopcart"
      >
        <span>
          <i class="el-icon-shopping-cart-full" />
          <span class="car">购物车
            <span class="shopcart-num">{{ shopcartNum }}</span>
          </span>
        </span>
      </div>
      <div class="scroll-item kefu">
        <i class="el-icon-s-custom" />
        <span>客服</span>
      </div>
    </div>
    <div
      ref="shopcart"
      class="shopcart"
      @mouseleave="hideShopcart"
    >
      <p class="shopcart-title">购物车</p>
      <ul class="shopcart-list">
        <li class="item-info">
          <div class="item-img">
            <img :src="dataMallInfo.pictureUrl">
          </div>
          <a class="item-name">{{ dataMallInfo.name }}</a>
          <p class="item-price">{{ dataMallInfo.cost }} ACB</p>
          <div class="item-num num-counter">
            <a
              href="javascript:;"
              class="decrease-btn"
              @click="shopcartDecreaseNumber"
            >
              <i class="el-icon-minus" />
            </a>
            <span class="product-number">
              <input
                v-model="shopcartNum"
                type="text"
                value="1"
                class="input-number"
                :min="1"
                :max="dataMallInfo.buyLimit"
                @change="handleChange"
              >
            </span>
            <a
              href="javascript:;"
              class="plus-btn"
              @click="shopcartPlusNumber"
            >
              <i class="el-icon-plus" />
            </a>
          </div>
        </li>
      </ul>
      <div class="settelment">
        <span class="shopcart-number">
          <p class="number-title">共： </p>
          <p class="total-number">{{ shopcartNum }}</p>
          <p class="unit-title"> 件</p>
        </span>
        <span class="shopcart-price">
          <p class="price-title">合计： </p>
          <p class="total-price">{{ dataMallInfo.cost }} ACB</p>
        </span>
        <a
          class="settle-btn"
          href="javascript:;"
          @click="purchase"
        >立即结算</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataMallInfo: '',
      shopcartInfo: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      fits: ['none'],
      num: 1,
      shopcartNum: 1,
      shopcartPrice: 0
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    purchase() {
      this.$confirm('是否购买?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.buy()
      }).catch(() => {

      })
    },
    onSubmit() {
      // console.log('submit!')
    },
    handleChange(value) {
      // console.log(value)
    },
    plusNumber() {
      if (this.num <= this.dataMallInfo.buyLimit) {
        this.num++
      }
    },
    decreaseNumber() {
      if (this.num > 1) {
        this.num--
      }
    },
    shopcartPlusNumber() {
      if (this.shopcartNum < this.dataMallInfo.buyLimit) {
        this.shopcartNum++
        this.shopcartPrice += this.dataMallInfo.acb
      }
    },
    shopcartDecreaseNumber() {
      if (this.shopcartNum > 1) {
        this.shopcartNum--
        this.shopcartPrice -= this.dataMallInfo.acb
      }
    },
    showShopcart() {
      this.$refs.shopcart.style.opacity = '0.8'
      this.$refs.scrollSide.style.opacity = '0'
    },
    hideShopcart() {
      this.$refs.shopcart.style.opacity = '0'
      this.$refs.scrollSide.style.opacity = '1'
    },
    showArrow() {
      this.$refs.arrowRight.style.opacity = '1'
      this.$refs.arrowLeft.style.opacity = '1'
    },
    hideArrow() {
      this.$refs.arrowRight.style.opacity = '0'
      this.$refs.arrowLeft.style.opacity = '0'
    },
    async getdata() {
      const params = new URLSearchParams()
      params.append('id', this.$route.query.id)
      const dataMall = await this.$http.get('/mall/info', params).catch(() => {
        this.$message({ message: '服务器繁忙，请稍后再试！', type: 'error' })
      })
      this.dataMallInfo = dataMall.datas[0]
      this.url = dataMall.datas[0].url
      console.log(dataMall)
    },
    async intoShopcart() {
      if (this.shopcartNum + this.num < this.dataMallInfo.buyLimit) {
        this.shopcartNum += this.num
        this.shopcartPrice += this.num * this.dataMallInfo.acb
      }
    },
    async buy() {
      const username = this.$store.getters.getUsername
      const id = this.dataMallInfo.id
      const number = this.num
      const params = new URLSearchParams()
      params.append('buyNum', number)
      params.append('goodsId', id)
      params.append('username', username)
      const dataOrdel = await this.$http.post('/order/createOrder', params)
        .catch(() => {
          this.$message({ message: '服务器繁忙，请稍后再试！', type: 'error' })
        })
      if (dataOrdel.code === 100) {
        this.$message({
          type: 'success',
          message: dataOrdel.msg
        })
      }
      if (dataOrdel.code === 200) {
        this.$message({
          type: 'error',
          message: dataOrdel.msg
        })
      }
    }
  }
}
</script>

<style scoped>
.main-body {
  padding: 30px;
  width: 1000px;
  margin: 0 auto;
}
.head-content {
  font-size: 18px;
  font-weight: 600;
  text-align: left;
}
.head-content a {
  font-size: 20px;
  text-decoration: none;
  color: #333;
}
.pointer {
  font-size: 16px;
  color: #999;
}
.head-content p {
  display: inline;
}
.product {
  margin-top: 10px;
}
.show-img {
  margin-top: 20px;
}
.img-box,
.show-img,
.img-box img {
  width: 350px;
  height: 350px;
  float: left;
}
.img-nav li:hover {
  border: 2px solid #409eff;
}
.arrow-left i,
.arrow-right i {
  position: relative;
  top: -180px;
  border-radius: 50%;
  cursor: pointer;
  background: rgba(232, 232, 232, 0.5);
  padding: 15px;
}
.arrow-left {
  position: relative;
  left: -110px;
  transition: opacity 0.5s;
  opacity: 0;
}
.arrow-right {
  position: relative;
  right: -110px;
  transition: opacity 0.5s;
  opacity: 0;
}
.img-nav {
  position: relative;
  float: left;
  width: 400px;
  height: 80px;
  margin-top: 10px;
  overflow: hidden;
}
.img-nav li {
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  float: left;
  margin-right: 10px;
  background: #f9f9f9;
  list-style: none;
}
.img-nav li img {
  width: 75px;
  height: 75px;
  cursor: pointer;
}
.show-info {
  margin-top: 10px;
  float: left;
  margin-left: 150px;
  margin-top: 30px;
  width: 500px;
  height: 500px;
}
.buy-service {
  text-align: left;
}
.product-number .num-counter {
  margin-left: 60px;
}
.buy-service .show-service {
  margin-left: 70px;
}
.product-name,
.product-price {
  font-size: 24px;
  font-weight: normal;
}
.product-description {
  font-size: 14px;
  margin-top: 12px;
  color: #999;
}
.product-price {
  margin: 30px 0;
  color: #409eff;
}
.basic-info {
  text-align: left;
}
.num-counter {
  position: relative;
  border: 1px solid #dcdfe6;
  border-left: none;
  width: 162px;
  height: 30px;
}
.plus-btn {
  border-left: 1px solid #dcdfe6;
  border-right: none;
  left: 130px;
}
.decrease-btn {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  right: 130px;
}
.plus-btn,
.decrease-btn {
  position: absolute;
  float: left;
  border-radius: 2px;
  z-index: 1;
  width: 30px;
  height: 30px;
  background: #f5f7fa;
  color: #606266;
  cursor: pointer;
  line-height: 30px;
}
.num-counter a:active {
  border: 1px solid #409eff;
}
.input-number {
  position: relative;
  width: 96px;
  height: 30px;
  border: none;
  line-height: 30px;
  text-align: center;
}
.product-number p,
.buy-service p {
  font-size: 12px;
  color: #999;
  position: absolute;
  height: 30px;
}
.buy-service {
  position: relative;
  margin-top: 20px;
}
.show-service {
  display: inline;
}
.service-content {
  display: inline-block;
  position: relative;
  margin-right: 28px;
  color: #666;
  font-size: 12px;
}
.service-content::before {
  content: '';
  position: absolute;
  top: 8px;
  left: -8px;
  width: 3px;
  height: 3px;
  border-radius: 100%;
  background-color: #409eff;
}
.buy-operation {
  display: flex;
  direction: row;
}
.buy-operation .buy-btn,
.buy-operation .shopcart-btn {
  display: block;
  margin-top: 30px;
  width: 150px;
  height: 50px;
  background-color: #409eff;
  border-radius: 4px;
  font-size: 18px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  line-height: 50px;
}
.buy-operation .shopcart-btn {
  margin-left: 10px;
}
.buy-operation .shopcart-btn i {
  position: relative;
  top: 6px;
  font-size: 28px;
}
.show-detail {
  width: 1000px;
  float: left;
}
.show-detail h2 {
  font-size: 24px;
  font-weight: 600;
  text-align: left;
}
.scroll-side {
  display: block;
  position: fixed;
  left: 50%;
  margin-left: 480px;
  z-index: 98;
  top: 50%;
  margin-top: -180px;
  width: 60px;
  height: auto;
  font-size: 12px;
  border-radius: 10px;
  background: rgba(232, 232, 232, 0.3);
  text-align: center;
  transition: opacity 0.2s;
  opacity: 1;
}
.scroll-item {
  display: block;
  margin-top: 13px;
  line-height: 1.5;
  color: #666666;
  height: 58px;
  border: 1px solid transparent;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
}
.scroll-item i {
  display: block;
  width: 20px;
  height: 20px;
  font-size: 30px;
  margin: 8px 0 10px 11px;
}
.scroll-item .shopcart-num {
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  top: -50px;
  left: 35px;
  background: #409eff;
  font-size: 15px;
  border-radius: 20px;
  color: white;
}
.shopcart {
  position: absolute;
  transition: 0.2s;
  top: 70px;
  right: 0px;
  width: 250px;
  height: 580px;
  border-radius: 10px;
  padding: 20px;
  background: #eeeeee;
  transition: opacity 0.5s;
  opacity: 0;
}
.shopcart .shopcart-title {
  text-align: left;
  line-height: 50px;
  font-size: 20px;
  margin-left: 10px;
  border-bottom: 1px solid #d1d1d1;
}
.shopcart .item-info {
  margin-left: 5px;
  height: 60px;
  width: 250px;
  padding: 5px;
  border-bottom: 1px solid #d1d1d1;
}
.shopcart .item-info .item-img {
  position: relative;
  display: inline;
  width: auto;
  height: 60px;
  float: left;
}
.shopcart .item-info .item-img img {
  width: auto;
  height: 60px;
}
.shopcart .item-info .item-name {
  position: relative;
  display: inline-block;
  width: 160px;
  height: 50px;
  font-size: 14px;
  text-align: left;
  line-height: 30px;
  float: left;
  left: 20px;
}
.shopcart .item-info .item-price {
  position: relative;
  right: -20px;
  margin-top: 2px;
  font-size: 15px;
  width: 20px;
  float: left;
  top: -12px;
  color: #409eff;
}
.shopcart .num-counter {
  display: inline-block;
  width: 100px;
  float: right;
  top: -15px;
  border: none;
}
.shopcart .num-counter .input-number {
  width: 40px;
  height: 25px;
}
.shopcart .num-counter .plus-btn {
  width: 25px;
  height: 25px;
  left: 70px;
}
.shopcart .num-counter .decrease-btn {
  width: 25px;
  height: 25px;
  right: 70px;
}
.shopcart .settelment {
  position: relative;
  display: block;
  top: 380px;
  width: 250px;
  height: 50px;
}
.shopcart .settelment .price-title {
  position: absolute;
  float: left;
  top: 60px;
}
.shopcart .settelment .total-price {
  position: absolute;
  top: 65px;
  left: 50px;
  font-size: 15px;
  color: #409eff;
}
.shopcart .settelment .number-title {
  position: absolute;
  font-size: 15px;
  top: 40px;
  font-size: 15px;
}
.shopcart .settelment .unit-title {
  position: absolute;
  top: 41px;
  left: 50px;
  font-size: 15px;
}
.shopcart .settelment .total-number {
  position: absolute;
  font-size: 15px;
  color: #409eff;
  top: 43px;
  left: 30px;
  font-size: 15px;
}
.shopcart .settle-btn {
  position: absolute;
  display: block;
  margin-top: 30px;
  width: 100px;
  height: 40px;
  background-color: #409eff;
  border-radius: 4px;
  font-size: 15px;
  color: #fff;
  float: right;
  right: -10px;
  top: 20px;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
}
body,
p,
h2,
input,
span,
div,
i,
a,
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
