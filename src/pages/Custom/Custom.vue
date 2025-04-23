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
                class="w-36 h-36 object-cover w-full cursor-pointer" />
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
      <form class="text-left text-xl font-light space-y-6">
        <div class="flex items-center">
          <label>邮箱：</label>
          <input
            type="email"
            class="grow shrink border-b-2 border-[#FBE4E9] focus:border-pink-300 transition-colors"
            placeholder="请输入邮箱地址" />
        </div>

        <div class="flex items-center">
          <label>号码：</label>
          <input
            type="tel"
            class="grow shrink border-b-2 border-[#FBE4E9] focus:border-pink-300 transition-colors"
            placeholder="请输入联系电话" />
        </div>

        <div>
          <label class="block mb-2">备注信息：</label>
          <textarea
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

const imageUrls = ref([]);
const fileInput = ref(null);

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
