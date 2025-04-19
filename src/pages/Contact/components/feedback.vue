<template>
  <div class="font-Alibaba">
    <h1 class="text-center">反馈</h1>
    <form class="flex justify-center my-10 flex-wrap" v-if="!showThanks">
      <!-- left -->
      <div class="w-1/3 h-46 px-10 flex flex-col justify-between">
        <input
          type="text"
          placeholder="姓名"
          class="w-full bg-bg-fifth/70 h-12 px-2" />
        <input
          type="email"
          placeholder="邮箱"
          class="w-full bg-bg-fifth/70 h-12 px-2" />
        <input
          type="tel"
          placeholder="电话号码"
          class="w-full bg-bg-fifth/70 h-12 px-2" />
      </div>
      <!-- right -->
      <div class="w-1/3 text-lg">
        <textarea
          placeholder="反馈内容"
          class="w-2/3 bg-bg-fifth/70 h-46 px-2 outline-none" />
      </div>
      <!-- 提交 -->
      <div class="w-full mt-10 text-lg">
        <input
          @click.prevent="showThanks = true"
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

const showThanks = ref(false); // 响应式状态

const closeThanks = () => {
  showThanks.value = false;
};

const showFeedback = () => {
  showThanks.value = false;
};
</script>
