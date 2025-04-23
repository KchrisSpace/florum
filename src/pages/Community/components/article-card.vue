<template>
  <div
    class="w-80 mb-5 pb-4 px-2 cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
    @click="goToArticle(article.id)">
    <img :src="article.cover_img" class="w-full" />
    <div class="text-sm text-[#BFBFBF] flex justify-start my-2 font-Harmony">
      <span> {{ formatDateToYMD(article.publish_time) }}</span
      ><span class="flex ml-8"
        ><MessageCircleMore size="16" color="#BFBFBF" />{{
          article.view_count
        }}</span
      >
    </div>
    <div class="font-Alibaba text-xl font-medium text-left">
      {{ article.title }}
    </div>
    <div class="mt-2 h-1 w-16 bg-font-primary"></div>
  </div>
  <!-- <Article v-show ="showArticle" :article="article" /> -->
</template>
<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>
<script setup>
import { MessageCircleMore } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
// import Article from '/src/pages/Community/components/article.vue';
const router = useRouter();
// const showArticle=ref(flase)
function formatDateToYMD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 补零
  const day = String(date.getDate()).padStart(2, '0'); // 补零
  return `${year}年${month}月${day}日`;
}
const goToArticle = (articleId) => {
  router.push({
    name: 'Article',
    params: {id: articleId},
  });
};
</script>
