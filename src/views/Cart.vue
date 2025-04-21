<!--  -->
<template>
  <Header2 title="购物车" subtext="cart" />
  <div class="cart">
    <div class="cart-container">
      <hr />
      <CartItem
        v-for="item in cartItems"
        :key="item.id"
        :item="item"
        @update-total="handleTotalUpdate"
      />
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import Header2 from "../components/header2.vue";
import CartItem from "../components/CartItem.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const cartItems = ref([]);
const itemTotals = ref({}); // 存储每个商品的总价

// 计算总价
const total = computed(() => {
  // 确保所有商品的总价都被计算
  const sum = cartItems.value.reduce((acc, item) => {
    const itemTotal = itemTotals.value[item.id] || 0;
    return acc + itemTotal;
  }, 0);
  return sum.toFixed(2);
});

const handleTotalUpdate = ({ id, total }) => {
  itemTotals.value[id] = total;
  console.log("当前商品总价:", { id, total });
  console.log("所有商品总价:", itemTotals.value);
};

const handlePay = () => {
  if (cartItems.value.length === 0) {
    alert("购物车为空，请先添加商品");
    return;
  }
  router.push("/payment");
};

onMounted(() => {
  console.log("Cart view mounted");
  axios.get("http://localhost:3000/cart").then((res) => {
    cartItems.value = res.data;
    // 初始化每个商品的总价为0
    res.data.forEach((item) => {
      itemTotals.value[item.id] = 0;
    });
    console.log("购物车数据:", cartItems.value);
  });
});

onUnmounted(() => {
  console.log("Cart view unmounted");
  cartItems.value = [];
  itemTotals.value = {};
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
