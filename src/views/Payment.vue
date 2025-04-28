<!-- 
  支付页面  
   -->
<template>
  <Header2 title="支付" subtext="payment" />
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
          <div class="address-card">
            <p class="receiver">收货人：{{ address?.receiver }}</p>
            <p class="phone">电话：{{ address?.phone }}</p>
            <p class="address">地址：{{ address?.fullAddress }}</p>
          </div>
        </div>
        <div class="payment-methods">
          <h4>扫码支付</h4>
          <div class="qr-code">
            <img src="../assets/images/qr-code.png" alt="二维码" />
          </div>
        </div>
        <button class="pay-button" @click="handlePayment">货到付款</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Header2 from "../components/Header2.vue";
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

// 模拟地址数据
const address = ref({
  receiver: "张三",
  phone: "13800138000",
  fullAddress: "广东省深圳市南山区科技园",
});

const selectedMethod = ref("wechat");

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

// 处理支付
const handlePayment = async () => {
  try {
    // 这里添加支付逻辑
    console.log("开始支付", {
      method: selectedMethod.value,
      amount: finalPrice.value,
    });

    // 支付成功后跳转
    router.push("/payment/success");
  } catch (error) {
    console.error("支付失败:", error);
  }
};
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

.delivery-info h4,
.payment-methods h4 {
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
  gap: 1rem;
  align-items: center;
}

.address-card p {
  margin: 0;
  color: #666;
  white-space: nowrap;
}

.payment-methods {
  margin-bottom: 1rem;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
