<template>
  
  <div class="cart-item">
    <hr>
    <button class="remove-btn" @click="removeItem">X</button>
    <img
      class="item-image"
      src="https://via.placeholder.com/150"
      alt="Item Image"
    />
    <div class="item-info">
      <span class="item-name">玫瑰玫瑰玫瑰</span>
      <span class="item-price">¥149</span>
      <span class="item-status">现售</span>
    </div>
    <button class="add-to-cart-btn">加入购物车</button>
  </div>
</template>

<script setup></script>

<style scoped>
.cart-item {
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 50px;
}

.item-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.item-info {
  display: flex;
justify-content: space-evenly;
  flex-grow: 1;
  /* border: 1px solid #000; */
 
 
}

.item-name {
  display: block;
  font-size: 16px;
}

.item-price {
  display: block;
  color: #888;
  margin-top: 5px;
}

.item-status {
  display: block;
  color: #888;
  margin-top: 5px;
}

.add-to-cart-btn {
  background-color: #ff5a5f;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;

}
</style>
