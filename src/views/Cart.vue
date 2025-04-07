<!--  -->
<template>
  <header2></header2>
  <div class="cart">
    <div class="title">
      <br />
      <h1>购物车</h1>
      <h2>my cart</h2>
      <br />
    </div>
    <div class="cart-container">
      <hr />
      <Cart></Cart>
      <Cart></Cart>
    </div>
    <!-- 合计付款 -->
    <div class="checkout-area">
      <p class="total">
        订单总计：<i>￥{{ total }}</i>
      </p>
      <button class="pay-button" @click="handlePay">立即支付</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Header2 from "../components/header2.vue";
import Cart from "../components/Cart.vue";
import { useRouter } from "vue-router";

const total = ref(100);
const router = useRouter();
const handlePay = () => {
  router.push("/payment");
  console.log("处理支付...");
};
</script>

<style scoped>
* {
  box-sizing: border-box; /* 确保padding和border包含在宽度内 */
}

.cart {
  width: 100vw;
  background-color: #ffffff;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动 */
}
.cart-container {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  border-radius: 10px;
}
.checkout-area {
  position: fixed;

  right: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
