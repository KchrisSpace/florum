<template>
  <Header2
    title="来图定制"
    subtext="Customize according to provided pictures" />
  <div class="mx-20 mt-10 flex justify-around font-Harmony">
    <!-- left -->
    <div class="w-1/3 flex flex-col justify-between items-center">
      <div class="w-full border-2 border-[#FBE4E9] h-76 rounded-2xl flex flex-col justify-center items-center"><ImageUp size="80" color="#bfbfbf"/><p class="font-light">拖放图片至此处</p></div>
      <button class="w-36 h-10 bg-font-primary text-white text-center">上传图片</button>
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
        </button></div>
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
textarea::placeholder
 {
  color: #ccc;
  font-size: 16px;
}
button{
  border-radius: 7px;
}
</style>
