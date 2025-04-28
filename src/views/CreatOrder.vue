<!-- 
  支付页面  
   -->
<template>
  <Header2 title="创建订单" subtext="create-order" />
  <div class="payment-container">
    <div class="payment-left">
      <div class="order-items">
        <h3>当前订单商品</h3>
        <div class="items-list">
          <div
            v-for="item in cartStore.cartItems"
            :key="item.id"
            class="order-item"
          >
            <img
              :src="item.product?.images[0]"
              :alt="item.product?.title"
              class="item-image"
            />
            <div class="item-info">
              <div class="item-name-price">
                <p class="item-name">{{ item.product?.title }}</p>
                <p class="item-price">
                  ¥{{ item.product?.price_info?.current_price }}
                </p>
              </div>
              <p class="item-quantity">x{{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div class="order-summary">
          <div class="summary-item">
            <span>商品总价</span>
            <span>¥{{ totalPrice }}</span>
          </div>
          <div class="summary-item">
            <span>运费</span>
            <span>¥{{ shippingFee }}</span>
          </div>
          <div class="summary-item total">
            <span>应付金额</span>
            <span class="final-price">¥{{ finalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="payment-right">
      <div class="payment-info">
        <h3>支付信息</h3>
        <div class="delivery-info">
          <h4>收货信息</h4>
          <div class="address-card" v-if="address">
            <p class="receiver">收货人：{{ address.consignee }}</p>
            <p class="phone">电话：{{ address.phone }}</p>
            <p class="address">
              地址：{{ address.region.join(" ") }} {{ address.detail }}
            </p>
          </div>
          <div v-else class="no-address">
            <p>请先添加收货地址</p>
          </div>
        </div>
        <div class="delivery-time">
          <h4>配送时间</h4>
          <div class="date-picker">
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="选择日期"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
          <div class="time-slots">
            <div
              v-for="slot in timeSlots"
              :key="slot.value"
              class="time-slot"
              :class="{ active: selectedTime === slot.value }"
              @click="selectedTime = slot.value"
            >
              {{ slot.label }}
            </div>
          </div>
        </div>
        <div class="payment-methods">
          <h4>支付方式</h4>
          <p>仅支持货到付款</p>
        </div>
      </div>
      <div class="create-order">
        <button class="pay-button" @click="createOrder">创建订单</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Header2 from "../components/Header2.vue";
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElDatePicker } from "element-plus";

const cartStore = useCartStore();
const router = useRouter();
const cartItems = ref([]);
const address = ref(null);
const selectedMethod = ref("wechat");
const selectedDate = ref("");
const selectedTime = ref("");

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
};

const timeSlots = [
  { label: "09:00-12:00", value: "morning" },
  { label: "14:00-18:00", value: "afternoon" },
  { label: "18:00-21:00", value: "evening" },
];

// 获取地址数据
const fetchAddress = async () => {
  try {
    const response = await axios.get("http://localhost:3000/addresses");
    // 获取默认地址或第一个地址
    address.value =
      response.data.find((addr) => addr.is_default) || response.data[0];
  } catch (error) {
    console.error("获取地址失败:", error);
  }
};

// 计算总价
const totalPrice = computed(() => {
  return cartStore.cartItems
    .reduce((total, item) => {
      return (
        total + (item.product?.price_info?.current_price || 0) * item.quantity
      );
    }, 0)
    .toFixed(2);
});

// 运费
const shippingFee = ref(0);

// 最终价格
const finalPrice = computed(() => {
  return (parseFloat(totalPrice.value) + shippingFee.value).toFixed(2);
});

// 创建订单
const createOrder = async () => {
  try {
    if (!address.value) {
      alert("请先选择收货地址");
      return;
    }

    if (!selectedDate.value || !selectedTime.value) {
      alert("请选择配送日期和时间");
      return;
    }

    // 创建订单数据
    const orderData = {
      items: cartStore.cartItems,
      address: address.value,
      delivery_date: selectedDate.value,
      delivery_time: selectedTime.value,
      total_price: finalPrice.value,
      shipping_fee: shippingFee.value,
      payment_method: selectedMethod.value,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // 发送创建订单请求
    const response = await axios.post(
      "http://localhost:3000/product_orders",
      orderData
    );
    console.log("订单创建成功:", response.data);

    // 清空购物车
    cartStore.clearCart();

    // 跳转到订单成功页面
    router.push("/payment/success");
  } catch (error) {
    console.error("创建订单失败:", error);
    alert("创建订单失败，请重试");
  }
};

onMounted(async () => {
  // 获取购物车数据
  await cartStore.fetchCartData();
  cartItems.value = [...cartStore.cartItems];

  // 获取地址数据
  await fetchAddress();
});
</script>

<style scoped>
.payment-container {
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 1rem;
}

.payment-left {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.payment-right {
  flex: 2;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.payment-info h3 {
  text-align: center;
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
}

.delivery-info h4 {
  text-align: left;
  margin-left: 0;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.items-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
  display: flex;

  justify-content: space-between;
}

.item-name-price {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem;
}

.item-name {
  font-size: 1rem;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  color: #ff6b6b;
  font-weight: 500;
  margin: 0;
}

.item-quantity {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.order-summary {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  position: sticky;
  bottom: 0;
  background: white;
  margin-top: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
}

.summary-item.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-weight: 600;
  color: #333;
}

.final-price {
  color: #ff6b6b;
  font-size: 1.2rem;
}

.delivery-info {
  margin-bottom: 1rem;
}

.address-card {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.address-card p {
  margin: 0;
  color: #666;
}

.no-address {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

.pay-button {
  width: 100%;
  padding: 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.pay-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.payment-methods {
  margin-bottom: 1rem;
}

.payment-methods h4 {
  text-align: left;
  margin-left: 0;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.payment-methods p {
  color: #666;
  margin: 0;
}

.delivery-time {
  margin-bottom: 1rem;
}

.delivery-time h4 {
  text-align: left;
  margin-left: 0;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.date-picker {
  margin-bottom: 1rem;
}

.time-slots {
  display: flex;
  gap: 0.5rem;
}

.time-slot {
  flex: 1;
  padding: 0.8rem;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.time-slot:hover {
  background: #f0f0f0;
}

.time-slot.active {
  background: #ff6b6b;
  color: white;
}

@media (max-width: 768px) {
  .payment-container {
    flex-direction: column;
  }

  .payment-left,
  .payment-right {
    width: 100%;
  }
}
</style>
