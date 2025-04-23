<!--  -->
<template>
  <div class="sidebar" :class="{ 'sidebar-open': isOpen }">
    <div class="sidebar-content">
      <h3>CART</h3>
      <div class="cart-items" v-for="item in cartItems" :key="item.id">
        <div class="cart-item">
          <img
            :src="item.product?.images[0] || '../assets/flower-product.png'"
            :alt="item.product?.title"
            class="item-image"
          />
          <div class="item-details">
            <div class="item-name">{{ item.product?.title }}</div>
            <div class="item-row">
              <div class="controls-group">
                <button class="quantity-btn" @click="decreaseQuantity(item)">
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="quantity-btn" @click="increaseQuantity(item)">
                  +
                </button>
              </div>
              <span class="price"
                >¥{{ item.product?.price_info?.current_price }}</span
              >
              <div class="delete-container">
                <button class="delete-btn" @click="removeItem(item)">
                  <i class="delete-icon">×</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 将cart-footer移到sidebar-content外，但保持在sidebar内 -->
    <div class="cart-footer">
      <div class="total">
        <span>小计：</span>
        <span class="total-price">¥ {{ totalPrice }}</span>
      </div>
      <div class="action-buttons">
        <button class="checkout-btn primary" @click="goToPayment">
          前往支付
        </button>
        <button class="checkout-btn secondary" @click="goToCart">
          购物车查看
        </button>
      </div>
    </div>
  </div>
  <!-- 遮罩层 -->
  <div class="overlay" v-if="isOpen" @click="$emit('close')"></div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";

const router = useRouter();
const cartStore = useCartStore();

// 组件通信
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["close"]);

// 计算属性
const cartItems = computed(() => cartStore.cartItems);
const totalPrice = computed(() => cartStore.total);

// 控件
const increaseQuantity = (item) => {
  item.quantity++;
  cartStore.updateCartItem(item);
  console.log(item);
  // 更新单个商品的总价
  const itemTotal = item.quantity * item.product.price_info.current_price;
  cartStore.updateItemTotal({ id: item.product_id, total: itemTotal });
};

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
    cartStore.updateCartItem(item);
    // 更新单个商品的总价
    const itemTotal = item.quantity * item.product.price_info.current_price;
    cartStore.updateItemTotal({ id: item.product_id, total: itemTotal });
  }
};

const removeItem = (item) => {
  cartStore.removeItem(item.product_id);
};

// 路由跳转
const goToPayment = () => {
  router.push("/payment");
};

const goToCart = () => {
  router.push("/cart");
};

// 生命周期钩子
onMounted(async () => {
  await cartStore.fetchCartData();
  // 初始化每个商品的总价
  cartItems.value.forEach((item) => {
    const itemTotal = item.quantity * item.product.price_info.current_price;
    cartStore.updateItemTotal({ id: item.product_id, total: itemTotal });
  });
});
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1001;
  display: flex; /* 添加flex布局 */
  flex-direction: column; /* 垂直方向排列 */
}

.sidebar-open {
  right: 0;
}

.sidebar-content {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 20px; /* 减小底部padding */
}

/* 遮罩层样式 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(78, 78, 78, 0.5);
  z-index: 1000;
  transition: opacity 0.3s ease;
}

/* 新增购物车项目样式 */
.cart-items {
  margin-top: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  gap: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.item-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  text-align: left;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  position: relative;
}

.delete-container {
  margin-left: auto;
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 3px;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
  padding: 0;
}

.quantity {
  min-width: 24px;
  text-align: center;
}

.price {
  color: #ff6b6b;
  font-size: 16px;
  margin-left: 12px;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.delete-btn:hover {
  color: #ff6b6b;
}

h3 {
  text-align: left;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

/* 底部结算区域样式 */
.cart-footer {
  position: relative; /* 改为相对定位 */
  width: 100%; /* 使用100%宽度 */
  background: white;
  padding: 20px;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0; /* 防止footer被压缩 */
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
}

.total-price {
  color: #ff6b6b;
  font-size: 20px;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.checkout-btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.checkout-btn:hover {
  opacity: 0.9;
}

.checkout-btn.primary {
  background-color: #333;
  color: white;
}

.checkout-btn.secondary {
  background-color: #f0f0f0;
  color: #333;
}
</style>
