<!--  -->
<template>
 
    <div class="cart-item">
      <hr />
      <button class="remove-btn" @click="removeItem">X</button>
      <img
        class="item-image"
        src="https://via.placeholder.com/150"
        alt="Item Image"
      />
      <div class="item-info">
        <span class="item-name">玫瑰玫瑰玫瑰</span>
        <span class="item-price">¥149</span>
        <div class="counter">
          <button @click="decrement">-</button>
          <span class="count-input"><input type="number" v-model="count" /></span>
          <button @click="increment">+</button>
        </div>
      </div>
      <p class="total-price">¥149</p>
    </div>
  
</template>

<script setup>
import { ref } from "vue";

const count = ref(1);

const increment = () => {
  count.value++;
};

const decrement = () => {
  if (count.value > 1) {
    count.value--;
  }
};

const removeItem = () => {
  // Remove item from cart
};
</script>


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
  flex: 1;
  
  display: flex;
  justify-content: space-evenly;
 
 
}

.counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    button{
        width: 30px;
        height: 30px;
        border: 1px solid #ccc;
    }
  
    input{
        width: 60px;
        text-align: center;
    }
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



</style>
