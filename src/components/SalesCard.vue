<template>
<div class="intotal"> 共{{ filteredProducts.length }}件商品</div>
  <div class="salescards">
    
    <div v-for="product in filteredProducts" :key="product.id" class="product">
    <div class="image-container">
      <img :src="product.images.thumbnail" :alt="product.title" />
    </div>

    <div class="product-info" >
      <p>评分：{{ product.sales_data.rating }}</p>
      <p class="title">{{ product.title }}</p>
      <hr></hr>
      <div class="price">
        <span class="current-price">￥{{ product.price_info.current_price }}</span>
        <span class="original-price">￥{{ product.price_info.original_price }}</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { defineProps } from 'vue'
import { computed } from 'vue'
// 提取 API 地址为常量，便于维护
const props = defineProps(['activeName'])

const API_URL = "http://localhost:3001/product_list";
const ProductList = ref([]);
onMounted(async () => {
  try {
    const response = await axios.get(API_URL); 
    ProductList.value = response.data; 
  
    console.log("获取的用户数据:", ProductList.value); 
  } catch (err) {
    console.error(err);
  }
});
// 计算属性，根据 activeName 过滤商品
const filteredProducts = computed(() => {
  if (props.activeName === '上新') {
    return ProductList.value.filter(product => product.main_category === '上新');
  } else if (props.activeName === '热销') {
    return ProductList.value.filter(product => product.main_category === '热销');
  } else if (props.activeName === '特价') {
    return ProductList.value.filter(product => product.main_category === '特价');
  }
  return ProductList.value; // 默认返回所有商品
});
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
box-sizing: border-box;
}
.salescards{
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}
.product {
  width: 200px;
  height: 360px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.product-info {

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

}
.image-container {
 
  width: 100%;
  height: 360px;
 
 
  /* 居中 */

  border-radius: 5px;
}
/* img {
  object-fit: cover;
  overflow: hidden;
} */
.product-info {
  text-align: center;
}
.product {
  width: 180px;
  height: 290px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
.title {
  font-size:1.1rem;
}
.title {
            width: 150px; /* 设置固定宽度 */
            white-space: nowrap; /* 防止换行 */
            overflow: hidden; /* 隐藏超出部分 */
            text-overflow: ellipsis; /* 用省略号表示超出部分 */
        }

.product {
  width: 160px;
  height: 290px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
 
}

/* .image-container {
  flex: 1;
} */

.image-container img {
  width: 100%;
  height: 190px;
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
