<template>
  <div
    class="mb-5 pb-3 font-Alibaba hover:cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300"
    v-for="item in goods"
    :key="item.id"
    @click="handleToDetails(item.id)">
    <div
      class="relative w-56 bg-bg-thirth"
      @mouseenter="item.showCart = true"
      @mouseleave="item.showCart = false">
      <div
        v-if="
          item.price_info.current_price != item.price_info.original_price &&
          item.promotion.is_hot == false
        "
        class="absolute top-2 w-10 h-5 bg-[#97B959] text-white font-medium text-center leading-5">
        {{
          parseInt(
            ((item.price_info.original_price - item.price_info.current_price) /
              item.price_info.original_price) *
              100
          )
        }}%
      </div>
      <div
        v-else-if="item.promotion.is_hot"
        class="absolute top-2 w-10 h-5 bg-font-primary text-white font-medium text-center leading-5">
        Hot
      </div>
      <img :src="item.images[0]" alt="{{ item.title }}" />
      <!-- 鼠标移入效果 -->
      <div
        v-show="item.showCart"
        class="absolute bottom-0 w-full h-20 bg-bg-fourth/46 flex justify-center items-center transition-opacity duration-300">
        <button
          class="w-22 h-9 bg-font-primary text-white text-sm leading-9 text-center cursor-pointer hover:bg-font-primary/80"
          @click.stop="handleAddToCart(item)">
          加入购物车
        </button>
        <div
          class="absolute right-4 flex items-center cursor-pointer"
          @click.stop="handleShowDetails(item)">
          <el-icon :size="36"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
    <div class="flex justify-start items-end gap-2 my-2 mx-2">
      <h6 class="text-center text-font-secondary my-0">{{ item.title }}</h6>
      <span class="text-xs text-font-fourth"
        >已售{{ item.sales_data.sales_count }}件</span
      >
    </div>

    <span class="flex justify-start items-center gap-1 mx-2">
      <span class="font-medium text-base text-font-primary"
        >￥{{ item.price_info.current_price }}</span
      ><span
        v-if="item.price_info.current_price != item.price_info.original_price"
        class="text-xs text-font-fourth line-through"
        >￥{{ item.price_info.original_price }}</span
      >
    </span>
  </div>
  <DetailsEject
    v-if="showDetails"
    :title="selectedProduct.title"
    :image="selectedProduct?.images[0]"
    :current_price="selectedProduct?.price_info.current_price"
    :original_price="selectedProduct?.price_info.original_price"
    :main_description="selectedProduct?.promotion.main_description"
    :flower_language="selectedProduct?.promotion.flower_language"
    :rating="selectedProduct?.sales_data.rating"
    :id="selectedProduct?.id"
    @close="showDetails = false" />
  <JoinCart
    v-if="showJoinCart"
    :title="selectedProduct?.title"
    :image="selectedProduct?.images[0]"
    @close="showJoinCart = false" />
</template>
<script>
export default {
  name: 'Goods',
  props: {
    goods: {
      type: Array,
      required: true,
    },
  },
};
</script>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DetailsEject from './details-eject.vue';
import JoinCart from '../components/join-cart.vue';

const showDetails = ref(false);
const showJoinCart = ref(false);
const selectedProduct = ref({
  title: '',
  images: [''],
  price_info: {
    current_price: 0,
    original_price: 0,
  },
  promotion: {
    main_description: '',
    flower_language: '',
  },
  sales_data: {
    rating: 0,
  },
  id: '',
});

const router = useRouter();

const handleAddToCart = (item) => {
  selectedProduct.value = { ...item };
  showJoinCart.value = true;
};

const handleShowDetails = (item) => {
  selectedProduct.value = { ...item };
  showDetails.value = true;
};

const handleToDetails = (itemid) => {
  router.push({
    name: 'ProductDetails',
    params: { id: itemid },
  });
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>
