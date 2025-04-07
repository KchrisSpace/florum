<template>
  <nav class="navbar">
    <div class="navbar-left">
      <h2>【florum】</h2>
      <!-- 左侧内容 -->
    </div>
    <div class="navbar-center">
      <router-link to="/">首页</router-link>
      <router-link to="/">分类</router-link>
      <router-link to="/">社区</router-link>
      <router-link to="/">我的</router-link>
      <router-link to="/">关于我们</router-link>
      <!-- 中间内容 -->
    </div>
    <div class="navbar-right">
      <button><router-link to="/search">搜索</router-link></button>
      <button><router-link to="/login">登陆</router-link></button>
      <button><router-link to="/wishlist">心愿单</router-link></button>
      <button @click="toggleSidebar">购物车</button>
    </div>
  </nav>
  <!-- 使用侧边栏组件 -->
  <SideCart :is-open="isSidebarOpen" @close="closeSidebar" />
</template>

<script setup>
import { ref } from "vue";
import SideCart from "./SideCart.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
a {
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
  position: relative;
  z-index: 1000;
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
  background: none;
  padding: 8px 12px;
}

button:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
