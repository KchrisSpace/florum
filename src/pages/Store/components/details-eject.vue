<template>
  <div class="fixed inset-0 z-50">
    <!-- 背景遮罩 -->
    <div
      class="absolute inset-0 bg-font-secondary/60"
      @click="$emit('close')"></div>
    <!-- 详情弹窗 -->
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white shadow-xl">
      <!-- 关闭按钮 -->
      <div
        class="absolute right-0 w-7 h-7 bg-font-primary flex justify-center items-center">
        <el-icon
          size="24"
          color="#fff"
          class="cursor-pointer font-bold"
          @click="$emit('close')"
          ><Close
        /></el-icon>
      </div>
      <!-- 内容 -->
      <div class="p-3 flex justify-between items-center">
        <!-- 左侧商品图片 -->
        <img :src="image" alt="{{ title }}" class="w-1/3 bg-bg-thirth h-60 mb-4 shrink-0"></img>
        <div class="h-72 w-full pr-4 ml-4 font-Alibaba">
          <!-- 这里添加商品详情内容 -->
          <h4>{{ title }}</h4>
          <!-- 商品价格 -->
          <div class="flex items-center justify-between">
            <span class="text-font-primary text-base"
              >￥{{ current_price }}
              <span v-if="current_price!=original_price" class="text- line-through text-font-primary/40 text-sm"
                >￥{{original_price}}
              </span></span
            >
            <!-- 星级+评论 -->
            <span class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" 
               class="scale-75 translate-x-3"
              xmlns:xlink="http://www.w3.org/1999/xlink" width="150.09130859375" height="25.560546875" viewBox="0 0 150.09130859375 25.560546875" fill="none">
                <!-- SVG paths -->
              </svg>
              <p class="text-[#FFCD69] text-base">评论（95）</p>
            </span>
          </div>
          <!-- 商品描述 -->
          <p
            class="text-base font-Harmony tracking-wide leading-6 text-font-secondary font-light">
            {{ main_description }}
          </p>
          <!-- 花语 -->
          <div class="font-Harmony">
            <span>花语：</span>
            <span>{{ flower_language }}</span>
          </div>
          <!-- 加入购物车按钮 -->
          <div class="flex justify-start mt-4 font-Harmony font-light text-sm">
            <!-- 计数按钮 -->
            <div class="bg-bg-fifth/85 flex items-center">
              <button @click="decreaseQuantity" class="mx-3">
                <el-icon><Minus /></el-icon>
              </button>
              <span class="mx-2 text-lg font-Harmony">{{ quantity }}</span>
              <button @click="increaseQuantity" class="mx-3">
                <el-icon><Plus /></el-icon>
              </button>
            </div>
            <button
              class="w-24 h-10 mx-3 bg-font-primary text-white text-center leading-10"
              @click="handleAddToCart">
              加入购物车
            </button>
            <!-- 收藏进心愿单按钮 -->
            <button class="bg-bg-fifth/85 px-3" @click="addToWishlist">
              <font-awesome-icon
                :icon="['far', 'heart']"
                size="lg"
                style="color: #808080"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailsEject',
  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    current_price: {
      type: Number,
      required: true,
    },
    original_price: {
      type: Number,
      required: true,
    },
    main_description: {
      type: String,
      required: true,
    },
    flower_language: {
      type: String,
      required: true,
    },
    rating:{
      type: Number,
      required: true,
    },
    id: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['close']
};
</script>

<script setup>
import { ref } from 'vue';
import { Close, Plus, Minus } from '@element-plus/icons-vue';
import { useCartStore } from "../../../stores/cart";
import { useWishlistStore } from "../../../stores/wishlist";
import { ElMessage } from 'element-plus';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  current_price: {
    type: Number,
    required: true,
  },
  original_price: {
    type: Number,
    required: true,
  },
  main_description: {
    type: String,
    required: true,
  },
  flower_language: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['close']);
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const quantity = ref(1);

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// 添加商品到购物车
const handleAddToCart = async () => {
  try {
    await cartStore.addItem(props.id, quantity.value);
    ElMessage({
      message: '商品已成功添加到购物车',
      type: 'success',
    });
    emit('close');
  } catch (error) {
    console.error("添加商品到购物车失败:", error);
    ElMessage({
      message: '添加商品失败，请重试',
      type: 'error',
    });
  }
};

// 添加商品到心愿单
const addToWishlist = async () => {
  try {
    await wishlistStore.addItem(props.id);
    ElMessage({
      message: '商品已成功添加到心愿单',
      type: 'success',
    });
  } catch (error) {
    console.error("添加商品到心愿单失败:", error);
    ElMessage({
      message: '添加商品到心愿单失败，请重试',
      type: 'error',
    });
  }
};
</script>

<style scoped>
/* 添加一些样式使按钮更美观 */
.bg-bg-fifth\/85 {
  background-color: rgba(245, 245, 245, 0.85);
  border-radius: 4px;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  opacity: 0.8;
}

.el-icon {
  cursor: pointer;
}

.w-24 {
  width: 6rem;
}

.mx-3 {
  margin-left: 0.75rem;
  margin-right: 0.75rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-Harmony {
  font-family: 'Harmony', sans-serif;
}

.font-light {
  font-weight: 300;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
