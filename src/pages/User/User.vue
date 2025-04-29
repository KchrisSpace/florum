<template>
  <Header />
  <div
    class="pt-30 flex justify-between px-40 border-t-2 bg-[#f2f3f5] border-bg-primary font-Alibaba">
    <!-- 左侧菜单栏 -->
    <div
      class="w-60 flex flex-col bg-white text-font-secondary text-xl px-2 py-6 z-50">
      <button
        :class="{ selected: selectedButton === 'UserDetails' }"
        @click="changeView('UserDetails')">
        账户详情
      </button>
      <button
        :class="{ selected: selectedButton === 'UserOrders' }"
        @click="changeView('UserOrders')">
        订单
      </button>
      <button
        :class="{ selected: selectedButton === 'UserAddress' }"
        @click="changeView('UserAddress')">
        地址
      </button>
      <button @click="handleLogout">退出登录</button>
    </div>
    <!-- 右侧显示内容 -->
    <div class="w-full ml-10 h-screen pb-10 px-4 bg-white overflow-y-scroll">
      <!-- <UserDetails/> -->
      <UserDetails v-if="currentView === 'UserDetails'" />
      <UserAddress v-if="currentView === 'UserAddress'" />
      <UserOrders v-if="currentView === 'UserOrders'" />
      <!-- <UserOrders/> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'User',
};
</script>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '/src/components/Header.vue';
import UserDetails from './components/user-details.vue';
import UserAddress from './components/user-address/user-address.vue';
import UserOrders from './components/user-orders.vue';

const router = useRouter();
const route = useRoute();
const currentView = ref('UserDetails');
const selectedButton = ref('UserDetails');

// 根据路由参数初始化选中的按钮
onMounted(() => {
  const view = route.query.view || 'UserDetails';
  selectedButton.value = view;
  currentView.value = view;
});

// 切换视图
const changeView = (view) => {
  selectedButton.value = view;
  currentView.value = view;
  router.push({
    path: '/user',
    query: { view },
  });
};

// 处理退出登录
const handleLogout = () => {
  // 清除用户信息
  localStorage.removeItem('currentUser');
  // 跳转到登录页
  router.push('/login');
};
</script>
<style scoped>
button {
  padding: 10px;
  text-align: left;
  transition: all 0.3s ease;
}
.selected {
  color: #f26371;
  font-weight: bold;
}
button:hover {
  color: #f26371;
}
</style>
