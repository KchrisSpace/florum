<template>
  <Header2 title="社区" subtext="community" />
  <router-view v-if="$route.path === '/community/article'" />
  <div v-else class="mt-10 px-30 flex justify-between h-screen">
    <!-- left -->
    <div class="w-3/4 flex justify-around flex-wrap content-start">
      <ArticleCard />
      <ArticleCard />
      <ArticleCard />
      <ArticleCard />
    </div>
    <!-- right -->
    <div class="grow">
      <!-- 搜索 -->
      <div class="pl-4 pr-2 mb-10 border-2 border-bg-primary flex items-center justify-between">
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
      <div
        class="border-1 p-4 border-bg-primary text-left text-2xl h-2/3 font-Alibaba overflow-scroll">
        最新文章
        <newArticleCard />
        <newArticleCard />
        <newArticleCard />
        <newArticleCard />
        <newArticleCard />
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
import Header2 from '/src/components/Header2.vue';
import ArticleCard from '/src/pages/Community/components/article-card.vue';
import newArticleCard from './components/new-article-card.vue';
</script>
