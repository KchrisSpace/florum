<template>
  <div class="flex items-center py-4 border-b-1 border-bg-primary">
    <!-- 图片 -->
    <div class="h-28 w-28 bg-amber-100"></div>
    <!-- 文章标题+时间 -->
    <div class="ml-2 flex flex-col justify-center">
      <div
        class="text-base text-font-primary flex justify-start my-1 font-Harmony">
        <span class="text-sm">2025年03月16日</span
        ><span class="flex ml-4"
          ><MessageCircleMore size="18" color="#F26371" />2</span
        >
      </div>
      <div class="font-Alibaba text-lg font-medium text-left">
        鲜花的魔力：点亮生活的色彩
      </div>
      <div class="mt-2 h-0.5 w-12 bg-font-primary"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewArticleCard',
};
</script>
<script setup>
import { MessageCircleMore } from 'lucide-vue-next';
</script>
