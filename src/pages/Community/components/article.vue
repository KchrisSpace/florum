<template>
  <Header2 title="文章详情" subtext="articleDetail" />
  <div class="mx-40 mt-20 font-Alibaba">
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
        <img :src="article.cover_img" w-full alt="article-title" class="my-4" />
        <p v-html="article.content" class="mt-10"></p>
      </div>
    </div>
    <!-- 切换 -->
    <div class="flex justify-between my-10 mb-20">
      <!-- 上一篇 -->
      <div class="flex text-left" v-if="previousArticleId !== null">
        <img
          @click="navigateToArticle(previousArticleId)"
          :src="previousArticleCoverImg"
          class="w-36 h-36 object-cover cursor-pointer hover:scale-105 transition-all duration-300" />
        <div
          @click="navigateToArticle(previousArticleId)"
          class="mx-2 flex flex-col justify-center">
          <p class="text-xl text-[#545656] hover:text-[#545656]/40 cursor-pointer">上一篇</p>
          <h4 class="text-black cursor-pointer">{{ previousArticleTitle }}</h4>
        </div>
      </div>
      <!-- 下一篇 -->
      <div class="flex text-right" v-if="nextArticleId !== null">
        <div
          @click="navigateToArticle(nextArticleId)"
          class="mx-2 flex flex-col justify-center">
          <p class="text-xl text-[#545656] hover:text-[#545656]/40 cursor-pointer">下一篇</p>
          <h4 class="text-black cursor-pointer">{{ nextArticleTitle }}</h4>
        </div>
        <img
          @click="navigateToArticle(nextArticleId)"
          :src="nextArticleCoverImg"
          class="w-36 h-36 object-cover cursor-pointer hover:scale-105 transition-all duration-300" />
      </div>
    </div>
    <!-- 评论区 -->
    <Comments />
  </div>
</template>
<script>
export default {
  name: 'Article',
};
</script>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { MessageCircleMore } from 'lucide-vue-next';
import Header2 from '/src/components/Header2.vue';
import { API_URL } from '/src/pages/const/index';

const route = useRoute();
const router = useRouter();
const article = ref({});
const articles = ref([]);
const loading = ref(true);

const fetchArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    articles.value = response.data;
    article.value = articles.value.find(
      (article) => article.id === route.params.id
    );
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchArticles();
});

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    article.value = articles.value.find((article) => article.id === newId);
  }
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
