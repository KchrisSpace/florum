<template>
  <div class="w-80 mb-10 cursor-pointer" @click="goToArticle">
    <div class="h-52 w-full bg-font-primary"></div>
    <div class="text-sm text-[#BFBFBF] flex justify-start my-2 font-Harmony">
      <span>2025年03月16日</span
      ><span class="flex ml-8"
        ><MessageCircleMore size="16" color="#BFBFBF" />2</span
      >
    </div>
    <div class="font-Alibaba text-xl font-medium text-left">
      鲜花的魔力：点亮生活的色彩
    </div>
    <div class="mt-2 h-1 w-16 bg-font-primary"></div>
  </div>
</template>
<script>
export default {
  name: 'ArticleCard',
  // props: {
  //   article: {
  //     type: Object,
  //     required: true
  //   }
  // }
};
</script>
<script setup>
import { MessageCircleMore } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToArticle = () => {
  router.push('/community/article');
};
</script>
