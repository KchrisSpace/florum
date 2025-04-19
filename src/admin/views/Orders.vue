<template>
  <div class="orders-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="totalAmount" label="订单金额">
          <template #default="{ row }">
            ¥{{ formatNumber(row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" />
        <el-table-column prop="createTime" label="下单时间" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleDetail(row)">
                详情
              </el-button>
              <el-button
                v-if="row.status === 'paid'"
                type="success"
                size="small"
                @click="handleShip(row)"
              >
                发货
              </el-button>
              <el-button
                v-if="row.status === 'pending'"
                type="danger"
                size="small"
                @click="handleCancel(row)"
              >
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
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="订单详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{
          currentOrder.orderNo
        }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{
          currentOrder.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          currentOrder.username
        }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ getStatusLabel(currentOrder.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="收货人">{{
          currentOrder.receiverName
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          currentOrder.receiverPhone
        }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">
          {{ currentOrder.receiverAddress }}
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="currentOrder.items" style="margin-top: 20px">
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="price" label="单价">
          <template #default="{ row }">
            ¥{{ formatNumber(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column label="小计">
          <template #default="{ row }">
            ¥{{ formatNumber(row.price * row.quantity) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="order-total">
        <span>订单总额：</span>
        <span class="amount"
          >¥{{ formatNumber(currentOrder.totalAmount) }}</span
        >
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog v-model="shipDialogVisible" title="订单发货" width="500px">
      <el-form
        ref="shipFormRef"
        :model="shipForm"
        :rules="shipRules"
        label-width="100px"
      >
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
            placeholder="请输入物流单号"
          />
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
import { ref, reactive, onMounted } from "vue";
import { Search, Refresh, Download, Van } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 订单状态选项
const orderStatus = [
  { value: "pending", label: "待付款" },
  { value: "paid", label: "待发货" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

// 搜索表单
const searchForm = reactive({
  orderNo: "",
  username: "",
  status: "",
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

// 发货表单
const shipDialogVisible = ref(false);
const shipFormRef = ref(null);
const shipForm = reactive({
  company: "",
  trackingNo: "",
  orderId: "",
});

const shipRules = {
  company: [{ required: true, message: "请选择物流公司", trigger: "change" }],
  trackingNo: [
    { required: true, message: "请输入物流单号", trigger: "blur" },
    { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" },
  ],
};

// 格式化数字
const formatNumber = (num) => {
  return num.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 获取状态标签类型
const getStatusType = (status) => {
  const map = {
    pending: "warning",
    paid: "primary",
    shipped: "success",
    completed: "info",
    cancelled: "danger",
  };
  return map[status] || "info";
};

// 获取状态标签文本
const getStatusLabel = (status) => {
  const item = orderStatus.find((item) => item.value === status);
  return item ? item.label : status;
};

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true;
  try {
    // TODO: 调用后端API获取订单列表
    // const response = await fetch('/api/orders')
    // const data = await response.json()
    // 模拟数据
    orderList.value = [
      {
        id: 1,
        orderNo: "DD20240320001",
        username: "张三",
        totalAmount: 299.0,
        status: "paid",
        paymentMethod: "微信支付",
        createTime: "2024-03-20 10:00:00",
        receiverName: "张三",
        receiverPhone: "13800138000",
        receiverAddress: "北京市朝阳区xxx街道xxx号",
        items: [
          {
            productName: "红玫瑰",
            price: 99.0,
            quantity: 3,
          },
        ],
      },
    ];
    total.value = 100;
  } catch (error) {
    console.error("获取订单列表失败:", error);
    ElMessage.error("获取订单列表失败");
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
    searchForm[key] = key === "dateRange" ? [] : "";
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

// 发货处理
const handleShip = (row) => {
  shipForm.orderId = row.id;
  shipForm.company = "";
  shipForm.trackingNo = "";
  shipDialogVisible.value = true;
};

// 批量发货
const handleBatchShip = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning("请选择要发货的订单");
    return;
  }
  const canShip = selectedOrders.value.every(
    (order) => order.status === "paid"
  );
  if (!canShip) {
    ElMessage.warning("只能对待发货的订单进行发货操作");
    return;
  }
  shipForm.orderId = selectedOrders.value.map((order) => order.id).join(",");
  shipForm.company = "";
  shipForm.trackingNo = "";
  shipDialogVisible.value = true;
};

// 提交发货
const submitShipment = async () => {
  if (!shipFormRef.value) return;

  await shipFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端API处理发货
        // await fetch('/api/orders/ship', {
        //   method: 'POST',
        //   body: JSON.stringify(shipForm)
        // })
        ElMessage.success("发货成功");
        shipDialogVisible.value = false;
        fetchOrderList();
      } catch (error) {
        console.error("发货失败:", error);
        ElMessage.error("发货失败");
      }
    }
  });
};

// 取消订单
const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm("确定要取消该订单吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // TODO: 调用后端API取消订单
    // await fetch(`/api/orders/${row.id}/cancel`, { method: 'PUT' })
    ElMessage.success("订单已取消");
    fetchOrderList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("取消订单失败:", error);
      ElMessage.error("取消订单失败");
    }
  }
};

// 导出订单
const handleExport = () => {
  ElMessage.success("订单导出功能待实现");
};

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
