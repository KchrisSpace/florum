<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><User /></el-icon>
              <span>总用户数</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.totalUsers }}</div>
          <div class="card-footer">
            <span>日增长</span>
            <span :class="{ up: statistics.userGrowth > 0 }">
              {{ statistics.userGrowth }}%
              <el-icon><ArrowUp v-if="statistics.userGrowth > 0" /><ArrowDown v-else /></el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><ShoppingCart /></el-icon>
              <span>总订单数</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.totalOrders }}</div>
          <div class="card-footer">
            <span>今日订单</span>
            <span>{{ statistics.todayOrders }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Goods /></el-icon>
              <span>商品总数</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.totalProducts }}</div>
          <div class="card-footer">
            <span>上架中</span>
            <span>{{ statistics.activeProducts }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><Money /></el-icon>
              <span>总收入</span>
            </div>
          </template>
          <div class="card-value">¥{{ formatNumber(statistics.totalRevenue) }}</div>
          <div class="card-footer">
            <span>今日收入</span>
            <span>¥{{ formatNumber(statistics.todayRevenue) }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row
      :gutter="20"
      class="chart-row"
    >
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header chart-header">
              <span class="chart-title">销售趋势</span>
              <el-radio-group
                v-model="timeRange"
                size="small"
                class="chart-radio-group"
              >
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div
              ref="salesChartRef"
              class="chart"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import axios from 'axios';
import { API_URL } from '../../pages/const';
import * as echarts from 'echarts';

const statistics = reactive({
  totalUsers: 0,
  userGrowth: 0,
  totalOrders: 0,
  todayOrders: 0,
  totalProducts: 0,
  activeProducts: 0,
  totalRevenue: 0,
  todayRevenue: 0,
});

const timeRange = ref('week');
const salesChartRef = ref(null);
let salesChartInstance = null;
const salesData = ref([]); // 用于存放处理后的趋势数据
let allOrders = []; // 存储全部订单数据

function formatNumber(num) {
  return num?.toLocaleString?.() ?? num;
}

// 获取统计数据
async function fetchStatistics() {
  // 获取用户
  const usersRes = await axios.get(`${API_URL}/users`);
  statistics.totalUsers = usersRes.data.data.length;
  // 获取订单
  const ordersRes = await axios.get(`${API_URL}/normal_orders`);
  const orders = ordersRes.data;
  statistics.totalOrders = orders.length;

  // 今日订单和收入
  const today = new Date().toISOString().slice(0, 10);
  statistics.todayOrders = orders.filter((o) => o.created_at?.slice(0, 10) === today).length;
  statistics.totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
  statistics.todayRevenue = orders
    .filter((o) => o.created_at?.slice(0, 10) === today)
    .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  // 获取商品
  const productsRes = await axios.get(`${API_URL}/product_list`);
  const products = productsRes.data;
  statistics.totalProducts = products.length;
  statistics.activeProducts = products.filter((p) => p.status === '上架').length;

  // 保存订单数据用于趋势分析
  allOrders = orders;
  updateSalesData();
}

// 监听 timeRange 变化，更新趋势数据
watch(timeRange, updateSalesData);

function updateSalesData() {
  if (!allOrders.length) return;
  let data = [];
  let labels = [];
  const now = new Date();

  if (timeRange.value === 'week') {
    // 本周
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d;
    });
    labels = weekDays.map((d) => d.toISOString().slice(5, 10));
    data = weekDays.map((d) => {
      const dayStr = d.toISOString().slice(0, 10);
      return allOrders
        .filter((o) => o.created_at?.slice(0, 10) === dayStr)
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);
    });
  } else if (timeRange.value === 'month') {
    // 本月
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    labels = Array.from({ length: days }, (_, i) => (i + 1).toString().padStart(2, '0'));
    data = labels.map((day) => {
      const dayStr = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${day}`;
      return allOrders
        .filter((o) => o.created_at?.slice(0, 10) === dayStr)
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);
    });
  } else if (timeRange.value === 'year') {
    // 全年
    labels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
    data = labels.map((_, i) => {
      const monthStr = `${now.getFullYear()}-${(i + 1).toString().padStart(2, '0')}`;
      return allOrders
        .filter((o) => o.created_at?.slice(0, 7) === monthStr)
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);
    });
  }

  salesData.value = { labels, data };
  renderSalesChart();
}

function renderSalesChart() {
  if (!salesChartRef.value) return;
  if (!salesChartInstance) {
    salesChartInstance = echarts.init(salesChartRef.value);
  }
  const { labels, data } = salesData.value;
  salesChartInstance.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value' },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: data,
        smooth: true,
        areaStyle: {},
        color: '#409EFF',
      },
    ],
  });
}

onMounted(() => {
  fetchStatistics();
  window.addEventListener('resize', () => {
    salesChartInstance && salesChartInstance.resize();
  });
});
</script>

<style scoped>
.dashboard {
  padding: 24px 32px;
  background: #f6f8fa;
  min-height: 100vh;
}

.stat-card {
  height: 180px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding-bottom: 4px;
}
.card-header .icon {
  margin-right: 8px;
  font-size: 22px;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  margin: 24px 0 18px 0;
  color: #222;
  letter-spacing: 1px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}
.card-footer .up {
  color: #67c23a;
}
.card-footer .down {
  color: #f56c6c;
}

.chart-row {
  margin-top: 28px;
}

.chart-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}
.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0;
}
.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
}
.chart-radio-group {
  margin-left: 16px;
}

.chart-container {
  height: 360px;
  background: #fff;
  border-radius: 8px;
  padding: 16px 8px 8px 8px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 320px;
}
</style>
