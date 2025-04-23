<template>
  <Header2 title="社区" subtext="community" />
  <div class="mt-10 px-30 flex justify-between h-screen">
    <!-- left -->
    <div class="w-3/4 flex justify-around flex-wrap content-start">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article" />
    </div>
    <!-- right -->
    <div class="grow">
      <!-- 搜索 -->
      <div
        class="pl-4 pr-2 mb-10 border-2 border-bg-primary flex items-center justify-between">
        <input
          type="text"
          class="h-10 outline-none"
          placeholder="请输入关键字" />
        <font-awesome-icon
          :icon="['fas', 'magnifying-glass']"
          size="lg"
          style="color: #808080" />
      </div>
      <!-- 最新文章 -->
      <div class="border-1 p-4 pt-0 border-bg-primary text-left text-2xl h-2/3 font-Alibaba overflow-y-scroll cursor-pointer">
        <div class="sticky top-0 pt-4 pb-2 bg-white">最新文章</div>
        <newArticleCard
          v-for="article in latestArticles"
          :key="article.id"
          :article="article" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Community',
};
</script>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header2 from '/src/components/Header2.vue';
import ArticleCard from '/src/pages/Community/components/article-card.vue';
import newArticleCard from './components/new-article-card.vue';
import { API_URL } from '/src/pages/const/index';

const articles = ref([]);
const latestArticles = ref([]);

const fetchArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    articles.value = response.data;

    latestArticles.value = [...articles.value]
      .sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time))
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

onMounted(() => {
  fetchArticles();
});
</script>
