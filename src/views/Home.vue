<template>
  <div class="home">
    <h1>首页</h1>
    <el-button type="primary" @click="$router.push('/about')"
      >跳转到关于页面</el-button
    >
  </div>
</template>

<script setup></script>

<style scoped>
.home {
  padding: 20px;
}
</style>
