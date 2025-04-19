<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="全部" name="全部"></el-tab-pane>
    <el-tab-pane label="上新" name="上新"></el-tab-pane>
    <el-tab-pane label="热销" name="热销"></el-tab-pane>
    <el-tab-pane label="特价" name="特价"></el-tab-pane>
  </el-tabs>
  <div class="list-show">
    <div class="product-count">共 {{ productCount }} 件商品</div>
    <SalesCard :activeName="activeName" @update-count="updateCount" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElTabPane, ElTabs } from "element-plus";
import SalesCard from "../components/SalesCard.vue";
const activeName = ref("全部"); // 设置默认选中的标签为"全部"
const productCount = ref(0);

const updateCount = (count) => {
  productCount.value = count;
};
</script>

<style scoped>
.demo-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ab4545;
}

.demo-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  font-size: 18px;
  font-family: "微软雅黑";
}

.demo-tabs :deep(.el-tabs__item:hover) {
  color: rgba(242, 99, 113, 1);
}

.demo-tabs :deep(.el-tabs__item.is-active) {
  color: rgb(237, 120, 132);
}
/* 下划线样式 */
.demo-tabs :deep(.el-tabs__active-bar) {
  background-color: rgba(242, 99, 113, 1);
}


.list-show {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 20px 0; */
}

.product-count {
  text-align: center;
  /* padding: 20px 0; */
  margin-bottom: 10px;
  color: #666;
  font-size: 16px;
  width: 100%;
}
</style>
