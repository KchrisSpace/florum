<template>
  <div class="cart-item">
    <hr />
    <button class="remove-btn" @click="removeItem">X</button>
    <img
      class="item-image"
      :src="product.image || 'https://via.placeholder.com/150'"
      :alt="product.name"
    />
    <div class="item-info">
      <span class="item-name">{{ product.name }}</span>
      <span class="item-price">¥{{ product.price }}</span>
      <span class="item-status">{{ product.status }}</span>
    </div>
    <button class="add-to-cart-btn" @click="addToCart">加入购物车</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useWishlistStore } from "../stores/wishlist.js";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["remove-item"]);
const wishlistStore = useWishlistStore();

const removeItem = () => {
  emit("remove-item", props.product.id);
};

const addToCart = async () => {
  await wishlistStore.addToCart(props.product.id);
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
