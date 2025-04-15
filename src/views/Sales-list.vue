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
  gap: 10px;
  color: #0a0a0a;

  :deep(.el-tabs__item) {
    font-weight: 700;
    font-size: 18px;
    color: #333;
  }

  :deep(.el-tabs__item:hover) {
    color: #f26371;
  }

  :deep(.el-tabs__item.is-active) {
    color: #f26371;
    font-weight: 800;
  }

  :deep(.el-tabs__active-bar) {
    background-color: #f26371 !important;
    height: 3px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    background-color: #f26371;
  }

  .el-tabs__content {
    padding: 32px;
    color: #95a2b8;
    font-size: 32px;
    font-weight: 600;
  }
}

.list-show {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.product-count {
  text-align: center;
  /* padding: 20px 0; */
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
  width: 100%;
}
</style>
