<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="上新" name="first"></el-tab-pane>
    <el-tab-pane label="热卖" name="second"></el-tab-pane>
    <el-tab-pane label="推荐" name="third"></el-tab-pane>
  </el-tabs>
<div class="list-show">
  <SalesCard/>
</div>

</template>

<script setup>
import { ref } from "vue";
import { ElTabPane, ElTabs } from "element-plus";
import SalesCard from "../components/SalesCard.vue";



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
  }
}
</style>
