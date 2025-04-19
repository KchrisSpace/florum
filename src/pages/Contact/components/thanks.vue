<template>
  <div
    class="relative w-1/3 h-46 bg-font-primary my-10 mx-auto flex items-center px-10 rounded-lg">
    <h4 class="text-white text-center w-full">
      提交成功！我们很高兴收到您的建议！
    </h4>
    <!-- 关闭按钮 -->
    <div class="absolute right-0 top-0 flex justify-center items-center">
      <el-icon
        size="24"
        color="#fff"
        class="cursor-pointer font-bold"
        @click="$emit('close')"
        ><Close
      /></el-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Thanks',
};
</script>
<script setup>
</script>
