<!-- 产品详情页 -->
<template>
  <div class="product-details">
    <div class="back-button" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>
    <details-eject :product-id="productId" />
    <div class="comments-container">
      <comments :product-id="productId" class="comments" />
    </div>
  </div>
</template>

<script setup>
import DetailsEject from "./components/details-eject.vue";
import Comments from "../components/comments/comments.vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

// 返回上一页
const goBack = () => {
  router.back();
};

// 添加错误处理
if (!productId) {
  console.error("商品ID不存在");
  // 可以添加重定向到首页或其他处理
}
</script>

<style scoped>
.product-details {
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
}

.back-button {
  position: relative;
  right: 30rem;
  top: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
  margin-bottom: 20px;
  margin-left: 20px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #e0e0e0;
  transform: translateX(-3px);
}

.back-button .el-icon {
  font-size: 16px;
}

.back-button span {
  font-size: 14px;
}

.comments-container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  left: 120px;
}

.comments {
  position: relative;
  top: 20px;
}
</style>
