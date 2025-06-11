import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: [],
    allComments: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    // 获取评论
    async fetchComments(articleId, commentType, commentQuery) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          `${API_URL}/${commentType}?${commentQuery}=${articleId}`
        );

        if (
          response.data &&
          Array.isArray(response.data.data)
        ) {
          this.allComments = response.data.data;
          return response.data.data;
        } else {
          console.error('获取评论失败: 响应数据格式不正确', response.data);
          return [];
        }
      } catch (err) {
        this.error = err.message;
        console.error('获取评论失败:', err);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // 添加评论
   async addComment(commentData, commentType) {
  try {
    this.isLoading = true;
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const commentId = `COMMENT${timestamp}${randomNum}`;
    const newComment = {
      ...commentData,
      id: commentId,
      created_at: new Date().toISOString(), // 必须有
      is_audited: true,
      likes: 0,
    };
    this.comments.unshift(newComment);
    this.allComments.unshift(newComment);
    return newComment;
  } catch (err) {
    this.error = err.message;
    throw err;
  } finally {
    this.isLoading = false;
  }
},

    // 删除评论
    async deleteComment(commentId, commentType) {
      try {
        if (!commentId) {
          throw new Error('评论ID不能为空');
        }

        const response = await axios.delete(
          `${API_URL}/${commentType}/${commentId}`
        );

        if (response.status === 200) {
          this.comments = this.comments.filter((c) => c.id !== commentId);
          this.allComments = this.allComments.filter((c) => c.id !== commentId);
          return true;
        } else {
          throw new Error('删除评论失败：服务器响应异常');
        }
      } catch (error) {
        this.error = error.message;
        console.error('删除评论失败:', error);
        throw error;
      }
    },
  },
});
