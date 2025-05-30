<template>
  <div class="orders-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable>
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <el-button-group>
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>导出订单
            </el-button>
            <el-button type="success" @click="handleBatchShip">
              <el-icon><Van /></el-icon>批量发货
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-table
        :data="orderList"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="total_price" label="订单金额">
          <template #default="{ row }">
            ¥{{ formatNumber(row.total_price) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template #default="{ row }">
            <el-select v-model="row.status" @change="handleStatusChange(row)">
              <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleDetail(row)">
                详情
              </el-button>
              <el-button type="info" size="small" @click="handleUserInfo(row)">
                用户信息
              </el-button>
              <el-button
                v-if="row.status === '进行中'"
                type="success"
                size="small"
                @click="handleShip(row)">
                发货
              </el-button>
              <el-button
                v-if="row.status === '进行中'"
                type="danger"
                size="small"
                @click="handleCancel(row)">
                取消
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="订单详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{
          currentOrder.id
        }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{
          currentOrder.created_at
        }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          currentOrder.username
        }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ currentOrder.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="收货人">{{
          currentOrder.user_info?.address
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          currentOrder.user_info?.phone
        }}</el-descriptions-item>
      </el-descriptions>

      <el-table :data="currentOrder.items" style="margin-top: 20px">
        <el-table-column prop="product_name" label="商品名称" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.product_image"
              :preview-src-list="[row.product_image]"
              fit="cover"
              style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column prop="single_price" label="单价">
          <template #default="{ row }">
            ¥{{ formatNumber(row.single_price) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column label="小计">
          <template #default="{ row }">
            ¥{{ formatNumber(row.single_price * row.quantity) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="order-total">
        <span>订单总额：</span>
        <span class="amount"
          >¥{{ formatNumber(currentOrder.total_price) }}</span
        >
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用户信息对话框 -->
    <el-dialog v-model="userInfoDialogVisible" title="用户信息" width="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">
          {{ currentUser.username }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentUser.user_info?.email }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ currentUser.user_info?.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ currentUser.user_info?.address }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userInfoDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog v-model="shipDialogVisible" title="订单发货" width="500px">
      <el-form
        ref="shipFormRef"
        :model="shipForm"
        :rules="shipRules"
        label-width="100px">
        <el-form-item label="物流公司" prop="company">
          <el-select v-model="shipForm.company" placeholder="请选择物流公司">
            <el-option label="顺丰快递" value="SF" />
            <el-option label="中通快递" value="ZTO" />
            <el-option label="圆通快递" value="YTO" />
            <el-option label="韵达快递" value="YD" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="trackingNo">
          <el-input
            v-model="shipForm.trackingNo"
            placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shipDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitShipment">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { Search, Refresh, Download, Van } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 订单状态选项
const orderStatus = [
  { value: '进行中', label: '进行中' },
  { value: '已完成', label: '已完成' },
  { value: '已取消', label: '已取消' },
];

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  username: '',
  status: '',
  dateRange: [],
});

// 订单列表数据
const orderList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedOrders = ref([]);

// 订单详情
const detailDialogVisible = ref(false);
const currentOrder = ref({});

// 用户信息
const userInfoDialogVisible = ref(false);
const currentUser = ref({});

// 发货表单
const shipDialogVisible = ref(false);
const shipFormRef = ref(null);
const shipForm = reactive({
  company: '',
  trackingNo: '',
  orderId: '',
});

const shipRules = {
  company: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
  trackingNo: [
    { required: true, message: '请输入物流单号', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
  ],
};

// 格式化数字
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0.00';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 获取状态标签类型
const getStatusType = (status) => {
  const map = {
    进行中: 'warning',
    已完成: 'success',
    已取消: 'danger',
  };
  return map[status] || 'info';
};

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:3000/normal_orders');
    if (!response.ok) {
      throw new Error(
        `获取订单列表失败: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('获取到的订单数据:', data);

    // 确保数据是数组
    if (!Array.isArray(data)) {
      console.error('返回的数据不是数组:', data);
      orderList.value = [];
      total.value = 0;
      return;
    }

    // 应用搜索过滤
    let filteredData = data;
    if (searchForm.orderNo) {
      filteredData = filteredData.filter((order) =>
        order.id.toLowerCase().includes(searchForm.orderNo.toLowerCase())
      );
    }
    if (searchForm.username) {
      filteredData = filteredData.filter((order) =>
        order.username.toLowerCase().includes(searchForm.username.toLowerCase())
      );
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(
        (order) => order.status === searchForm.status
      );
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const [startDate, endDate] = searchForm.dateRange;
      filteredData = filteredData.filter((order) => {
        const orderDate = order.created_at?.split('T')[0] || '';
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // 分页处理
    total.value = filteredData.length;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    orderList.value = filteredData.slice(start, end);
  } catch (error) {
    console.error('获取订单列表失败:', error);
    ElMessage.error(error.message || '获取订单列表失败');
    orderList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchOrderList();
};

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = key === 'dateRange' ? [] : '';
  });
  handleSearch();
};

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchOrderList();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchOrderList();
};

// 多选处理
const handleSelectionChange = (val) => {
  selectedOrders.value = val;
};

// 查看订单详情
const handleDetail = (row) => {
  currentOrder.value = { ...row };
  detailDialogVisible.value = true;
};

// 查看用户信息
const handleUserInfo = (row) => {
  currentUser.value = { ...row };
  userInfoDialogVisible.value = true;
};

// 修改订单状态
const handleStatusChange = async (row) => {
  try {
    const response = await fetch(
      `http://localhost:3000/normal_orders/${row.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: row.status }),
      }
    );

    if (!response.ok) {
      throw new Error('更新订单状态失败');
    }

    ElMessage.success('更新状态成功');
    fetchOrderList();
  } catch (error) {
    console.error('更新订单状态失败:', error);
    ElMessage.error('更新状态失败');
    // 恢复原状态
    row.status = row._originalStatus;
  }
};

