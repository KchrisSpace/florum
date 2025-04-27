<template>
  <div class="salescards">
    <div 
      v-for="product in filteredProducts" 
      :key="product.id" 
      class="product"
      @click="goToProductDetails(product.id)"
    >
      <div class="image-container">
        <img :src="product.images[0]" :alt="product.title" />
      </div>

      <div class="product-info">
        <p>评分：{{ product.sales_data.rating }}</p>
        <p class="title">{{ product.title }}</p>
        <hr></hr>
        <div class="price">
          <span class="current-price">￥{{ product.price_info.current_price }}</span>
          <span v-if="product.price_info.original_price!==product.price_info.current_price" class="original-price">￥{{ product.price_info.original_price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { defineProps, defineEmits } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const props = defineProps(['activeName'])
const emit = defineEmits(['update-count'])

const API_URL = "http://localhost:3000/product_list";
const ProductList = ref([]);

// 计算属性，根据 activeName 过滤商品
const filteredProducts = computed(() => {
  if (props.activeName === '上新') {
    return ProductList.value.filter(product => product.main_category === '上新');
  } else if (props.activeName === '热销') {
    return ProductList.value.filter(product => product.main_category === '热销');
  } else if (props.activeName === '特价') {
    return ProductList.value.filter(product => product.main_category === '特价出售');
  }
  return ProductList.value; // 默认返回所有商品
});

// 监听 filteredProducts 的变化，发送商品数量
watch(filteredProducts, (newVal) => {
  emit('update-count', newVal.length);
});

onMounted(async () => {
  try {
    const response = await axios.get(API_URL); 
    ProductList.value = response.data; 
    console.log("获取的用户数据:", ProductList.value); 
  } catch (err) {
    console.error(err);
  }
});

// 跳转到商品详情页
const goToProductDetails = (productId) => {
  router.push({
    name: 'ProductDetails',
    params: { id: productId }
  });
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑滚动
  });
};
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
box-sizing: border-box;
}
hr{
  margin: 15px 0;
}
.salescards{
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 30px 80px 30px 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.product-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px 0;
}

.image-container {
  width: 100%;
  height: 240px;
  border-radius: 5px;
  overflow: hidden;
}

.product-info {
  text-align: center;
}

.title {
  font-size:1.1rem;
  margin-top: 10px;
  font-weight: 400;
}
.title {
            width: 150px; /* 设置固定宽度 */
            white-space: nowrap; /* 防止换行 */
            overflow: hidden; /* 隐藏超出部分 */
            text-overflow: ellipsis; /* 用省略号表示超出部分 */
        }

.product {
  width: 235px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid #dddddda7;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(242,146,149,0.5);
  border-color: rgba(242, 99, 113, 0.6);
}

.image-container img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */

  text-align: left;
}

.price {
  display: flex;
  align-items: center;
}

.current-price {
  font-size: 1.2em;
  color: #000;
  margin-right: 10px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
}
</style>
