import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const itemTotals = ref({});

  // 获取购物车数据
  const fetchCartData = async () => {
    try {
      const cartResponse = await axios.get("http://localhost:3000/cart");
      cartItems.value = cartResponse.data;

      // 获取每个商品的详细信息
      for (const item of cartItems.value) {
        try {
          const productResponse = await axios.get(
            `http://localhost:3000/product_list/${item.product_id}`
          );
          item.product = productResponse.data;
        } catch (error) {
          console.error(`获取商品 ${item.product_id} 信息失败:`, error);
        }
      }

      // 初始化每个商品的总价为0
      cartItems.value.forEach((item) => {
        itemTotals.value[item.product_id] = 0;
      });
    } catch (error) {
      console.error("获取购物车数据失败:", error);
    }
  };

  // 计算总价
  const total = computed(() => {
    return cartItems.value
      .reduce((acc, item) => {
        const itemTotal = itemTotals.value[item.product_id] || 0;
        return acc + itemTotal;
      }, 0)
      .toFixed(2);
  });

  // 更新商品总价
  const updateItemTotal = ({ id, total }) => {
    itemTotals.value[id] = total;
  };

  // 删除商品
  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${productId}`);
      // 从本地列表中移除商品
      cartItems.value = cartItems.value.filter(
        (item) => item.product_id !== productId
      );
      // 删除对应的总价记录
      delete itemTotals.value[productId];
      // 重新获取购物车数据以确保同步
      await fetchCartData();
    } catch (error) {
      console.error("删除商品失败:", error);
    }
  };

  // 更新商品数量
  const updateCartItem = async (item) => {
    try {
      await axios.put(`http://localhost:3000/cart/${item.product_id}`, {
        quantity: item.quantity,
      });
     
    } catch (error) {
      console.error("更新购物车商品失败:", error);
    }
  };

  // 清空购物车
  const clearCart = () => {
    cartItems.value = [];
    itemTotals.value = {};
  };

  return {
    cartItems,
    itemTotals,
    total,
    fetchCartData,
    updateItemTotal,
    removeItem,
    updateCartItem,
    clearCart,
  };
});
