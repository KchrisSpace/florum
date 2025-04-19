<template>
  <div class="products-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable
          >
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
          </el-select>
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
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增商品
          </el-button>
        </div>
      </template>

      <el-table :data="productList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              class="product-image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="price" label="价格">
          <template #default="{ row }">
            ¥{{ formatNumber(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === "active" ? "上架" : "下架" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                :type="row.status === 'active' ? 'warning' : 'success'"
                size="small"
                @click="handleStatusChange(row)"
              >
                {{ row.status === "active" ? "下架" : "上架" }}
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
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 商品编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      width="650px"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="productForm.category" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="product-upload"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img
              v-if="productForm.image"
              :src="productForm.image"
              class="upload-image"
            />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="productForm.price"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="上架状态" prop="status">
          <el-switch
            v-model="productForm.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 分类数据
const categories = [
  { value: "flowers", label: "鲜花" },
  { value: "plants", label: "绿植" },
  { value: "gifts", label: "礼品" },
  { value: "art", label: "花艺" },
];

// 搜索表单
const searchForm = reactive({
  name: "",
  category: "",
  status: "",
});

// 商品列表数据
const productList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref("add");
const productFormRef = ref(null);
const productForm = reactive({
  name: "",
  category: "",
  image: "",
  price: 0,
  stock: 0,
  description: "",
  status: "active",
});

// 表单验证规则
const productRules = {
  name: [
    { required: true, message: "请输入商品名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],
  category: [{ required: true, message: "请选择商品分类", trigger: "change" }],
  image: [{ required: true, message: "请上传商品图片", trigger: "change" }],
  price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
  stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
};

// 格式化数字
const formatNumber = (num) => {
  return num.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 获取商品列表
const fetchProductList = async () => {
  loading.value = true;
  try {
    // TODO: 调用后端API获取商品列表
    // const response = await fetch('/api/products')
    // const data = await response.json()
    // 模拟数据
    productList.value = [
      {
        id: 1,
        name: "红玫瑰",
        category: "鲜花",
        image: "https://example.com/rose.jpg",
        price: 99.0,
        stock: 100,
        status: "active",
      },
    ];
    total.value = 100;
  } catch (error) {
    console.error("获取商品列表失败:", error);
    ElMessage.error("获取商品列表失败");
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
    searchForm[key] = "";
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

// 图片上传
const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }
  return true;
};

const handleUploadSuccess = (response) => {
  productForm.image = response.url;
  ElMessage.success("上传成功");
};

// 新增商品
const handleAdd = () => {
  dialogType.value = "add";
  Object.keys(productForm).forEach((key) => {
    productForm[key] =
      key === "status" ? "active" : key === "price" || key === "stock" ? 0 : "";
  });
  dialogVisible.value = true;
};

// 编辑商品
const handleEdit = (row) => {
  dialogType.value = "edit";
  Object.keys(productForm).forEach((key) => {
    productForm[key] = row[key];
  });
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!productFormRef.value) return;

  await productFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端API保存商品数据
        // const response = await fetch('/api/products', {
        //   method: dialogType.value === 'add' ? 'POST' : 'PUT',
        //   body: JSON.stringify(productForm)
        // })
        ElMessage.success(dialogType.value === "add" ? "添加成功" : "更新成功");
        dialogVisible.value = false;
        fetchProductList();
      } catch (error) {
        console.error("保存商品失败:", error);
        ElMessage.error("操作失败");
      }
    }
  });
};

// 修改商品状态
const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === "active" ? "下架" : "上架"}该商品吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    // TODO: 调用后端API修改商品状态
    // await fetch(`/api/products/${row.id}/status`, { method: 'PUT' })
    row.status = row.status === "active" ? "inactive" : "active";
    ElMessage.success("状态修改成功");
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改状态失败:", error);
      ElMessage.error("修改状态失败");
    }
  }
};

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm("确定要删除该商品吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // TODO: 调用后端API删除商品
    // await fetch(`/api/products/${row.id}`, { method: 'DELETE' })
    ElMessage.success("删除成功");
    fetchProductList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除商品失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

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

.list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.product-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-upload:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
