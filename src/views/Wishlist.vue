<!--  -->
<template>
  <div>
    <Header2 title="心愿单" subtext="wish list" />
    <div class="wishlist-container">
      <div v-if="wishlistStore.isLoading" class="loading-state">
        <p>正在加载心愿单...</p>
      </div>
      <div v-else-if="wishlistStore.isEmpty" class="empty-state">
        <p>您的心愿单是空的</p>
      </div>
      <div v-else class="wishlist-items">
        <div
          v-for="item in wishlistStore.wishlistItems"
          :key="item.id"
          class="wishlist-item"
        >
          <button class="delete-btn" @click="removeFromWishlist(item.id)">
            ×
          </button>
          <div class="item-image">
            <img :src="item.product?.images[0]" :alt="item.product?.title" />
          </div>
          <div class="item-details">
            <h3 class="item-title">{{ item.product?.title }}</h3>
            <p class="item-price">
              ¥{{ item.product?.price_info?.current_price }}
            </p>
          </div>
          <div class="item-actions">
            <button class="add-to-cart-btn" @click="moveToCart(item)">
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header2 from "../components/Header2.vue";
import { useWishlistStore } from "../stores/wishlist.js";
import { useCartStore } from "../stores/cart";
import { onMounted } from "vue";
import { TransitionGroup } from "vue";

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

const removeFromWishlist = async (productId) => {
  try {
    await wishlistStore.removeItem(productId);
  } catch (error) {
    console.error("删除商品失败:", error);
  }
};

const moveToCart = async (item) => {
  try {
    await cartStore.addItem(item.id);
    await wishlistStore.removeItem(item.id);
  } catch (error) {
    console.error("移动商品到购物车失败:", error);
  }
};

onMounted(() => {
  wishlistStore.fetchWishlistData();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.wishlist-container {
  width: 80%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 20px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.wishlist-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wishlist-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.wishlist-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}

.delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.delete-btn:hover {
  color: #ff4444;
}

.item-image {
  width: 120px;
  height: 120px;
  margin-right: 2rem;
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  margin-right: 2rem;
}

.item-title {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.item-price {
  font-size: 1.2rem;
  color: #ff6b6b;
  font-weight: 500;
  margin: 0;
}

.item-actions {
  display: flex;
  align-items: center;
}

.add-to-cart-btn {
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: #ff5252;
}

@media (max-width: 768px) {
  .wishlist-container {
    width: 95%;
    padding: 10px;
  }

  .wishlist-item {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .item-image {
    margin: 0 0 1rem 0;
  }

  .item-details {
    margin: 0 0 1rem 0;
  }

  .delete-btn {
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
