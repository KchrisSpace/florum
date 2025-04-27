<template>
  <form class="w-full" @submit.prevent="handleSubmit">
    <!-- 个人信息 -->
    <div class="flex items-center pt-10">
      <!-- 头像 -->
      <div class="flex flex-col w-20 mr-6">
        <div
          class="w-20 h-20 bg-font-primary rounded-full overflow-hidden relative group">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="用户头像"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
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
          class="text-center mb-0 mt-2 hover:text-font-primary transition-colors text-sm"
          :disabled="isLoading">
          更换头像
        </button>
      </div>
      <!-- 昵称 -->
      <div class="flex flex-col ml-2 text-left w-full text-lg">
        <div class="relative">
          <label for="nickname" class="block mb-1">昵称：</label>
          <input
            id="nickname"
            type="text"
            v-model="formData.nickname"
            :disabled="isLoading"
            class="bg-bg-fifth/60 h-10 w-3/5 rounded-md focus:ring-2 focus:ring-font-primary focus:border-transparent"
            :class="{ 'border-red-500': errors.nickname }"
            placeholder="请输入昵称" />
          <p v-if="errors.nickname" class="text-red-500 text-sm mt-1">
            {{ errors.nickname }}
          </p>
        </div>
        <div class="mt-3 flex">
          <label for="sex" class="mr-4">性别：</label>
          <div class="flex items-center">
            <label class="inline-flex items-center mr-4">
              <input
                type="radio"
                name="sex"
                v-model="formData.gender"
                value="male"
                :disabled="isLoading"
                class="form-radio text-font-primary focus:ring-font-primary" />男
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="sex"
                v-model="formData.gender"
                value="female"
                :disabled="isLoading"
                class="form-radio text-font-primary focus:ring-font-primary" />女
            </label>
          </div>
          <p v-if="errors.gender" class="text-red-500 text-sm mt-1">
            {{ errors.gender }}
          </p>
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <div class="border-t-1 border-b-1 border-bg-primary text-left py-4 mt-14">
      <h4 class="mb-4 text-xl font-medium">修改密码</h4>
      <div class="my-2 flex flex-col">
        <label for="currentPassword" class="mb-1">当前密码：</label>
        <input
          id="currentPassword"
          type="password"
          v-model="formData.currentPassword"
          :disabled="isLoading"
          class="bg-bg-fifth/60 h-10 w-2/3 rounded-md focus:ring-2 focus:ring-font-primary focus:border-transparent"
          :class="{ 'border-red-500': errors.currentPassword }"
          placeholder="请输入当前密码" />
        <p v-if="errors.currentPassword" class="text-red-500 text-sm mt-1">
          {{ errors.currentPassword }}
        </p>
      </div>
      <div class="my-2 flex flex-col">
        <label for="newPassword" class="mb-1">新密码：</label>
        <input
          id="newPassword"
          type="password"
          v-model="formData.newPassword"
          :disabled="isLoading"
          class="bg-bg-fifth/60 h-10 w-2/3 rounded-md focus:ring-2 focus:ring-font-primary focus:border-transparent"
          :class="{ 'border-red-500': errors.newPassword }"
          placeholder="请输入新密码" />
        <p v-if="errors.newPassword" class="text-red-500 text-sm mt-1">
          {{ errors.newPassword }}
        </p>
      </div>
      <div class="my-2 flex flex-col">
        <label for="confirmPassword" class="mb-1">确认新密码：</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="formData.confirmPassword"
          :disabled="isLoading"
          class="bg-bg-fifth/60 h-10 w-2/3 rounded-md focus:ring-2 focus:ring-font-primary focus:border-transparent"
          :class="{ 'border-red-500': errors.confirmPassword }"
          placeholder="请再次输入新密码" />
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
          {{ errors.confirmPassword }}
        </p>
      </div>
    </div>

    <!-- 保存更改 -->
    <div class="w-[120px] mt-8">
      <button
        type="submit"
        :disabled="isLoading"
        class="bg-font-primary text-white text-lg py-2 w-full rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
        <span v-if="isLoading" class="animate-spin mr-2">
          <font-awesome-icon :icon="['fas', 'spinner']" />
        </span>
        {{ isLoading ? '保存中...' : '保存更改' }}
      </button>
    </div>
  </form>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);

export default {
  name: 'UserDetails',
  components: {
    FontAwesomeIcon,
  },
};
</script>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { API_URL } from '/src/pages/const/index';
import axios from 'axios';

