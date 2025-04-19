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
              <el-icon
                ><ArrowUp v-if="statistics.userGrowth > 0" /><ArrowDown v-else
              /></el-icon>
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
          <div class="card-value">
            ¥{{ formatNumber(statistics.totalRevenue) }}
          </div>
          <div class="card-footer">
            <span>今日收入</span>
            <span>¥{{ formatNumber(statistics.todayRevenue) }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="salesChartRef" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>商品分类占比</span>
            </div>
          </template>
          <div class="chart-container">
            <div ref="categoryChartRef" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import {
  User,
  ShoppingCart,
  Goods,
  Money,
  ArrowUp,
  ArrowDown,
} from "@element-plus/icons-vue";
import * as echarts from "echarts";

// 统计数据
const statistics = ref({
  totalUsers: 1234,
  userGrowth: 5.2,
  totalOrders: 8765,
  todayOrders: 123,
  totalProducts: 456,
  activeProducts: 398,
  totalRevenue: 123456.78,
  todayRevenue: 12345.67,
});

// 时间范围选择
const timeRange = ref("week");

// 格式化数字
const formatNumber = (num) => {
  return num.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 销售趋势图配置
const salesChartOption = ref({
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "销售额",
      type: "line",
      smooth: true,
      data: [3000, 4500, 5000, 7000, 6500, 8000, 9000],
      areaStyle: {
        opacity: 0.1,
      },
      lineStyle: {
        width: 3,
      },
    },
  ],
});

// 商品分类占比图配置
const categoryChartOption = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    right: 10,
    top: "center",
  },
  series: [
    {
      name: "商品分类",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "14",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "鲜花" },
        { value: 735, name: "绿植" },
        { value: 580, name: "花艺" },
        { value: 484, name: "礼品" },
        { value: 300, name: "其他" },
      ],
    },
  ],
});

// 图表实例引用
const salesChartRef = ref(null);
const categoryChartRef = ref(null);
let salesChart = null;
let categoryChart = null;

// 获取统计数据
const fetchStatistics = async () => {
  try {
    // TODO: 调用后端API获取实际数据
    // const response = await fetch('/api/statistics')
    // statistics.value = await response.json()
  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

// 初始化图表
const initCharts = () => {
  // 销售趋势图
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value);
    salesChart.setOption(salesChartOption.value);
  }

  // 商品分类占比图
  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value);
    categoryChart.setOption(categoryChartOption.value);
  }
};

// 监听时间范围变化，更新销售趋势图
watch(timeRange, () => {
  // 这里可以根据时间范围更新数据
  // 模拟不同时间范围的数据
  if (timeRange.value === "week") {
    salesChartOption.value.xAxis.data = [
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
      "周日",
    ];
    salesChartOption.value.series[0].data = [
      3000, 4500, 5000, 7000, 6500, 8000, 9000,
    ];
  } else if (timeRange.value === "month") {
    salesChartOption.value.xAxis.data = ["第1周", "第2周", "第3周", "第4周"];
    salesChartOption.value.series[0].data = [20000, 25000, 30000, 35000];
  } else {
    salesChartOption.value.xAxis.data = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];
    salesChartOption.value.series[0].data = [
      30000, 28000, 35000, 40000, 42000, 50000, 55000, 60000, 65000, 70000,
      75000, 80000,
    ];
  }

  // 更新图表
  if (salesChart) {
    salesChart.setOption(salesChartOption.value);
  }
});

// 监听窗口大小变化，调整图表大小
const resizeCharts = () => {
  if (salesChart) {
    salesChart.resize();
  }
  if (categoryChart) {
    categoryChart.resize();
  }
};

onMounted(() => {
  fetchStatistics();

  // 初始化图表
  initCharts();

  // 添加窗口大小变化监听
  window.addEventListener("resize", resizeCharts);
});

// 组件卸载时，移除事件监听并销毁图表实例
onUnmounted(() => {
  window.removeEventListener("resize", resizeCharts);
  if (salesChart) {
    salesChart.dispose();
  }
  if (categoryChart) {
    categoryChart.dispose();
  }
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  height: 180px;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.card-header .icon {
  margin-right: 8px;
  font-size: 20px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0;
  color: #303133;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 14px;
}

.card-footer .up {
  color: #67c23a;
}

.chart-row {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 350px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
