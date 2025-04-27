<template>
  <Header2 title="社区" subtext="community" />
  <div class="mt-10 px-30 flex justify-between h-screen">
    <!-- left -->
    <div class="w-3/4 flex justify-around flex-wrap content-start">
      <template v-if="isLoading">
        <div class="w-full text-center py-8 text-font-thirth">搜索中...</div>
      </template>
      <template v-else-if="filteredArticles.length === 0">
        <div class="w-full text-center py-8 text-font-thirth">
          没有找到相关文章
        </div>
      </template>
      <template v-else>
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.id"
          :article="article" />
      </template>
    </div>
    <!-- right -->
    <div class="grow">
      <!-- 搜索 -->
      <div
        class="pl-4 pr-2 mb-10 border-2 border-bg-primary flex items-center justify-end hover:border-font-primary transition-colors duration-300">
        <input
          type="text"
          class="h-10 outline-none w-full placeholder:text-font-thirth"
          placeholder="搜索文章标题、内容或标签..."
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
          @input="debouncedSearch" />
        <font-awesome-icon
          :icon="['fas', 'magnifying-glass']"
          size="lg"
          :class="[
            'cursor-pointer transition-colors duration-300',
            searchKeyword ? 'text-font-primary' : 'text-font-thirth',
          ]"
          @click="handleSearch" />
      </div>
      <!-- 最新文章 -->
      <div
        class="border-1 p-4 pt-0 border-bg-primary text-left text-2xl h-2/3 font-Alibaba overflow-y-scroll cursor-pointer">
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
const searchKeyword = ref('');
const filteredArticles = ref([]);
const isLoading = ref(false);

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 搜索处理函数
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    filteredArticles.value = articles.value;
    return;
  }

  isLoading.value = true;

  const keyword = searchKeyword.value.toLowerCase();
  const searchResults = articles.value.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(keyword);
    const contentMatch = article.content.toLowerCase().includes(keyword);
    const tagMatch = article.tags.some((tag) =>
      tag.toLowerCase().includes(keyword)
    );
    return titleMatch || contentMatch || tagMatch;
  });

  // 模拟搜索延迟，实际项目中可以移除
  setTimeout(() => {
    filteredArticles.value = searchResults;
    isLoading.value = false;
  }, 300);
};

// 使用防抖的搜索函数
const debouncedSearch = debounce(handleSearch, 500);

const fetchArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    articles.value = response.data;
    filteredArticles.value = articles.value;

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
