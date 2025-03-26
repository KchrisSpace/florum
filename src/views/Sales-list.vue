<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="全部" name="全部"></el-tab-pane>
    <el-tab-pane label="上新" name="上新"></el-tab-pane>
    <el-tab-pane label="热销" name="热销"></el-tab-pane>
    <el-tab-pane label="特价" name="特价"></el-tab-pane>
  </el-tabs>
<div class="list-show">
  <SalesCard  :activeName="activeName" />
</div>

</template>

<script setup>
import { ref } from "vue";
import { ElTabPane, ElTabs } from "element-plus";
import SalesCard from "../components/SalesCard.vue";
const activeName = ref("全部"); // 设置默认选中的标签为“全部”

const handleClick = (tab) => {
  console.log(tab);
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
  }
}
</style>
