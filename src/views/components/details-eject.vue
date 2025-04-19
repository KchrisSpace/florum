<template>
  <div class="product-container">
    <div class="product-content">
      <!-- 左侧商品图片 -->
      <div class="product-image">
        <img src="https://www.angelicflower.com.au/wp-content/uploads/2018/10/10%E6%9E%9D%E7%BB%8F%E5%85%B8%E7%8E%AB%E7%91%B0%E9%85%8D%E5%8F%B6%E5%AD%90.jpg" alt="粉红花束" />
      </div>

      <!-- 右侧商品信息 -->
      <div class="product-info">
        <h1 class="product-title">粉红花束 红色</h1>

        <!-- 价格区域 -->
        <div class="price-section">
          <div class="price">
            <span class="current-price">￥49.00</span>
            <span class="original-price">￥65.00</span>
          </div>

          <!-- 评分区域 -->
          <div class="rating">
            <el-rate
              v-model="rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="评论（95）"
            />
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="description">
          <p>
            鲜花是大自然赋予我们的美丽礼物，它们以其千姿百态、绚丽多彩的形态出现在我们的生活中，给我们的生活带来了无穷的美好。玫瑰被誉为"花中之王"，它的美丽与芬芳让人难以忘怀。
          </p>
        </div>

        <!-- 花语 -->
        <div class="flower-language">
          <span class="label">花语：</span>
          <span class="content"
            >红玫瑰代表热情与爱情，粉玫瑰则象征着温馨与浪漫。</span
          >
        </div>

        <!-- 尺寸选择 -->
        <div class="size-selector">
          <div class="label">大小:</div>
          <div class="size-options">
            <el-radio-group v-model="selectedSize">
              <el-radio-button label="S">S</el-radio-button>
              <el-radio-button label="M">M</el-radio-button>
              <el-radio-button label="L">L</el-radio-button>
              <el-radio-button label="XL">XL</el-radio-button>
              <el-radio-button label="XXL">XXL</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <!-- 数量和购物车 -->
        <div class="action-buttons">
          <div class="quantity-selector">
            <el-button @click="decreaseQuantity"
              ><el-icon><Minus /></el-icon
            ></el-button>
            <span class="quantity">{{ quantity }}</span>
            <el-button @click="increaseQuantity"
              ><el-icon><Plus /></el-icon
            ></el-button>
          </div>
          <el-button type="primary" class="add-to-cart">加入购物车</el-button>
          <el-button class="wishlist-btn">
            <el-icon><Star /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailsEject",
  emits: ["close"],
};
</script>

<script setup>
import { ref } from "vue";
import { Plus, Minus, Star } from "@element-plus/icons-vue";

const quantity = ref(1);
const rating = ref(5);
const selectedSize = ref("M");

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
</script>

<style scoped>
.product-container {
  max-width: 100vw;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-content {
  width: 800px;
  display: flex;
  gap: 40px;
}

.product-image {
  flex: 1;
  max-width: 500px;
}

.product-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.product-info {
  flex: 1;
  padding: 20px 0;
}

.product-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.price .current-price {
  font-size: 24px;
  color: #ff4d4f;
  margin-right: 10px;
}

.price .original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.description {
  color: #666;
  line-height: 1.8;
  margin: 20px 0;
  p {
    margin-bottom: 10px;
    text-align: left;
    text-indent: 2em;
  }
}
.flower-language {
  margin: 20px 0;
  text-align: left;
  position: relative;
   
}

.flower-language .label {
  color: #333;
  /* margin-right: 10px; */
}

.flower-language .content {
  color: #666;
}

.size-selector {
  display: flex;
  /* margin: 20px 0; */
  /* text-align: left; */
  position: relative;
  left: 2rem;
  
}

.size-selector .label {
  position: relative;
  margin-right: 15px;
  top: 5px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 4px;
}

.quantity-selector .quantity {
  margin: 0 15px;
  font-size: 16px;
}

.add-to-cart {
  position: relative;
  top: 5px;
  background-color: rgba(242, 99, 113, 1);
  color: white;
  border: none;
}

.wishlist-btn {
   position: relative;
  top: 5px;
  background: #f5f5f5;
  border: none;
}

:deep(.el-radio-button__inner) {
  border-color: #ddd;
  background: white;
  color: #333;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #6c4141;
  border-color: #6c4141;
  box-shadow: -1px 0 0 0 #6c4141;
}
</style>
