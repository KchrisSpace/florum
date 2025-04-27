<template>
  <h2 class="text-center w-full pb-2 pt-10">订单</h2>
  <table class="w-full px-2 text-sm">
    <thead>
      <tr>
        <th>订单编号</th>
        <th>日期</th>
        <th>状态</th>
        <th>总计</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ formatDate(order.created_at) }}</td>
        <td>{{ order.status }}</td>
        <td>￥{{ calcTotal(order.items) }}</td>
        <td>
          <button><span @click="goToDetail(order.items[0]?.product_id)">查看详情</span> <span @click="deleteOrder(order.id)" class="ml-2">删除</span></button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'UserOrders',
};
</script>
<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNormalOrdersStore } from '/src/stores/normal-orders';

const router = useRouter();
const normalOrdersStore = useNormalOrdersStore();

// 获取订单数据
onMounted(async () => {
  await normalOrdersStore.fetchOrders();
});

// 订单列表
const orders = computed(() => normalOrdersStore.orders);

// 删除订单
function deleteOrder(orderId) {
  normalOrdersStore.deleteOrder(orderId);
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 计算订单总价
function calcTotal(items) {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce(
    (sum, item) => sum + item.single_price * item.quantity,
    0
  );
}

// 跳转到商品详情（可根据实际需求调整）
function goToDetail(productId) {
  router.push({
    name: 'ProductDetails',
    params: { id: productId },
  });
}
</script>
<style scoped>
td,
th {
  border-bottom: 1px solid #e5e5e5;
  padding: 16px;
}
th {
  font-size: 18px;
}
span:hover {
  color: #f26371;
}
</style>
