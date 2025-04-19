<!-- 管理员页面 -->
<template>
  <div class="admin-page">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="logo">
        <h2>Florum Admin</h2>
      </div>
      <nav>
        <router-link to="/admin/dashboard" class="nav-item">
          <el-icon><DataLine /></el-icon>
          <span>数据概览</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </router-link>
        <router-link to="/admin/orders" class="nav-item">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </router-link>
        <router-link to="/admin/categories" class="nav-item">
          <el-icon><Files /></el-icon>
          <span>分类管理</span>
        </router-link>
      </nav>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="user-info">
          <el-dropdown>
            <span class="user-dropdown">
              管理员
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleProfile"
                  >个人信息</el-dropdown-item
                >
                <el-dropdown-item @click="handleLogout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 路由视图 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  DataLine,
  User,
  Goods,
  List,
  Files,
  CaretBottom,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();

const currentRoute = computed(() => {
  return route.meta.title || "首页";
});

// 获取当前登录用户信息
const currentUser = ref(null);

onMounted(() => {
  // 从本地存储获取用户信息
  const userJson = localStorage.getItem("currentUser");
  if (userJson) {
    currentUser.value = JSON.parse(userJson);

    // 检查是否是管理员
    if (
      !currentUser.value ||
      (currentUser.value.role !== "admin" &&
        currentUser.value.username !== "admin")
    ) {
      // 不是管理员，跳转到登录页
      ElMessage.error("您没有管理员权限");
      router.push("/login");
    }
  } else {
    // 未登录，跳转到登录页
    router.push("/login");
  }
});

const handleProfile = () => {
  router.push("/admin/profile");
};

const handleLogout = () => {
  // 实现登出逻辑
  localStorage.removeItem("currentUser");
  router.push("/login");
};
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #304156;
  color: #fff;
  padding: 20px 0;
}

.logo {
  padding: 0 20px;
  margin-bottom: 30px;
}

.logo h2 {
  margin: 0;
  font-size: 20px;
  text-align: center;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #263445;
}

.nav-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-dropdown .el-icon {
  margin-left: 5px;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
}
</style>
