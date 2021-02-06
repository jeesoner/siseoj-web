<template>
  <div class="index-body">
    <div class="header-announcement">
      <Carousel />
    </div>
    <div class="home-info-body">
      <HomeLeft />
    </div>
    <div class="border-body">
      <HomeRight />
    </div>
  </div>
</template>

<script>
import Carousel from './CarouselGraph'
import HomeRight from './HomeRight'
import HomeLeft from './HomeLeft'

export default {
  components: {
    Carousel,
    HomeRight,
    HomeLeft
  }

}
</script>

<style>
.index-body {
  width: 80%;
  margin: auto;
  min-height: 800px;
}

.header-announcement {
  width: 100%;
  margin: auto;
  margin-bottom: 20px;
}

.home-info-body {
  float: left;
  margin-bottom: 10px;
  width: 70%;
}

.border-body {
  float: right;
  width: 28%;
  margin-left: 10px;
  min-height: 400px;
}
</style>
