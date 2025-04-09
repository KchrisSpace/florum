<template>
<div class="mt-20 py-10 flex justify-center mx-10 border-t-1 border-bg-primary">
  <!-- 左侧菜单栏 -->
<div class="flex flex-col border-1 h-full border-bg-primary font-Alibaba text-font-secondary text-2xl px-4 py-2">
  <button>账户详情</button>
  <button>订单</button>
  <button>地址</button>
  <button>退出登录</button>
</div>
<!-- 右侧显示内容 -->
<div class="w-2/3 h-screen px-10">
  <!-- 个人信息 -->
  <div>
    <div class="flex flex-col w-20 mx-6"> <div class="w-20 h-20 bg-font-primary rounded-full"></div><p class="text-center">更换头像</p></div>
    <div>
      <label for="">昵称：</label> <input type="text" class="bg-bg-fifth/60 h-8">
      <label for="sex">性别：</label> <input type="radio" name="sex">男</input><input type="radio" name="sex">女</input>
    </div>
  </div>
  <!-- 修改密码 -->
  <div></div>
  <!-- 保存更改 -->
  <div></div>
</div>
</div>
</template>
<script>
export default {
  name: 'User',
}
</script>
<style scoped>
button{
  padding: 10px 0;
}
input{
  outline: none;
}
</style>