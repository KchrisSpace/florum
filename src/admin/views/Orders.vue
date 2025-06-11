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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="operation-links">
              <span class="link-item detail" @click="handleDetail(row)"
                >详情</span
              >
              <span class="link-item user" @click="handleUserInfo(row)"
                >用户信息</span
              >
            </div>
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
          new Date(currentOrder.created_at).toLocaleString()
        }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{
          currentOrder.user_id
        }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder.status)">{{
            currentOrder.status
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="配送时间">{{
          new Date(currentOrder.delivery_time).toLocaleString()
        }}</el-descriptions-item>
        <el-descriptions-item label="运费"
          >¥{{ formatNumber(currentOrder.shipping_fee) }}</el-descriptions-item
        >
        <el-descriptions-item label="收货人">{{
          currentOrder.address?.consignee
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          currentOrder.address?.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">
          {{ currentOrder.address?.region }} {{ currentOrder.address?.detail }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="order-items mt-4">
        <h3 class="text-lg font-medium mb-2">商品清单</h3>
        <el-table :data="currentOrder.items" border style="width: 100%">
          <el-table-column label="商品图片" width="100">
            <template #default="{ row }">
              <el-image
                v-if="row.productDetail?.images?.[0]"
                :src="row.productDetail.images[0]"
                :preview-src-list="row.productDetail.images"
                fit="cover"
                style="width: 50px; height: 50px" />
            </template>
          </el-table-column>
          <el-table-column prop="productDetail.title" label="商品名称" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="单价">
            <template #default="{ row }">
              ¥{{
                formatNumber(row.productDetail?.price_info?.current_price || 0)
              }}
            </template>
          </el-table-column>
          <el-table-column label="小计">
            <template #default="{ row }">
              ¥{{
                formatNumber(
                  (row.productDetail?.price_info?.current_price || 0) *
                    row.quantity
                )
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="order-total">
        <div class="total-item">
          <span>运费：</span>
          <span>¥{{ formatNumber(currentOrder.shipping_fee) }}</span>
        </div>
        <div class="total-item">
          <span>订单总额：</span>
          <span class="amount"
            >¥{{ formatNumber(currentOrder.total_price) }}</span
          >
        </div>
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
        <el-descriptions-item label="用户ID">
          {{ currentUser.id }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名">
          {{ currentUser.user_name }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ currentUser.user_gender }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentUser.user_email }}
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          {{ currentUser.user_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="头像">
          <el-image
            :src="currentUser.user_avatar"
            :preview-src-list="[currentUser.user_avatar]"
            fit="cover"
            style="width: 100px; height: 100px; border-radius: 50%" />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ new Date(currentUser.created_at).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ new Date(currentUser.updated_at).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            :type="currentUser.status === 'active' ? 'success' : 'danger'">
            {{ currentUser.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="角色ID">
          {{ currentUser.role_id }}
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
import { Search, Refresh, Download } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';

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
        order.user_name
          .toLowerCase()
          .includes(searchForm.username.toLowerCase())
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
const handleDetail = async (row) => {
  try {
    currentOrder.value = { ...row };

    // 获取每个商品的详细信息
    const productDetails = await Promise.all(
      row.items.map(async (item) => {
        try {
          const response = await fetch(
            `http://localhost:3000/product_list/${item.product_id}`
          );
          if (!response.ok) {
            throw new Error(`获取商品详情失败: ${response.status}`);
          }
          const data = await response.json();
          return {
            ...item,
            productDetail: data,
          };
        } catch (error) {
          console.error(`获取商品 ${item.product_id} 详情失败:`, error);
          return item;
        }
      })
    );

    currentOrder.value.items = productDetails;
    detailDialogVisible.value = true;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    ElMessage.error('获取订单详情失败');
  }
};

// 查看用户信息
const handleUserInfo = async (row) => {
  try {
    console.log('正在获取用户信息，用户ID:', row.user_id);

    const response = await fetch(`http://localhost:3000/users/${row.user_id}`);

    if (!response.ok) {
      console.error('API响应错误:', response.status, response.statusText);
      throw new Error(
        `获取用户信息失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log('API返回数据:', result);

    if (result.code === 200 && result.data) {
      // 确保data是单个用户对象
      if (Array.isArray(result.data)) {
        // 如果返回的是数组，取第一个匹配的用户
        const user = result.data.find((u) => u.id === row.user_id);
        if (user) {
          currentUser.value = user;
          userInfoDialogVisible.value = true;
        } else {
          throw new Error('未找到匹配的用户信息');
        }
      } else {
        // 如果返回的是单个用户对象
        currentUser.value = result.data;
        userInfoDialogVisible.value = true;
      }
    } else {
      console.error('API返回错误:', result);
      throw new Error(result.message || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error(error.message || '获取用户信息失败');
  }
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

// 导出订单
const handleExport = async () => {
  try {
    loading.value = true;
    // 获取所有订单数据
    const response = await fetch('http://localhost:3000/normal_orders');
    if (!response.ok) {
      throw new Error('获取订单数据失败');
    }
    const orders = await response.json();

    // 获取每个订单的商品详情
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const itemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
            try {
              const productResponse = await fetch(
                `http://localhost:3000/product_list/${item.product_id}`
              );
              if (!productResponse.ok) {
                throw new Error(`获取商品详情失败: ${productResponse.status}`);
              }
              const productData = await productResponse.json();
              return {
                ...item,
                productDetail: productData,
              };
            } catch (error) {
              console.error(`获取商品 ${item.product_id} 详情失败:`, error);
              return item;
            }
          })
        );

        return {
          ...order,
          items: itemsWithDetails,
        };
      })
    );

    // 处理导出数据
    const exportData = ordersWithDetails.map((order) => {
      // 处理商品信息
      const itemsInfo = order.items.map((item) => {
        const productDetail = item.productDetail || {};
        return {
          商品ID: item.product_id,
          商品名称: productDetail.title || '',
          商品分类: productDetail.main_category || '',
          商品单价: productDetail.price_info?.current_price || 0,
          购买数量: item.quantity,
          小计金额:
            (productDetail.price_info?.current_price || 0) * item.quantity,
        };
      });

      // 合并订单基本信息
      return {
        订单号: order.id,
        用户ID: order.user_id,
        订单状态: order.status,
        下单时间: new Date(order.created_at).toLocaleString(),
        配送时间: new Date(order.delivery_time).toLocaleString(),
        收货人: order.address?.consignee || '',
        联系电话: order.address?.phone || '',
        收货地址: `${order.address?.region || ''} ${
          order.address?.detail || ''
        }`,
        运费: order.shipping_fee,
        订单总额: order.total_price,
        ...itemsInfo.reduce(
          (acc, item, index) => ({
            ...acc,
            [`商品${index + 1}ID`]: item.商品ID,
            [`商品${index + 1}名称`]: item.商品名称,
            [`商品${index + 1}分类`]: item.商品分类,
            [`商品${index + 1}单价`]: item.商品单价,
            [`商品${index + 1}数量`]: item.购买数量,
            [`商品${index + 1}小计`]: item.小计金额,
          }),
          {}
        ),
      };
    });

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // 设置列宽
    const colWidths = [
      { wch: 20 }, // 订单号
      { wch: 10 }, // 用户ID
      { wch: 10 }, // 订单状态
      { wch: 20 }, // 下单时间
      { wch: 20 }, // 配送时间
      { wch: 10 }, // 收货人
      { wch: 15 }, // 联系电话
      { wch: 40 }, // 收货地址
      { wch: 10 }, // 运费
      { wch: 10 }, // 订单总额
      { wch: 15 }, // 商品ID
      { wch: 20 }, // 商品名称
      { wch: 15 }, // 商品分类
      { wch: 10 }, // 商品单价
      { wch: 10 }, // 商品数量
      { wch: 10 }, // 商品小计
    ];
    ws['!cols'] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '订单列表');

    // 导出文件
    XLSX.writeFile(wb, `订单列表_${new Date().toLocaleDateString()}.xlsx`);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请重试');
  } finally {
    loading.value = false;
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

.order-total .total-item {
  margin-bottom: 10px;
}

.order-total .amount {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}

.operation-links {
  display: flex;
  gap: 12px;
}

.link-item {
  cursor: pointer;
  font-size: 14px;
}

.link-item:hover {
  opacity: 0.8;
}

.link-item.detail {
  color: #409eff;
}

.link-item.user {
  color: #909399;
}
</style>
