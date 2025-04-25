<template>
  <form class="w-full" @submit.prevent="handleSubmit">
    <!-- 个人信息 -->
    <div class="flex items-center pt-10">
      <!-- 头像 -->
      <div class="flex flex-col w-20 mr-6">
        <div
          class="w-20 h-20 bg-font-primary rounded-full overflow-hidden relative">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="用户头像"
            class="w-full h-full object-cover" />
          <div
            v-if="isLoading"
            class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        </div>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleFileChange"
          style="display: none" />
        <button
          type="button"
          @click="triggerFileInput"
          class="text-center mb-0 mt-2 hover:text-font-primary transition-colors"
          :disabled="isLoading">
          更换头像
        </button>
      </div>
      <!-- 昵称 -->
      <div class="flex flex-col ml-2 text-left w-full text-lg">
        <div class="">
          <label for="">昵称：</label>
          <input
            type="text"
            v-model="formData.nickname"
            :disabled="isLoading"
            class="bg-bg-fifth/60 h-8 w-3/5"
            placeholder="请输入昵称" />
        </div>
        <div class="mt-3">
          <label for="sex" class="mr-4">性别：</label>
          <input
            type="radio"
            name="sex"
            v-model="formData.gender"
            value="male"
            :disabled="isLoading"
            class="mx-2" />男
          <input
            type="radio"
            name="sex"
            v-model="formData.gender"
            value="female"
            :disabled="isLoading"
            class="mx-2" />女
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <div class="border-t-1 border-b-1 border-bg-primary text-left py-4 mt-14">
      <h4 class="mb-4">修改密码</h4>
      <div class="my-2">
        <label for="">当前密码：</label><br />
        <input
          type="password"
          v-model="formData.currentPassword"
          :disabled="isLoading"
          class="bg-bg-fifth/60 h-8 w-2/3"
          placeholder="请输入当前密码" />
      </div>
      <div class="my-2">
        <label for="">新密码：</label><br />
        <input
          type="password"
          v-model="formData.newPassword"
          :disabled="isLoading"
          class="bg-bg-fifth/60 h-8 w-2/3"
          placeholder="请输入新密码" />
      </div>
      <div class="my-2">
        <label for="">确认新密码：</label><br />
        <input
          type="password"
          v-model="formData.confirmPassword"
          :disabled="isLoading"
          class="bg-bg-fifth/60 h-8 w-2/3"
          placeholder="请再次输入新密码" />
      </div>
    </div>

    <!-- 保存更改 -->
    <div class="w-[120px]">
      <button
        type="submit"
        :disabled="isLoading"
        class="bg-font-primary text-white text-lg mt-4 w-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {{ isLoading ? '保存中...' : '保存更改' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'UserDetails',
};
</script>

<script setup>
import { ref } from 'vue';
import { API_URL } from '/src/pages/const/index';
import axios from 'axios';

const fileInput = ref(null);
const avatarUrl = ref('');
const isLoading = ref(false);
const formData = ref({
  user_id: '02',
  nickname: '',
  gender: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatar: null,
});

// 表单验证
const validateForm = () => {
  if (!formData.value.nickname) {
    alert('请输入昵称');
    return false;
  }
  if (!formData.value.gender) {
    alert('请选择性别');
    return false;
  }
  if (formData.value.newPassword && !formData.value.currentPassword) {
    alert('请输入当前密码');
    return false;
  }
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    alert('两次输入的密码不一致');
    return false;
  }
  return true;
};

// 触发文件选择
const triggerFileInput = () => {
  if (!isLoading.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB');
      return;
    }

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target.result;
      formData.value.avatar = file;
    };
    reader.readAsDataURL(file);
  }
};

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  try {
    // 创建请求数据对象
    const requestData = {
      user_id: formData.value.user_id,
      user_name: formData.value.nickname,
      user_password:
        formData.value.newPassword || formData.value.currentPassword,
      user_gender: formData.value.gender === 'male' ? '男' : '女',
      updated_at: new Date().toISOString(),
    };

    let response;
    // 如果有头像，使用FormData
    if (formData.value.avatar) {
      const formDataToSend = new FormData();
      Object.keys(requestData).forEach((key) => {
        formDataToSend.append(key, requestData[key]);
      });
      formDataToSend.append('user_avatar', formData.value.avatar);

      response = await axios.put(
        `${API_URL}/user_update?user_id=${formData.value.user_id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } else {
      // 如果没有头像，直接发送JSON数据
      response = await axios.put(
        `${API_URL}/user_update?user_id=${formData.value.user_id}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (response.status === 200) {
      alert('更新成功！');

      // 重置表单
      formData.value = {
        user_id: '02',
        nickname: '',
        gender: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: null,
      };
      avatarUrl.value = '';
    }
  } catch (error) {
    console.error('更新失败:', error);
    alert(error.response?.data?.message || '更新失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
input {
  outline: none;
  padding: 10px;
  transition: all 0.3s ease;
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:disabled {
  cursor: not-allowed;
}
</style>
