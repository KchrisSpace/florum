import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

export const useCommentsStore = () => {
  const comments = ref([]);
  const allComments = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 获取评论
  // const fetchComments = async (id, type) => {
  //   try {
  //     const response = await axios.get(`${API_URL}/comments?${type}_id=${id}`);
  //     comments.value = response.data;
  //   } catch (error) {
  //     console.error('获取评论失败:', error);
  //   }
  // };

  // 添加评论
  // const addComment = async (newComment) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/comments`, newComment);
  //     comments.value.push(response.data);
  //   } catch (error) {
  //     console.error('添加评论失败:', error);
  //   }
  // };

  // // 更新评论
  // const updateComment = async (commentId, updatedContent,type) => {
  //   try {
  //     await axios.put(`${API_URL}/${type}/${commentId}`, {
  //       content: updatedContent,
  //     });
  //     const comment = comments.value.find((c) => c.id === commentId);
  //     if (comment) {
  //       comment.content = updatedContent;
  //     }
  //   } catch (error) {
  //     console.error('更新评论失败:', error);
  //   }
  // };

  // 删除评论
  const deleteComment = async (commentId, commentType) => {
    try {
      await axios.delete(`${API_URL}/${type}/${commentId}`);
      comments.value = comments.value.filter((c) => c.id !== commentId);
    } catch (error) {
      console.error('删除评论失败:', error);
    }
  };

  // 获取文章评论
  const fetchComments = async (articleId, commentType, commentQuery) => {
    try {
      isLoading.value = true;
      const response = await axios.get(
        `${API_URL}/${commentType}?${commentQuery}=${articleId}`
      );
      allComments.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('获取评论失败:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // 添加文章评论
  const addComment = async (commentData, commentType) => {
    try {
      isLoading.value = true;
      const response = await axios.post(`${API_URL}/${commentType}`, {
        ...commentData,
        created_at: new Date().toISOString(),
        is_audited: true,
      });

      // 更新 articleComments 状态
      if (response.data) {
        allComments.value = [response.data, ...allComments.value];
      }

      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('添加评论失败:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    comments,
    allComments,
    isLoading,
    error,
    deleteComment,
    fetchComments,
    addComment,
  };
};
