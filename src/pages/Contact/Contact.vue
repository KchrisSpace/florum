<template>
  <Header2 title="联系我们" subtext="contact us" />
  <div class="mb-20">
    <div>
      <!-- 联系 -->
      <div
        class="font-Alibaba mt-10 flex justify-center text-center text-font-secondary">
        <!-- 邮箱 -->
        <div class="mx-15">
          <div
            class="mb-4 border-1 rounded-full border-bg-primary w-30 h-30 flex justify-center items-center">
            <Mail color="#757575" size="54" strokeWidth="{1}" />
          </div>
          <p class="text-xl text-font-secondary">邮箱地址</p>
          <p class="text-font-secondary text-sm">xxxxxxx.163.com</p>
        </div>
        <!-- 号码 -->
        <div class="mx-15">
          <div
            class="mb-4 border-1 rounded-full border-bg-primary w-30 h-30 flex justify-center items-center">
            <Phone color="#757575" size="54" strokeWidth="{1}" />
          </div>
          <p class="text-xl text-font-secondary">手机号码</p>
          <p class="text-font-secondary text-sm">xxxxxxx.163.com</p>
        </div>
        <!-- 网站 -->
        <div class="mx-15">
          <div
            class="mb-4 border-1 rounded-full border-bg-primary w-30 h-30 flex justify-center items-center">
            <Globe color="#757575" size="54" strokeWidth="{1}" />
          </div>
          <p class="text-xl text-font-secondary">网站地址</p>
          <p class="text-font-secondary text-sm">xxxxxxx.163.com</p>
        </div>
        <!-- 营业时间 -->
        <div class="mx-15">
          <div
            class="mb-4 border-1 rounded-full border-bg-primary w-30 h-30 flex justify-center items-center">
            <CalendarDays color="#757575" size="54" strokeWidth="{1}" />
          </div>
          <p class="text-xl text-font-secondary w-36">办公时间</p>
          <p class="text-font-secondary text-sm w-36 px-1 leading-6">
            周一至周五：早上9:00至晚上18：00周末休息
          </p>
        </div>
      </div>
      <!-- 反馈 -->
      <feedback v-if="!showThanks" />
      <thanks v-if="showThanks" @close="closeThanks" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Contact',
};
</script>
<script setup>
import { ref } from 'vue';
import { Mail, Phone, CalendarDays, Globe } from 'lucide-vue-next';
import Header2 from '/src/components/Header2.vue';
import feedback from './components/feedback.vue';
import thanks from './components/thanks.vue';


const showThanks = ref(false);

const closeThanks = () => {
  showThanks.value = false;
};
</script>
<style scoped>
p {
  margin-bottom: 5px;
}
input {
  outline: none;
}
</style>
