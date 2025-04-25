<template>
  <div class="comments-container">
    <!-- 评论输入区域 -->
    <div class="comment-input">
      <textarea
        v-model="commentContent"
        placeholder="写下你的评论..."
        @input="handleInput"
        ref="textarea"></textarea>
      <div class="input-actions">
        <span class="char-count">{{ commentContent.length }}/1000</span>
        <button
          @click="submitComment"
          :disabled="!commentContent.trim() || isLoading"
          class="submit-btn">
          {{ isLoading ? '发布中...' : '发布评论' }}
        </button>
      </div>
    </div>

    <!-- 评论筛选 -->
    <div class="filter-section">
      <div class="filter-options">
        <button
          @click="setSortBy('time')"
          :class="{ active: sortBy === 'time' }"
          class="filter-btn">
          最新
        </button>
        <button
          @click="setSortBy('hot')"
          :class="{ active: sortBy === 'hot' }"
          class="filter-btn">
          最热
        </button>
      </div>
      <div class="search-box">
        <input
          type="text"
          v-model="searchText"
          placeholder="搜索评论..."
          @input="filterComments"
          class="search-input" />
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list" v-if="filteredComments.length > 0">
      <div
        v-for="comment in filteredComments"
        :key="comment.id"
        class="comment-item">
        <div class="comment-header">
          <div class="user-info">
            <img
              :src="comment.avater || defaultAvatar"
              class="avatar"
              alt="用户头像" />
            <span class="username">{{ comment.user_name }}</span>
          </div>
          <span class="time">{{ formatTime(comment.created_at) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
      </div>
    </div>
    <div v-else class="no-comments">
      {{ searchText ? '没有找到相关评论' : '暂无评论，快来发表第一条评论吧！' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCommentsStore } from '@/stores/comments';

const props = defineProps({
  articleId: {
    type: Number,
    required: true,
  },
});

const {
  articleComments,
  isLoading,
  error,
  fetchArticleComments,
  addArticleComment,
} = useCommentsStore();
const commentContent = ref('');
const textarea = ref(null);
const sortBy = ref('time');
const searchText = ref('');
const defaultAvatar = '/src/assets/default-avatar.png';

// 自动调整文本框高度
const handleInput = () => {
  const textareaEl = textarea.value;
  textareaEl.style.height = 'auto';
  textareaEl.style.height = textareaEl.scrollHeight + 'px';
};

// 设置排序方式
const setSortBy = (type) => {
  sortBy.value = type;
};

// 筛选后的评论列表
const filteredComments = computed(() => {
  let result = [...articleComments.value];

  // 搜索筛选
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    result = result.filter(
      (comment) =>
        comment.content.toLowerCase().includes(searchLower) ||
        comment.user_name.toLowerCase().includes(searchLower)
    );
  }

  // 排序
  if (sortBy.value === 'time') {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy.value === 'hot') {
    // 这里可以根据需要添加热度排序逻辑
    // 例如：根据点赞数、回复数等
    result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  return result;
});

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return;

  try {
    await addArticleComment({
      article_id: props.articleId,
      content: commentContent.value.trim(),
      user_name: '当前用户', // 这里应该从用户状态中获取
    });
    commentContent.value = '';
    textarea.value.style.height = 'auto';
  } catch (err) {
    console.error('发布评论失败:', err);
  }
};

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 组件挂载时获取评论
onMounted(() => {
  fetchArticleComments(props.articleId);
});
</script>

<style scoped>
.comments-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.comment-input {
  margin-bottom: 30px;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  color: #666;
  font-size: 12px;
}

.submit-btn {
  padding: 8px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 筛选区域样式 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.search-box {
  flex: 1;
  max-width: 300px;
  margin-left: 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 评论列表样式 */
.comments-list {
  margin-top: 20px;
}

.comment-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: bold;
  color: #333;
}

.time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  color: #333;
  line-height: 1.6;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
