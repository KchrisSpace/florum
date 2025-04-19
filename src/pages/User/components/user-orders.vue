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
      <tr v-for="order in orderList" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ order.time }}</td>
        <td>{{ order.status }}</td>
        <td>{{ order.total }}</td>
        <td>
          <button @click="goToCart(order.id)">{{ order.operation }}</button>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const orderList = ref([
  {
    id: 1,
    time: '2022-01-01',
    status: '进行中',
    total: '￥100',
    operation: '查看购物车',
  },
  {
    id: 2,
    time: '2022-01-01',
    status: '已完成',
    total: '￥100',
    operation: '查看购物车',
  },
  {
    id: 3,
    time: '2022-01-01',
    status: '已取消',
    total: '￥100',
    operation: '查看购物车',
  },
  {
    id: 4,
    time: '2022-01-01',
    status: '待付款',
    total: '￥100',
    operation: '查看购物车',
  },
  {
    id: 5,
    time: '2022-01-01',
    status: '待发货',
    total: '￥100',
    operation: '查看购物车',
  },
]);

const goToCart = (orderId) => {
  router.push({ name: 'Cart', params: { id: orderId } });
};
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
button:hover{
color:#F26371;
}
</style>
