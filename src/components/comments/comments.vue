<template>
  <div class="flex flex-col justify-center px-60">
   
    <div class="font-Alibaba text-base w-52 flex justify-between items-end">
      <span class="text-3xl text-black"
        >评论<span class="text-font-thirth text-lg ml-1">10</span></span
      >
      <span class="text-black">最热</span>
      <div class="inline-block h-6 w-0.5 bg-font-primary"></div>
      <span class="text-font-thirth">最新</span>
    </div>
    <!-- 发条评论吧 -->
    <div class="flex justify-start items-center my-6">
      <!-- 头像 -->
      <div class="bg-font-primary w-18 h-18 rounded-full"></div>
      <div class="grow mx-2 flex justify-start">
        <input
          type="text"
          placeholder="评论千万条，等你发一条"
          class="outline-none bg-bg-fifth rounded-sm h-10 py-2 px-2 w-2/3" />
      </div>
    </div>
   
   
     <!-- 用户评论 -->
     <usersComments />
    <usersComments />
    <usersComments />
    <usersComments />
  
  </div>
</template>
<script>
export default {
  name: 'Comments',
};
</script>
<script setup>
import usersComments from './users-comments.vue';
</script>
