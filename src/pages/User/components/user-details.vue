<template>
 <form class="w-full">
    <!-- 个人信息 -->
  <div class="flex items-center pt-10">
      <!-- 头像 -->
    <div class="flex flex-col w-20 mr-6"> 
    <div class="w-20 h-20 bg-font-primary rounded-full">
    </div>
    <p class="text-center mb-0 mt-2">更换头像</p>
  
  </div>
  <!-- 昵称 -->
  <div class="flex flex-col ml-2 text-left w-full text-lg">
      <div class=""><label for="">昵称：</label> <input type="text" class="bg-bg-fifth/60 h-8 w-3/5"></div>
      <div class="mt-3"><label for="sex" class="mr-4">性别：</label> <input type="radio" name="sex" class="mx-2">男</input><input type="radio" name="sex" class="mx-2">女</input></div>
    </div>
  </div>
  <!-- 修改密码 -->
  <div class="border-t-1 border-b-1 border-bg-primary text-left py-4 mt-14 ">
    <h4 class="mb-4">修改密码</h4>
  <div class="my-2">
    <label for="">当前密码：</label><br> <input type="text" class="bg-bg-fifth/60 h-8 w-2/3"></input>
  </div>
  <div class="my-2">
    <label for="">新密码：</label><br> <input type="text" class="bg-bg-fifth/60 h-8 w-2/3"></input>
  </div>
  <div class="my-2">
    <label for="">确认新密码：</label><br> <input type="text" class="bg-bg-fifth/60 h-8 w-2/3"></input>
  </div>
  </div>
 
  <!-- 保存更改 -->
  <div class="w-[120px]">
    <input type="submit" value="保存更改" class="bg-font-primary text-white text-lg mt-4 w-full" />
  </div>
</form>
</template>
<script>
export default {
  name: 'UserDetails'
}
</script>

<style scoped>

input{
  outline: none;
  padding: 10px;
}
</style>