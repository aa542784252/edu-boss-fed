<template>
  <el-container>
    <el-aside width="200px">
      <app-aside></app-aside>
    </el-aside>
    <el-container>
        <el-header>
          <app-header></app-header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang = 'scss' scoped>
  .el-container {
    height: 100vh;
  }
</style>
