<template>
  <div
    class="flex items-center py-4 border-b-1 border-bg-primary hover:shadow-md duration-300 transition-all"
    @click="navigateToArticle(article.id)">
    <!-- 图片 -->
    <img :src="article.cover_img" class="w-28 h-28 object-cover" />
    <!-- 文章标题+时间 -->
    <div class="ml-2 flex flex-col justify-center">
      <div
        class="text-base text-font-primary flex justify-start my-1 font-Harmony">
        <span class="text-sm">{{ formatDateToYMD(article.publish_time) }}</span
        ><span class="flex ml-4"
          ><MessageCircleMore size="18" color="#F26371" />{{
            article.view_count
          }}</span
        >
      </div>
      <div class="font-Alibaba text-lg font-medium text-left hover:text-black/40 duration-300 transition-all">
        {{ article.title }}
      </div>
      <div class="mt-2 h-0.5 w-12 bg-font-primary"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewArticleCard',
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
const router = useRouter();

const navigateToArticle = (id) => {
  router.push({ name: 'Article', params: { id: id } });
};

function formatDateToYMD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 补零
  const day = String(date.getDate()).padStart(2, '0'); // 补零
  return `${year}年${month}月${day}日`;
}
</script>
