<template>
  <Header2
    title="来图定制"
    subtext="Customize according to provided pictures" />
  <div class="mx-20 mt-10 flex justify-around font-Harmony">
    <!-- left -->
    <div
      class="w-1/3 flex flex-col justify-between items-center"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop">
      <div
        class="w-full border-2 border-[#FBE4E9] h-76 rounded-2xl flex flex-col justify-center items-cente">
        <div class="image-upload overflow-y-auto">
          <input
            ref="fileInput"
            type="file"
            @change="onFileChange"
            accept="image/*"
            multiple
            style="display: none" />
          <div
            v-if="imageUrls.length"
            class="image-preview flex flex-wrap flex-col">
            <div
              v-for="(url, index) in imageUrls"
              :key="index"
              class="relative inline-block my-6">
              <img
                :src="url"
                alt="Image Preview"
                class="h-36 object-cover w-full cursor-pointer" />
              <div
                class="absolute top-0 right-2 text-shadow-lg text-black/60 text-2xl z-50 cursor-pointer hover:text-red-500"
                @click.stop="clearImage(index)">
                x
              </div>
            </div>
          </div>
          <div class="opacity-20" v-else @click="triggerFileInput">
            <ImageUp class="w-36 h-36 object-cover cursor-pointer" />
            <p class="font-light">拖放图片至此处</p>
          </div>
        </div>
      </div>
      <button
        @click="triggerFileInput"
        class="w-36 h-10 bg-font-primary text-white text-center">
        上传图片
      </button>
    </div>
    <!-- right -->
    <div class="w-1/3">
      <form
        class="text-left text-xl font-light space-y-6"
        @submit.prevent="handleSubmit">
        <div class="flex items-center">
          <label>邮箱：</label>
          <input
            type="email"
            v-model="formData.email"
            class="grow shrink border-b-2 border-[#FBE4E9] focus:border-pink-300 transition-colors"
            placeholder="请输入邮箱地址" />
        </div>

        <div class="flex items-center">
          <label>号码：</label>
          <input
            type="tel"
            v-model="formData.phone"
            class="grow shrink border-b-2 border-[#FBE4E9] focus:border-pink-300 transition-colors"
            placeholder="请输入联系电话" />
        </div>

        <div>
          <label class="block mb-2">备注信息：</label>
          <textarea
            v-model="formData.custom_message"
            class="w-full px-4 py-2 border-2 border-[#FBE4E9] rounded-lg h-40 resize-none focus:border-pink-300 transition-colors"
            placeholder="请输入备注信息"></textarea>
        </div>

        <div class="w-full flex justify-center">
          <button
            type="submit"
            class="bg-font-primary text-white w-36 h-12 hover:bg-opacity-90 transition-colors">
            提交
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Custom',
};
</script>

<script setup>
import { ImageUp } from 'lucide-vue-next';
import Header2 from '/src/components/Header2.vue';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

const imageUrls = ref([]);
const fileInput = ref(null);
const formData = ref({
  user_id: '02',
  custom_img: '',
  email: '',
  phone: '',
  custom_message: '',
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
      !formData.value.email ||
      !formData.value.phone ||
      !formData.value.custom_message
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

    // 如果有上传图片，将第一张图片作为 custom_img
    if (imageUrls.value.length > 0) {
      formData.value.custom_img = imageUrls.value[0];
    }

    // 提交数据
    await axios.post(`${API_URL}/custom`, formData.value);

    // 提交成功后重置表单
    formData.value = {
      user_id: '02',
      custom_img: '',
      email: '',
      phone: '',
      custom_message: '',
      created_at: new Date().toISOString(),
    };
    imageUrls.value = [];
    fileInput.value.value = '';

    alert('提交成功！');
  } catch (error) {
    console.error('提交定制信息失败:', error);
    alert('提交失败，请稍后重试');
  }
};

const onFileChange = (event) => {
  const files = Array.from(event.target.files);
  readFiles(files);
};

const onDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  readFiles(files);
};

const readFiles = (files) => {
  const promises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  Promise.all(promises)
    .then((results) => {
      imageUrls.value.push(...results);
    })
    .catch((error) => {
      console.error('Error reading files:', error);
    });
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const clearImage = (index) => {
  imageUrls.value.splice(index, 1);
  fileInput.value.value = '';
};

const onDragOver = (event) => {
  event.currentTarget.style.borderColor = '#F26371';
};

const onDragLeave = (event) => {
  event.currentTarget.style.borderColor = '#FBE4E9';
};
</script>

<style scoped>
input,
textarea {
  outline: none;
  background-color: white;
}

input:focus,
textarea:focus {
  outline: none;
}
input::placeholder,
textarea::placeholder {
  color: #ccc;
  font-size: 16px;
}
button {
  border-radius: 7px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-preview {
  margin-top: 10px;
}
</style>
