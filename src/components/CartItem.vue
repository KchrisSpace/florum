<!--  -->
<template>
  <div class="cart-item">
    <hr />
    <button class="remove-btn" @click="removeItem">X</button>
    <img
      class="item-image"
      :src="product?.images[0] || 'https://via.placeholder.com/150'"
      :alt="product?.title"
    />
    <div class="item-info">
      <span class="item-name">{{ product?.title || "加载中..." }}</span>
      <span class="item-price"
        >¥{{ product?.price_info.current_price || "加载中..." }}</span
      >
      <div class="counter">
        <button @click="decrement">-</button>
        <span class="count-input"><input type="number" v-model="count" /></span>
        <button @click="increment">+</button>
      </div>
    </div>
    <p class="total-price">¥{{ totalPrice }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, computed, watch, defineEmits } from "vue";
import axios from "axios";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-total"]);

const product = ref(null);
const count = ref(1);

// 使用计算属性来计算总价
const totalPrice = computed(() => {
  if (!product.value?.price_info?.current_price) return 0;
  return (product.value.price_info.current_price * count.value).toFixed(2);
});

// 监听数量变化和总价变化
watch([count, totalPrice], ([newCount, newTotal]) => {
  emit("update-total", {
    id: props.item.id,
    total: parseFloat(newTotal),
  });
});

onMounted(() => {
  if (props.item.product_id) {
    axios
      .get(`http://localhost:3000/product_list/${props.item.product_id}`)
      .then((res) => {
        product.value = res.data;
        // 初始化时发送总价
        emit("update-total", {
          id: props.item.id,
          total: parseFloat(totalPrice.value),
        });
      })
      .catch((error) => {
        console.error("获取产品信息失败:", error);
      });
  }
});

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
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 20px;
}

.item-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 40px;
  margin-left: 40px;
  justify-content: space-between;
}

.item-name {
  width: 200px;
  font-size: 16px;
  font-weight: 500;
}

.item-price {
  width: 100px;
  color: #ff6b6b;
  font-weight: 500;
}

.counter {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  margin-right: 100px;
}

.counter button {
  width: 30px;
  height: 30px;
  border: 1px solid #e0e0e0;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.counter button:hover {
  background: #f5f5f5;
}

.counter input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.total-price {
  width: 100px;
  text-align: right;
  font-weight: 500;
  color: #ff6b6b;
}
</style>
