<template>
  <div class="salescards">
    <div v-for="product in ProductList" :key="product.id" class="product">
    <div class="image-container">
      <img src="../assets/flower-product.png"  :alt="product.title" />
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
// 提取 API 地址为常量，便于维护
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

</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
.salescards{
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 80px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
}
.product {
  width: 160px;
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
  gap: 30px;
}
.image-container {
  width: 160px;
  height: 260px;
  overflow: hidden;
  border-radius: 5px;
}
img {
  width:120px ;
  height: 200px;
  height: 100%;
  object-fit: cover;
}
.product-info {
  text-align: center;
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
.title {
  font-size: 18px;
}
hr{
margin-top: 8px;
margin-bottom: 2px;
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

.image-container {
  flex: 1;
}

.image-container img {
  width: 140px;
  height: 180px;
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
