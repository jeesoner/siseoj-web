<template>
  <div class="problem-body">
    <el-card class="box-card">
      <div slot="header">题库</div>
      <LocalProblemComponent />
    </el-card>
  </div>
</template>

<script>
import LocalProblemComponent from './LocalProblemComponent'

export default {
  components: {
    LocalProblemComponent
  },
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
  }

}
</script>

<style scoped>
.problem-body {
  width: 100%;
  min-height: 700px;
  padding-top: 0;
  margin: 0;
  margin-bottom: 20px;
}

.box-card {
  width: 80%;
  height: 100%;
  min-height: 500px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}
</style>
