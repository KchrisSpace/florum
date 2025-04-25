<template>
  <div class="flex flex-col justify-center px-60">
    <div class="font-Alibaba text-base w-52 flex justify-between items-end">
      <span class="text-3xl text-black"
        >评论<span class="text-font-thirth text-lg ml-1">{{
          commentList.length
        }}</span></span
      >
      <span class="text-black">最热</span>
      <div class="inline-block h-6 w-0.5 bg-font-primary"></div>
      <span class="text-font-thirth">最新</span>
    </div>
    <!-- 发条评论吧 -->
    <form
      @submit.prevent="handleSubmit"
      class="flex justify-start items-center my-6">
      <!-- 头像 -->
      <div class="bg-font-primary w-18 h-18 rounded-full"></div>
      <div class="grow gap-4 mx-2 flex justify-start">
        <textarea
          v-if="isFocused"
          v-model="commentText"
          @blur="handleBlur"
          @input="handleInput"
          placeholder="评论千万条，等你发一条"
          class="outline-none bg-bg-fifth rounded-sm py-2 px-2 w-2/3 resize-none overflow-hidden"
          :style="{ height: textareaHeight + 'px' }"
          maxlength="200"></textarea>
        <input
          v-else
          type="text"
          v-model="commentText"
          @focus="handleFocus"
          placeholder="评论千万条，等你发一条"
          class="outline-none bg-bg-fifth rounded-sm h-10 py-2 px-2 w-2/3" />
        <div v-if="isFocused" class="flex flex-col items-end">
          <button
            type="submit"
            :disabled="!commentText.trim() || isLoading"
            class="bg-font-primary text-white rounded-sm h-10 py-2 px-4 rounded-2 disabled:opacity-50 transition-opacity duration-200">
            {{ isLoading ? '发布中...' : '发布' }}
          </button>
        </div>
      </div>
    </form>

    <!-- 用户评论列表 -->
    <div v-if="commentList.length > 0" class="w-full flex justify-center flex-wrap">
      <div
        v-for="comment in commentList"
        :key="comment.id"
        class="text-left flex pt-10 font-Harmony ">
        <!-- 用户头像 -->
        <img
          :src="comment.avatar"
          alt="avatar"
          class="w-16 h-16 bg-font-primary rounded-full shrink-0 object-cover" />
        <div class="mx-2">
          <div class="text-font-thirth font-Alibaba">
            {{ comment.user_name }}
          </div>
          <div class="my-2 text-xl text-font-secondary">
            {{ comment.content }}
          </div>
          <div class="text-font-thirth">
            {{ formatDate(comment.created_at) }}
          </div>
           <!-- 修饰 -->
      <div class="w-[800px] border-b-1 border-bg-primary mt-10"></div>
        </div>
      </div>
     
    </div>
    <div v-else class="text-center text-font-thirth py-10">
      暂无评论，快来发表第一条评论吧！
    </div>
  </div>
</template>

<script setup name="Comments">
import { useCommentsStore } from '/src/stores/comments';
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true,
  },
});

const commentsStore = useCommentsStore();
const commentList = ref([]);
const isFocused = ref(false);
const commentText = ref('');
const textareaHeight = ref(40);
const minHeight = 40;
const isLoading = ref(false);

const fetchComments = async () => {
  if (!props.articleId) {
    console.error('Article ID is required');
    return;
  }

  try {
    isLoading.value = true;
    const comments = await commentsStore.fetchArticleComments(props.articleId);
    // 按创建时间倒序排列
    commentList.value = comments.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } catch (error) {
    console.error('获取评论失败:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!commentText.value.trim() || isLoading.value) return;

  try {
    isLoading.value = true;
    const newComment = await commentsStore.addArticleComment({
      article_id: props.articleId,
      content: commentText.value.trim(),
      user_name: '当前用户',
    });

    // 确保新评论添加到列表开头
    if (newComment) {
      commentList.value = [newComment, ...commentList.value];
    }

    // 重置输入框状态
    commentText.value = '';
    isFocused.value = false;
    textareaHeight.value = minHeight;
  } catch (error) {
    console.error('发表评论失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 监听 articleId 变化
watch(
  () => props.articleId,
  (newId) => {
    if (newId) {
      fetchComments();
    }
  },
  { immediate: true }
);

// 监听评论列表变化
watch(
  () => commentsStore.articleComments,
  (newComments) => {
    if (newComments && newComments.length > 0) {
      // 按创建时间倒序排列
      commentList.value = newComments
        .filter((comment) => comment.article_id === props.articleId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },
  { deep: true }
);

function handleFocus() {
  isFocused.value = true;
}

function handleBlur() {
  if (!commentText.value.trim()) {
    isFocused.value = false;
  }
}

function handleInput() {
  // 计算文本区域高度
  const textarea = document.querySelector('textarea');
  if (textarea) {
    textarea.style.height = 'auto';
    const newHeight = Math.max(minHeight, textarea.scrollHeight);
    textareaHeight.value = newHeight;
    // 确保文本区域高度至少为一行
    if (newHeight < minHeight) {
      textareaHeight.value = minHeight;
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
</script>
