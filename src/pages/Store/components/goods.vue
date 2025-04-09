<template>
  <div class="mb-10 font-Alibaba">
    <div
      class="relative w-56 mx-4 h-72 bg-bg-thirth"
      @mouseenter="showCart = true"
      @mouseleave="showCart = false">
      <div
        class="absolute top-4 w-10 h-5 bg-[#97B959] text-white font-medium text-center leading-5">
        15%
      </div>
      <div>图片图片图片</div>
      <!-- 鼠标移入效果 -->
      <div
        v-show="showCart"
        class="absolute bottom-0 w-full h-20 bg-bg-fourth/46 flex justify-center items-center transition-opacity duration-300">
        <div
          class="w-22 h-9 bg-font-primary text-white text-sm leading-9 text-center cursor-pointer hover:bg-font-primary/80">
          加入购物车
        </div>
        <div
          class="absolute right-4 flex items-center cursor-pointer"
          @click="showDetails = true">
          <el-icon :size="36"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
    <h5 class="text-center text-font-secondary mt-3">粉红花束</h5>
    <span class="flex justify-center">
      <span class="text-center text-font-secondary font-medium text-lg"
        >￥18.00</span
      ><span class="text-sm text-font-fourth line-through leading-10"
        >￥21.00</span
      ></span
    >
    <DetailsEject v-if="showDetails" @close="showDetails = false" />
  </div>
</template>
<script>
export default {
  name: 'Goods',
};
</script>
<script setup>
import { ref } from 'vue';
import DetailsEject from './details-eject.vue';
const showCart = ref(false);
const showDetails = ref(false);
</script>
