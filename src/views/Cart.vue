<!--  -->
<template>
  <Header2 title="购物车" subtext="cart" />
  <div class="cart">
    <div class="cart-container">
      <hr />
      <CartItem
        v-for="item in cartStore.cartItems"
        :key="item.id"
        :item="item"
        @update-total="cartStore.updateItemTotal"
        @item-removed="cartStore.removeItem"
      />
    </div>
    <!-- 合计付款 -->
    <div class="checkout-area">
      <p class="total">
        订单总计：<i>￥{{ cartStore.total }}</i>
      </p>
      <button class="pay-button" @click="handlePay">立即支付</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import Header2 from "../components/header2.vue";
import CartItem from "../components/CartItem.vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";

const router = useRouter();
const cartStore = useCartStore();

const handlePay = () => {
  if (cartStore.cartItems.length === 0) {
    alert("购物车为空，请先添加商品");
    return;
  }
  router.push("/payment");
};

onMounted(async () => {
  console.log("Cart view mounted");
  await cartStore.fetchCartData();
  // 初始化每个商品的总价
  cartStore.cartItems.forEach((item) => {
    const itemTotal = item.quantity * item.product.price_info.current_price;
    cartStore.updateItemTotal({ id: item.id, total: itemTotal });
  });
});
</script>

<style scoped>
* {
  box-sizing: border-box; /* 确保padding和border包含在宽度内 */
}

.cart {
  width: 100vw;
  position: relative;
}
.cart-container {
  width: 80%;
  height: 45vh;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  border-radius: 10px;
  max-height: calc(100vh-60vh); /* 设置最大高度，减去头部和其他元素的高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

/* 自定义滚动条样式 */
.cart-container::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.cart-container::-webkit-scrollbar-track {
  background: #fdfdfd; /* 滚动条轨道颜色 */
  border: 1px solid #e9bfbf;
  border-radius: 4px;
}

.cart-container::-webkit-scrollbar-thumb {
  background: #ff6b6b3a; /* 滚动条滑块颜色 */
  border-radius: 4px;
}

.cart-container::-webkit-scrollbar-thumb:hover {
  background: #ff6b6b; /* 滚动条滑块悬停颜色 */
}

.checkout-area {
  position: fixed;
  right: 150px;
  display: flex;
  flex-direction: column;
  /* gap: 10px; */
}
.total {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}
.total i {
  color: #ff6b6b;
  font-style: normal;
  margin: 0 5px;
}
.pay-button {
  margin-top: 40px;
  padding: 10px 30px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  /* border-radius: 5px; */
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.pay-button:hover {
  background-color: #ff5252;
}
</style>
