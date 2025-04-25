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
      <button>退出登录</button>
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
import { ref } from 'vue';
import Header from '/src/components/Header.vue';
import UserDetails from './components/user-details.vue';
import UserAddress from './components/user-address/user-address.vue';
import UserOrders from './components/user-orders.vue';
const currentView = ref('UserDetails');
const selectedButton = ref('UserDetails');
function changeView(view) {
  currentView.value = view;
  selectedButton.value = view;
  // console.log(currentView.value);
}
</script>
<style scoped>
button {
  padding: 10px 0;
  padding-left: 20px;
  width: 100%;
  transition: color 0.3s;
  text-align: left;
  border-radius: 4px;
}
.selected {
  color: #f26371;
 background: rgba(251, 228, 233, 0.6);
  
}
button:hover{
  background: rgba(251, 228, 233, 0.6);
}

</style>