const fileInput = ref(null);
const avatarUrl = ref('');
const isLoading = ref(false);
const errors = reactive({
  nickname: '',
  gender: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const formData = ref({
  user_id: '02',
  nickname: '',
  gender: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatar: '',
});

// 存储原始数据用于比较
const originalData = ref({
  nickname: '',
  gender: '',
  avatar: '',
});

// 定义常量
const DEFAULT_EMAIL = '123456@qq.com';
const DEFAULT_PHONE = '12345678901';
const CREATED_AT = '2025-04-25T21:56:28.881Z';

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      `${API_URL}/user_update/${formData.value.user_id}`
    );
    const userData = response.data;

    // 设置默认值
    formData.value.nickname = userData.user_name || '';
    formData.value.gender = userData.user_gender === '男' ? 'male' : 'female';
    if (userData.user_avatar) {
      avatarUrl.value = userData.user_avatar;
      formData.value.avatar = userData.user_avatar;
    }

    // 保存原始数据
    originalData.value = {
      nickname: formData.value.nickname,
      gender: formData.value.gender,
      avatar: formData.value.avatar,
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    alert('获取用户信息失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});

// 表单验证
const validateForm = () => {
  let isValid = true;
  errors.nickname = '';
  errors.gender = '';
  errors.currentPassword = '';
  errors.newPassword = '';
  errors.confirmPassword = '';

  if (!formData.value.nickname.trim()) {
    errors.nickname = '请输入昵称';
    isValid = false;
  }

  if (!formData.value.gender) {
    errors.gender = '请选择性别';
    isValid = false;
  }

  if (formData.value.newPassword) {
    if (!formData.value.currentPassword) {
      errors.currentPassword = '请输入当前密码';
      isValid = false;
    }

    if (formData.value.newPassword.length < 6) {
      errors.newPassword = '密码长度不能少于6位';
      isValid = false;
    }

    if (formData.value.newPassword !== formData.value.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }
  }

  return isValid;
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
      showError('请选择图片文件');
      return;
    }

    // 验证文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
      showError('图片大小不能超过2MB');
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

// 显示错误提示
const showError = (message) => {
  // 这里可以使用更优雅的提示方式，比如 Element Plus 的 Message
  alert(message);
};

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  try {
    const requestData = {
      id: formData.value.user_id,
      user_name: formData.value.nickname || originalData.value.nickname,
      user_gender: formData.value.gender === 'male' ? '男' : '女',
      user_email: DEFAULT_EMAIL,
      user_phone: DEFAULT_PHONE,
      user_avatar: formData.value.avatar || originalData.value.avatar,
      created_at: CREATED_AT,
      updated_at: new Date().toISOString(),
    };

    // 如果有新密码，添加密码字段
    if (formData.value.newPassword) {
      requestData.user_password = formData.value.newPassword;
    }

    // 发送请求
    const response = await sendUpdateRequest(requestData);
    if (response.status === 200) {
      handleSuccess(response.data);
    }
  } catch (error) {
    console.error('更新失败:', error);
    showError(error.response?.data?.message || '更新失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 提取发送请求的逻辑
const sendUpdateRequest = async (requestData) => {
  if (formData.value.avatar instanceof File) {
    const formDataToSend = new FormData();
    Object.keys(requestData).forEach((key) => {
      formDataToSend.append(key, requestData[key]);
    });
    formDataToSend.append('user_avatar', formData.value.avatar);

    return await axios.put(
      `${API_URL}/user_update/${formData.value.user_id}`,
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } else {
    return await axios.put(
      `${API_URL}/user_update/${formData.value.user_id}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// 处理更新成功
const handleSuccess = (responseData) => {
  alert('更新成功！');

  // 更新原始数据
  if (responseData.user_name) {
    originalData.value.nickname = responseData.user_name;
    formData.value.nickname = responseData.user_name;
  }
  if (responseData.user_gender) {
    originalData.value.gender =
      responseData.user_gender === '男' ? 'male' : 'female';
    formData.value.gender = originalData.value.gender;
  }
  if (responseData.user_avatar) {
    originalData.value.avatar = responseData.user_avatar;
    formData.value.avatar = responseData.user_avatar;
    avatarUrl.value = responseData.user_avatar;
  }

  // 重置密码相关字段
  formData.value.currentPassword = '';
  formData.value.newPassword = '';
  formData.value.confirmPassword = '';
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

input::placeholder {
  font-size: 14px;
  line-height: 40px;
}

.form-radio {
  margin-right: 0.5rem;
}

.form-radio:checked {
  background-color: #f26371;
  border-color: #f26371;
  border-width: 0.2px;
}

.form-radio:focus {
  box-shadow: 0 0 0 2px rgba(242, 99, 113, 0.2);
}
</style>
