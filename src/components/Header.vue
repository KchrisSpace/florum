<template>
  <nav class="navbar">
    <div class="navbar-left">
      <h2 @click="scrollToTop" class="cursor-pointer">「FLORUM」</h2>
    </div>

    <div @click="scrollToTop" class="navbar-center">
      <router-link to="/">首页</router-link>
      <router-link to="/store">商店</router-link>
      <router-link to="/custom">来图定制</router-link>
      <router-link to="/community">社区</router-link>
      <router-link to="/about">关于</router-link>
      <router-link to="/contact">联系我们</router-link>
      <!-- 中间内容 -->
    </div>
    <div class="navbar-right">
      <button>
        <router-link to="/search"
          ><font-awesome-icon
            :icon="['fas', 'magnifying-glass']"
            size="lg"
            style="color: #808080"
        /></router-link>
      </button>
      <div class="user-dropdown">
        <button class="user-button">
          <font-awesome-icon
            :icon="['far', 'user']"
            size="xl"
            style="color: #808080" />
        </button>
        <div class="dropdown-content">
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
          <router-link to="/user">我的账户</router-link>
          <a href="#" @click.prevent="handleLogout">退出登录</a>
        </div>
      </div>
      <button>
        <router-link to="/wishlist"
          ><font-awesome-icon
            :icon="['far', 'heart']"
            size="xl"
            style="color: #808080"
        /></router-link>
      </button>
      <button @click="toggleSidebar">
        <font-awesome-icon
          :icon="['fas', 'cart-shopping']"
          size="xl"
          style="color: #f26371" />
      </button>
    </div>
  </nav>
  <!-- 使用侧边栏组件 -->
  <SideCart :is-open="isSidebarOpen" @close="closeSidebar" />
  <button @click="scrollToTop">返回顶部</button>
</template>

<script setup>
import { ref } from 'vue';
import SideCart from './SideCart.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleLogout = () => {
  // 处理退出登录逻辑
  console.log('用户退出登录');
};

// 定义滚动到顶部的方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑滚动
  });
};
</script>

<style scoped>
@font-face {
  font-family: 'logo';
  src: url('../assets/ttf/engry-2.otf');
}
h2 {
  font-family: 'logo';
  font-size: 30px;
  margin-left: 40px;
}
a {
  text-decoration: none;
  color: #000000;
  font-family: 'Hanazono Mincho' !important;
}
.navbar {
  font-family: 'Hanazono Mincho';
  display: flex; /* 使用 Flexbox */
  align-items: center; /* 垂直居中 */
  justify-content: center;
  width: 100%;
  height: 70px; /* 设置导航栏高度 */
  background: #ffffff;
  color: #000000; /* 字体颜色 */
  padding: 0 20px;
  position: fixed;
  z-index: 1000; /* 添加 z-index 确保导航栏在最上层 */
}

.navbar-left {
  font-family: 'Hanazono';
  position: absolute;
  top: 50%;
  left: 0px;
  color: #000000;
  transform: translateY(-50%);
}

.navbar-center {
  display: flex; /* 使用 Flexbox */
  justify-content: center; /* 中间部分内容居中 */
  gap: 50px;
}

.navbar-center a {
  transition: color 0.1s ease; /* 添加颜色过渡效果 */
}

.navbar-center a:hover {
  color: #f26371; /* 鼠标悬停时的颜色 */
}
button a:hover {
  color: #f26371; /* 鼠标悬停时的颜色 */
}

.navbar-right {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  padding-right: 20px;
}

button {
  padding: 0 10px; /* 按钮之间的间距 */
  /* 按钮背景色 */
  border: none; /* 去掉边框 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  background: none;
}

button:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}
h2 {
  color: black;
}

.user-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 4px;
  padding: 8px 0;
}

.user-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 14px;
}

.dropdown-content a:hover {
  background-color: #f5f5f5;
  color: #f26371;
}

.user-button {
  padding: 0 10px;
}
</style>
