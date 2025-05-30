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
        <el-form-item label="商品分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable>
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
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
        <el-table-column prop="category" label="分类" />
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
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.1" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            :precision="0"
            :step="1" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { Search, Refresh, Download, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 商品分类选项
const categories = [
  { value: '手机', label: '手机' },
  { value: '电脑', label: '电脑' },
  { value: '配件', label: '配件' },
  { value: '其他', label: '其他' },
];

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
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
  name: '',
  category: '',
  price: 0,
  stock: 0,
  image: '',
  description: '',
  status: '上架',
});

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
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
    const response = await fetch('http://localhost:3000/products');
    if (!response.ok) {
      throw new Error(
        `获取商品列表失败: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('获取到的商品数据:', data);

    // 确保数据是数组
    if (!Array.isArray(data)) {
      console.error('返回的数据不是数组:', data);
      productList.value = [];
      total.value = 0;
      return;
    }

    // 应用搜索过滤
    let filteredData = data;
    if (searchForm.name) {
      filteredData = filteredData.filter((product) =>
        product.name.toLowerCase().includes(searchForm.name.toLowerCase())
      );
    }
    if (searchForm.category) {
      filteredData = filteredData.filter(
        (product) => product.category === searchForm.category
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

    // 分页处理
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
    form[key] =
      key === 'status' ? '上架' : key === 'price' || key === 'stock' ? 0 : '';
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
    const response = await fetch(`http://localhost:3000/products/${row.id}`, {
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

    const response = await fetch(`http://localhost:3000/products/${row.id}`, {
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
            ? 'http://localhost:3000/products'
            : `http://localhost:3000/products/${form.id}`;
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
      `http://localhost:3000/products/export?${params.toString()}`
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

// 组件卸载前的清理
onBeforeUnmount(() => {
  // 清理所有响应式数据
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
