<template>
  <div class="article-container">
    <Header2 title="文章详情" subtext="articleDetail" />
    <div v-if="loading" class="text-center py-10">加载中...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>
    <div v-else class="mx-40 mt-20 font-Alibaba">
      <!-- 文章 -->
      <div class="mb-20 px-20 py-8 border-1 border-[#BFBFBF]/45">
        <!-- 标题 -->
        <div class="mb-10">
          <div
            class="text-xl text-[#BFBFBF] flex justify-start my-2 font-Harmony">
            <span>{{ formatDateToYMD(article.publish_time) }}</span
            ><span class="flex ml-8"
              ><MessageCircleMore size="24" color="#BFBFBF" />{{
                article.view_count
              }}</span
            >
          </div>
          <div class="font-Alibaba text-3xl font-medium text-left">
            {{ article.title }}
          </div>
          <div class="mt-6 h-1 w-30 bg-font-primary"></div>
        </div>
        <!-- 正文 -->
        <div class="text-font-secondary text-left">
          <img
            :src="article.cover_img"
            w-full
            alt="article-title"
            class="my-4" />
          <p v-html="article.content" class="mt-10"></p>
        </div>
      </div>
      <!-- 切换 -->
      <div class="relative h-30 my-10 mb-20 w-full">
        <!-- 上一篇 -->
        <div
          class="absolute left-0 flex text-left"
          v-if="previousArticleId !== null">
          <img
            @click="navigateToArticle(previousArticleId)"
            :src="previousArticleCoverImg"
            class="w-36 h-36 mr-3 object-cover cursor-pointer hover:scale-105 transition-all duration-300" />
          <div
            @click="navigateToArticle(previousArticleId)"
            class="mx-2 flex flex-col justify-center">
            <p
              class="text-xl text-[#545656] hover:text-[#545656]/40 cursor-pointer">
              上一篇
            </p>
            <h4 class="text-black truncate w-80 cursor-pointer">
              {{ previousArticleTitle }}
            </h4>
          </div>
        </div>
        <!-- 下一篇 -->
        <div
          class="absolute right-0 text-right flex"
          v-if="nextArticleId !== null">
          <div
            @click="navigateToArticle(nextArticleId)"
            class="mx-2 flex flex-col justify-center">
            <p
              class="text-xl text-[#545656] hover:text-[#545656]/40 cursor-pointer">
              下一篇
            </p>
            <h4 class="text-black w-80 truncate cursor-pointer">
              {{ nextArticleTitle }}
            </h4>
          </div>
          <img
            @click="navigateToArticle(nextArticleId)"
            :src="nextArticleCoverImg"
            class="w-36 h-36 object-cover ml-3 cursor-pointer hover:scale-105 transition-all duration-300" />
        </div>
      </div>
    </div>
    <!-- 评论区 -->
    <Comments v-if="article.id" :sortId="article.id" commentType="article_comments" commentQuery="article_id" />
  </div>
</template>

<script>
export default {
  name: 'Article',
  inheritAttrs: false,
};
</script>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { MessageCircleMore } from 'lucide-vue-next';
import Header2 from '/src/components/Header2.vue';
import { API_URL } from '/src/pages/const/index';
import Comments from '/src/components/comments/comments.vue';

const route = useRoute();
const router = useRouter();
const article = ref({});
const articles = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchArticles = async () => {
  if (!route.params.id) {
    error.value = '文章ID不存在';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/articles`);
    articles.value = response.data;
    const foundArticle = articles.value.find(
      (article) => article.id === route.params.id
    );

    if (!foundArticle) {
      error.value = '未找到文章';
      return;
    }

    article.value = foundArticle;
  } catch (error) {
    console.error('Error fetching articles:', error);
    error.value = '获取文章失败';
  } finally {
    loading.value = false;
  }
};

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchArticles();
    }
  },
  { immediate: true }
);

// 获取当前文章的索引
const currentIndex = computed(() =>
  articles.value.findIndex((article) => article.id === route.params.id)
);

// 计算上一篇和下一篇文章的 ID 和标题
const previousArticleId = computed(() =>
  currentIndex.value > 0 ? articles.value[currentIndex.value - 1].id : null
);
const nextArticleId = computed(() =>
  currentIndex.value < articles.value.length - 1
    ? articles.value[currentIndex.value + 1].id
    : null
);
const previousArticleTitle = computed(() =>
  currentIndex.value > 0 ? articles.value[currentIndex.value - 1].title : ''
);
const nextArticleTitle = computed(() =>
  currentIndex.value < articles.value.length - 1
    ? articles.value[currentIndex.value + 1].title
    : ''
);
const previousArticleCoverImg = computed(() =>
  currentIndex.value > 0 ? articles.value[currentIndex.value - 1].cover_img : ''
);
const nextArticleCoverImg = computed(() =>
  currentIndex.value < articles.value.length - 1
    ? articles.value[currentIndex.value + 1].cover_img
    : ''
);

const navigateToArticle = (id) => {
  router.replace({ name: 'Article', params: { id: id } });
};

function formatDateToYMD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}
</script>
