<template>
  <div class="products-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入商品名称"
            clearable />
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number
            v-model="searchForm.minPrice"
            :min="0"
            :precision="2"
            placeholder="最低价" />
          <span class="separator">-</span>
          <el-input-number
            v-model="searchForm.maxPrice"
            :min="0"
            :precision="2"
            placeholder="最高价" />
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

    <!-- 商品列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
          <el-button-group>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>新增商品
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon>导出商品
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-table
        :data="productList"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格">
          <template #default="{ row }">
            ¥{{ formatNumber(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '上架' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="handleToggleStatus(row)">
                {{ row.status === '上架' ? '下架' : '上架' }}
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                删除
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

    <!-- 商品编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      width="800px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.1" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input
            v-model="form.stock"
            placeholder='请输入库存状态，如"充足"' />
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <img v-if="form.image" :src="form.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="上架">上架</el-radio>
            <el-radio label="下架">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="orderDialogVisible" title="订单详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{
          orderDetail.id
        }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{
          orderDetail.user_id
        }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag
            :type="orderDetail.status === '进行中' ? 'warning' : 'success'">
            {{ orderDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ new Date(orderDetail.created_at).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="配送时间">
          {{ new Date(orderDetail.delivery_time).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="运费">
          ¥{{ orderDetail.shipping_fee }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="order-items mt-4">
        <h3 class="text-lg font-medium mb-2">商品清单</h3>
        <el-table :data="orderDetail.items" border style="width: 100%">
          <el-table-column prop="product_id" label="商品ID" width="120" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="single_price" label="单价">
            <template #default="{ row }">
              ¥{{ row.single_price || '暂无价格' }}
            </template>
          </el-table-column>
          <el-table-column label="小计">
            <template #default="{ row }">
              ¥{{ row.single_price * row.quantity || '暂无价格' }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="order-total mt-4 text-right">
        <p class="text-lg">
          订单总额：<span class="text-red-500 font-bold"
            >¥{{ orderDetail.total_price }}</span
          >
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { Search, Refresh, Download, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { API_URL } from '../../pages/const';

// 搜索表单
const searchForm = reactive({
  name: '',
  minPrice: null,
  maxPrice: null,
});

// 商品列表数据
const productList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedProducts = ref([]);

// 编辑表单
const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref(null);
const form = reactive({
  id: '',
  name: '',
  price: 0,
  stock: '',
  image: '',
  description: '',
  status: '上架',
});

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入商品库存状态', trigger: 'blur' }],
  image: [{ required: true, message: '请上传商品图片', trigger: 'change' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
};

// 格式化数字
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0.00';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 获取商品列表
const fetchProductList = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/product_list`);
    if (!response.ok) {
      throw new Error(
        `获取商品列表失败: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    // 适配后端商品数据结构
    let mappedData = Array.isArray(data)
      ? data.map((item) => ({
          id: item.id,
          name: item.title,
          image:
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : '',
          price: item.price_info?.current_price ?? 0,
          stock: item.sales_data?.stock_status || '',
          sales: item.sales_data?.sales_count ?? 0,
          description: item.promotion?.main_description || '',
          status: item.promotion?.is_hot ? '上架' : '下架',
          raw: item, // 保留原始数据
        }))
      : [];

    // 搜索过滤
    let filteredData = mappedData;
    if (searchForm.name) {
      filteredData = filteredData.filter(
        (product) =>
          product.name &&
          product.name.toLowerCase().includes(searchForm.name.toLowerCase())
      );
    }
    if (searchForm.minPrice !== null) {
      filteredData = filteredData.filter(
        (product) => product.price >= searchForm.minPrice
      );
    }
    if (searchForm.maxPrice !== null) {
      filteredData = filteredData.filter(
        (product) => product.price <= searchForm.maxPrice
      );
    }

    // 分页
    total.value = filteredData.length;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    productList.value = filteredData.slice(start, end);
  } catch (error) {
    console.error('获取商品列表失败:', error);
    ElMessage.error(error.message || '获取商品列表失败');
    productList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchProductList();
};

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = key.includes('Price') ? null : '';
  });
  handleSearch();
};

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchProductList();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchProductList();
};

// 多选处理
const handleSelectionChange = (val) => {
  selectedProducts.value = val;
};

// 新增商品
const handleAdd = () => {
  dialogType.value = 'add';
  Object.keys(form).forEach((key) => {
    form[key] = key === 'status' ? '上架' : key === 'price' ? 0 : '';
  });
  dialogVisible.value = true;
};

// 编辑商品
const handleEdit = (row) => {
  dialogType.value = 'edit';
  Object.keys(form).forEach((key) => {
    form[key] = row[key];
  });
  dialogVisible.value = true;
};

// 切换商品状态
const handleToggleStatus = async (row) => {
  try {
    const newStatus = row.status === '上架' ? '下架' : '上架';
    const response = await fetch(`${API_URL}/product_list/${row.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('更新商品状态失败');
    }

    ElMessage.success('更新状态成功');
    fetchProductList();
  } catch (error) {
    console.error('更新商品状态失败:', error);
    ElMessage.error('更新状态失败');
  }
};

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const response = await fetch(`${API_URL}/product_list/${row.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('删除商品失败');
    }

    ElMessage.success('删除成功');
    fetchProductList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error);
      ElMessage.error('删除失败');
    }
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const url =
          dialogType.value === 'add'
            ? `${API_URL}/product_list`
            : `${API_URL}/product_list/${form.id}`;
        const method = dialogType.value === 'add' ? 'POST' : 'PUT';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error('保存商品失败');
        }

        ElMessage.success('保存成功');
        dialogVisible.value = false;
        fetchProductList();
      } catch (error) {
        console.error('保存商品失败:', error);
        ElMessage.error('保存失败');
      }
    }
  });
};

// 图片上传相关
const handleUploadSuccess = (response) => {
  form.image = response.url;
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 导出商品
const handleExport = async () => {
  try {
    const params = new URLSearchParams({
      ...searchForm,
      minPrice: searchForm.minPrice || '',
      maxPrice: searchForm.maxPrice || '',
    });

    const response = await fetch(
      `${API_URL}/product_list/export?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error('导出失败');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `商品列表_${new Date().toLocaleDateString()}.xlsx`;
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

// 订单详情相关
const orderDialogVisible = ref(false);
const orderDetail = ref({
  id: '',
  user_id: '',
  items: [],
  total_price: 0,
  shipping_fee: 0,
  delivery_time: '',
  status: '',
  created_at: '',
});

// 显示订单详情
const showOrderDetail = (order) => {
  orderDetail.value = order;
  orderDialogVisible.value = true;
};

// 组件卸载前的清理
onBeforeUnmount(() => {
  productList.value = [];
  selectedProducts.value = [];
  loading.value = false;
});

onMounted(() => {
  fetchProductList();
});
</script>

<style scoped>
.products-page {
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

.separator {
  margin: 0 10px;
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

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
