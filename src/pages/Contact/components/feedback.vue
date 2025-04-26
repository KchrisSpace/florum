<template>
  <div class="font-Alibaba">
    <h1 class="text-center">反馈</h1>
    <form
      class="flex justify-center my-10 flex-wrap"
      v-if="!showThanks"
      @submit.prevent="handleSubmit">
      <!-- left -->
      <div class="w-1/3 h-46 px-10 flex flex-col justify-between">
        <input
          type="text"
          v-model="formData.name"
          placeholder="姓名"
          class="w-full bg-bg-fifth/70 h-12 px-2" />
        <input
          type="email"
          v-model="formData.email"
          placeholder="邮箱"
          class="w-full bg-bg-fifth/70 h-12 px-2" />
        <input
          type="tel"
          v-model="formData.phone"
          placeholder="电话号码"
          class="w-full bg-bg-fifth/70 h-12 px-2" />
      </div>
      <!-- right -->
      <div class="w-1/3 text-lg">
        <textarea
          v-model="formData.feedback_message"
          placeholder="反馈内容"
          class="w-2/3 bg-bg-fifth/70 h-46 px-2 outline-none" />
      </div>
      <!-- 提交 -->
      <div class="w-full mt-10 text-lg">
        <input
          type="submit"
          value="提交"
          class="w-[150px] h-10 text-white bg-font-primary" />
      </div>
    </form>
    <thanks
      v-if="showThanks"
      @close="closeThanks"
      :showFeedback="showFeedback" />
  </div>
</template>
<script>
export default {
  name: 'Feedback',
};
</script>
<script setup>
import { ref } from 'vue';
import thanks from './thanks.vue';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

const showThanks = ref(false);
const formData = ref({
  user_id: '02', // 默认用户ID
  name: '',
  email: '',
  phone: '',
  feedback_message: '',
  created_at: new Date().toISOString(),
});

// 电话号码验证函数
const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 邮箱验证函数
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const handleSubmit = async () => {
  try {
    // 表单验证
    if (
      !formData.value.name ||
      !formData.value.email ||
      !formData.value.phone ||
      !formData.value.feedback_message
    ) {
      alert('请填写所有必填字段');
      return;
    }

    // 验证邮箱格式
    if (!validateEmail(formData.value.email)) {
      alert('请输入正确的邮箱地址');
      return;
    }

    // 验证电话号码格式
    if (!validatePhone(formData.value.phone)) {
      alert('请输入正确的手机号码');
      return;
    }

    // 提交数据
    await axios.post(`${API_URL}/feedback`, formData.value);

    // 显示感谢页面
    showThanks.value = true;

    // 重置表单
    formData.value = {
      user_id: '02',
      name: '',
      email: '',
      phone: '',
      feedback_message: '',
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('提交反馈失败:', error);
    alert('提交失败，请稍后重试');
  }
};

const closeThanks = () => {
  showThanks.value = false;
};

const showFeedback = () => {
  showThanks.value = false;
};
</script>
<style scoped>
input{
  outline: none;
}
textarea:focus,input:focus{
  border: 2px solid #FBE4E9;
  
}
</style>