// 发货处理
const handleShip = (row) => {
  shipForm.orderId = row.id;
  shipForm.company = '';
  shipForm.trackingNo = '';
  shipDialogVisible.value = true;
};

// 批量发货
const handleBatchShip = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要发货的订单');
    return;
  }
  const canShip = selectedOrders.value.every(
    (order) => order.status === '进行中'
  );
  if (!canShip) {
    ElMessage.warning('只能对进行中的订单进行发货操作');
    return;
  }
  shipForm.orderId = selectedOrders.value.map((order) => order.id).join(',');
  shipForm.company = '';
  shipForm.trackingNo = '';
  shipDialogVisible.value = true;
};

// 提交发货
const submitShipment = async () => {
  if (!shipFormRef.value) return;

  await shipFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const orderIds = shipForm.orderId.split(',');
        const response = await fetch(
          'http://localhost:3000/orders/batch-ship',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderIds,
              company: shipForm.company,
              trackingNo: shipForm.trackingNo,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('发货失败');
        }

        ElMessage.success('发货成功');
        shipDialogVisible.value = false;
        fetchOrderList();
      } catch (error) {
        console.error('发货失败:', error);
        ElMessage.error('发货失败');
      }
    }
  });
};

// 取消订单
const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const response = await fetch(
      `http://localhost:3000/normal_orders/${row.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: '已取消' }),
      }
    );

    if (!response.ok) {
      throw new Error('取消订单失败');
    }

    ElMessage.success('取消成功');
    fetchOrderList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error);
      ElMessage.error('取消失败');
    }
  }
};

// 导出订单
const handleExport = async () => {
  try {
    const params = new URLSearchParams({
      ...searchForm,
      startDate: searchForm.dateRange?.[0] || '',
      endDate: searchForm.dateRange?.[1] || '',
    });

    const response = await fetch(
      `http://localhost:3000/orders/export?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error('导出失败');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `订单列表_${new Date().toLocaleDateString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
};

// 组件卸载前的清理
onBeforeUnmount(() => {
  // 清理所有响应式数据
  orderList.value = [];
  selectedOrders.value = [];
  currentOrder.value = {};
  currentUser.value = {};
  loading.value = false;
});

onMounted(() => {
  fetchOrderList();
});
</script>

<style scoped>
.orders-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.order-total {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
}

.order-total .amount {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}
</style>
