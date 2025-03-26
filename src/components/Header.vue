<template>
  <nav class="navbar">
    <div class="navbar-left">
      <h2>【florum】</h2>
      <!-- 左侧内容 -->
    </div>
    <div class="navbar-center" >
      <router-link to="/">首页</router-link>
      <router-link to="/">分类</router-link>
      <router-link to="/">社区</router-link>
      <router-link to="/">我的</router-link>
      <router-link to="/">关于我们</router-link>
      <!-- 中间内容 -->
    </div>
    <div class="navbar-right">
      <button><router-link to="/login">登录</router-link></button>
      <button><router-link to="/register">注册</router-link></button>
      <button><router-link to="/cart">购物车</router-link></button>
      <button><router-link to="/collect">收藏</router-link></button>
    </div>
  </nav>
</template>

<script setup>

// 这里可以添加任何需要的逻辑
</script>

<style scoped>
a{
    text-decoration: none;
    color: rgb(67, 58, 58);
}
.navbar {
  display: flex; /* 使用 Flexbox */
  align-items: center; /* 垂直居中 */
  height: 60px; /* 设置导航栏高度 */
  background-color: #ffffff; /* 导航栏背景色 */
  color: rgb(67, 58, 58); /* 字体颜色 */
  padding: 0 20px; /* 左右内边距 */
}

.navbar-left {
  flex: 0 0 auto; /* 左侧部分不占用剩余空间 */
}

.navbar-center {
  flex: 1; /* 中间部分占据剩余空间 */
  display: flex; /* 使用 Flexbox */
  justify-content: center; /* 中间部分内容居中 */
  gap: 30px;
}

.navbar-right {
  flex: 0 0 auto; /* 右侧部分不占用剩余空间 */
}

button {
  margin-left: 10px; /* 按钮之间的间距 */
 /* 按钮背景色 */
  color: rgb(45, 44, 44); /* 按钮字体颜色 */
  border: none; /* 去掉边框 */
 
  cursor: pointer; /* 鼠标悬停时显示手型 */
}

button:hover {
  background-color: #847373; /* 鼠标悬停时按钮颜色变化 */
}
</style>
