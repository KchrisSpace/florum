<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="User" name="first">上新</el-tab-pane>
    <el-tab-pane label="Config" name="second">热卖</el-tab-pane>
    <el-tab-pane label="Role" name="third">推荐</el-tab-pane>
  </el-tabs>

</template>

<script setup>
import { ref } from 'vue';

const activeName = ref('first');

const handleClick = (tab, event) => {
  console.log(tab, event);
};
</script>

<style scoped>
.demo-tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    
    .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}}
</style>