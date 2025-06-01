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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商品ID" prop="id">
          <el-input v-model="form.id" placeholder="系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="main_category">
          <el-select v-model="form.main_category" placeholder="请选择商品分类">
            <el-option label="热销" value="热销" />
            <el-option label="新品" value="新品" />
            <el-option label="特惠" value="特惠" />
            <el-option label="礼盒" value="礼盒" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price_info.current_price">
          <el-input-number
            v-model="form.price_info.current_price"
            :min="0"
            :precision="2"
            :step="0.1" />
        </el-form-item>
        <el-form-item label="库存状态" prop="sales_data.stock_status">
          <el-select
            v-model="form.sales_data.stock_status"
            placeholder="请选择库存状态">
            <el-option label="充足" value="充足" />
            <el-option label="紧张" value="紧张" />
            <el-option label="缺货" value="缺货" />
          </el-select>
        </el-form-item>
        <el-form-item label="销量" prop="sales_data.sales_count">
          <el-input-number
            v-model="form.sales_data.sales_count"
            :min="0"
            :precision="0" />
        </el-form-item>
        <el-form-item label="评分" prop="sales_data.rating">
          <el-rate
            v-model="form.sales_data.rating"
            :max="5"
            :allow-half="true"
            show-score />
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <el-upload
            class="avatar-uploader"
            :action="`${API_URL}/uploads`"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :limit="4"
            :on-exceed="handleExceed"
            :headers="uploadHeaders">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持上传4张图片，建议尺寸800x800px，大小不超过2MB
              </div>
            </template>
          </el-upload>
          <div
            class="image-preview"
            v-if="form.images && form.images.length > 0">
            <div
              v-for="(image, index) in form.images"
              :key="index"
              class="image-item">
              <el-image
                :src="image"
                fit="cover"
                :preview-src-list="image"
                :initial-index="index" />
              <el-button
                type="danger"
                size="small"
                circle
                @click="handleRemoveImage(index)"
                class="remove-btn">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品描述" prop="promotion.main_description">
          <el-input
            v-model="form.promotion.main_description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="花语" prop="promotion.flower_language">
          <el-input
            v-model="form.promotion.flower_language"
            type="textarea"
            :rows="2"
            placeholder="请输入花语" />
        </el-form-item>
        <el-form-item label="关键词" prop="promotion.keywords">
          <el-select
            v-model="form.promotion.keywords"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键词">
            <el-option
              v-for="item in keywordOptions"
              :key="item"
              :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="促销结束时间" prop="promotion.end_time">
          <el-date-picker
            v-model="form.promotion.end_time"
            type="datetime"
            placeholder="选择促销结束时间" />
        </el-form-item>
        <el-form-item label="商品分类标签" prop="specification.category">
          <el-select
            v-model="form.specification.category"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入分类标签">
            <el-option
              v-for="item in categoryOptions"
              :key="item"
              :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="花材清单" prop="specification.materials">
          <el-input
            v-model="form.specification.materials"
            type="textarea"
            :rows="4"
            placeholder="请输入花材清单，每行一个" />
        </el-form-item>
        <el-form-item label="包装说明" prop="specification.packaging">
          <el-input
            v-model="form.specification.packaging"
            type="textarea"
            :rows="3"
            placeholder="请输入包装说明" />
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
import {
  Search,
  Refresh,
  Download,
  Plus,
  Delete,
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { API_URL } from '../../pages/const';
import * as XLSX from 'xlsx';

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
  title: '',
  main_category: '热销',
  images: [],
  price_info: {
    original_price: 0,
    current_price: 0,
  },
  sales_data: {
    sales_count: 0,
    stock_status: '充足',
    rating: 0,
  },
  promotion: {
    is_hot: true,
    main_description: '',
    keywords: [],
    flower_language: '',
    end_time: '',
  },
  specification: {
    category: [],
    materials: [],
    packaging: '',
  },
  status: '上架',
});

// 关键词选项
const keywordOptions = [
  '热销',
  '新品',
  '特惠',
  '礼盒',
  '生日',
  '纪念日',
  '求婚',
  '道歉',
  '感谢',
  '祝福',
];

// 分类选项
const categoryOptions = [
  '推荐',
  '生日鲜花',
  '纪念日',
  '求婚',
  '道歉',
  '感谢',
  '祝福',
  '礼盒',
];

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
  // 重置表单
  Object.keys(form).forEach((key) => {
    if (key === 'price_info') {
      form[key] = {
        original_price: 0,
        current_price: 0,
      };
    } else if (key === 'sales_data') {
      form[key] = {
        sales_count: 0,
        stock_status: '充足',
        rating: 0,
      };
    } else if (key === 'promotion') {
      form[key] = {
        is_hot: true,
        main_description: '',
        keywords: [],
        flower_language: '',
        end_time: '',
      };
    } else if (key === 'specification') {
      form[key] = {
        category: [],
        materials: '',
        packaging: '',
      };
    } else if (key === 'status') {
      form[key] = '上架';
    } else if (key === 'main_category') {
      form[key] = '热销';
    } else if (key === 'images') {
      form[key] = [];
    } else {
      form[key] = '';
    }
  });
  dialogVisible.value = true;
};

// 编辑商品
const handleEdit = (row) => {
  console.log('编辑商品数据:', row);
  dialogType.value = 'edit';

  // 将后端数据映射到表单
  const rawData = row.raw || row; // 使用原始数据

  form.id = rawData.id;
  form.title = rawData.title;
  form.main_category = rawData.main_category || '热销';

  // 处理图片数组
  form.images = Array.isArray(rawData.images) ? [...rawData.images] : [];

  // 处理价格信息
  form.price_info = {
    original_price: rawData.price_info?.original_price || 0,
    current_price: rawData.price_info?.current_price || 0,
  };

  // 处理销售数据
  form.sales_data = {
    sales_count: rawData.sales_data?.sales_count || 0,
    stock_status: rawData.sales_data?.stock_status || '充足',
    rating: rawData.sales_data?.rating || 0,
  };

  // 处理促销信息
  form.promotion = {
    is_hot: rawData.promotion?.is_hot || false,
    main_description: rawData.promotion?.main_description || '',
    keywords: Array.isArray(rawData.promotion?.keywords)
      ? [...rawData.promotion.keywords]
      : [],
    flower_language: rawData.promotion?.flower_language || '',
    end_time: rawData.promotion?.end_time || '',
  };

  // 处理规格信息
  form.specification = {
    category: Array.isArray(rawData.specification?.category)
      ? [...rawData.specification.category]
      : [],
    materials: Array.isArray(rawData.specification?.materials)
      ? rawData.specification.materials.join('\n')
      : '',
    packaging: rawData.specification?.packaging || '',
  };

  form.status = rawData.status || '上架';

  // 打印调试信息
  console.log('编辑商品数据:', {
    form,
    originalRow: rawData,
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
      body: JSON.stringify({
        status: newStatus,
        promotion: {
          is_hot: newStatus === '上架',
        },
      }),
    });

    const result = await response.json();
    if (result.code === 200) {
      ElMessage.success('更新状态成功');
      fetchProductList();
    } else {
      throw new Error(result.message || '更新状态失败');
    }
  } catch (error) {
    console.error('更新商品状态失败:', error);
    ElMessage.error(error.message || '更新状态失败');
  }
};

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const response = await fetch(`${API_URL}/product_list/${row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.code === 200) {
      ElMessage.success('删除成功');
      // 重新获取商品列表
      fetchProductList();
    } else {
      throw new Error(result.message || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error);
      ElMessage.error(error.message || '删除失败');
    }
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 处理图片路径，移除API_URL前缀
        const processedImages = form.images.map((img) => {
          if (img.startsWith(API_URL)) {
            return img.replace(API_URL + '/', '');
          }
          return img;
        });

        // 处理花材清单
        const materials = form.specification.materials
          .split('\n')
          .filter((item) => item.trim());

        // 构建商品数据
        const productData = {
          id: form.id || `P${Date.now().toString().slice(-4)}`,
          title: form.title,
          main_category: form.main_category,
          images: processedImages,
          price_info: {
            original_price: form.price_info.current_price,
            current_price: form.price_info.current_price,
          },
          sales_data: {
            sales_count: form.sales_data.sales_count,
            stock_status: form.sales_data.stock_status,
            rating: form.sales_data.rating,
          },
          promotion: {
            is_hot: form.status === '上架',
            main_description: form.promotion.main_description,
            keywords: form.promotion.keywords,
            flower_language: form.promotion.flower_language,
            end_time: form.promotion.end_time
              ? new Date(form.promotion.end_time).toISOString()
              : '',
          },
          specification: {
            category: form.specification.category,
            materials: materials,
            packaging: form.specification.packaging,
          },
          status: form.status,
          timestamps: {
            updated_at: new Date().toISOString().split('T')[0],
          },
        };

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
          body: JSON.stringify(productData),
        });

        const result = await response.json();
        if (result.code === 200) {
          ElMessage.success('保存成功');
          dialogVisible.value = false;
          fetchProductList();
        } else {
          throw new Error(result.message || '保存失败');
        }
      } catch (error) {
        console.error('保存商品失败:', error);
        ElMessage.error(error.message || '保存失败');
      }
    }
  });
};

// 上传请求头
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`, // 如果需要认证
};

// 处理上传错误
const handleUploadError = (error) => {
  console.error('图片上传失败:', error);
  ElMessage.error('图片上传失败，请重试');
};

// 添加图片超出限制的处理函数
const handleExceed = () => {
  ElMessage.warning('最多只能上传4张图片');
};

// 导出商品
const handleExport = async () => {
  try {
    // 获取所有商品数据
    const response = await fetch(`${API_URL}/product_list`);
    if (!response.ok) {
      throw new Error('获取商品数据失败');
    }
    const data = await response.json();

    // 处理数据格式
    const exportData = data.map((item) => ({
      商品ID: item.id,
      商品名称: item.title,
      商品分类: item.main_category,
      当前价格: item.price_info?.current_price || 0,
      原价: item.price_info?.original_price || 0,
      库存状态: item.sales_data?.stock_status || '',
      销量: item.sales_data?.sales_count || 0,
      评分: item.sales_data?.rating || 0,
      商品描述: item.promotion?.main_description || '',
      花语: item.promotion?.flower_language || '',
      关键词: Array.isArray(item.promotion?.keywords)
        ? item.promotion.keywords.join(',')
        : '',
      促销结束时间: item.promotion?.end_time || '',
      商品分类标签: Array.isArray(item.specification?.category)
        ? item.specification.category.join(',')
        : '',
      花材清单: Array.isArray(item.specification?.materials)
        ? item.specification.materials.join(',')
        : '',
      包装说明: item.specification?.packaging || '',
      商品状态: item.status || '',
      更新时间: item.timestamps?.updated_at || '',
    }));

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // 设置列宽
    const colWidths = [
      { wch: 10 }, // 商品ID
      { wch: 20 }, // 商品名称
      { wch: 15 }, // 商品分类
      { wch: 12 }, // 当前价格
      { wch: 12 }, // 原价
      { wch: 12 }, // 库存状态
      { wch: 10 }, // 销量
      { wch: 10 }, // 评分
      { wch: 30 }, // 商品描述
      { wch: 20 }, // 花语
      { wch: 20 }, // 关键词
      { wch: 20 }, // 促销结束时间
      { wch: 20 }, // 商品分类标签
      { wch: 30 }, // 花材清单
      { wch: 20 }, // 包装说明
      { wch: 10 }, // 商品状态
      { wch: 20 }, // 更新时间
    ];
    ws['!cols'] = colWidths;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '商品列表');

    // 导出文件
    XLSX.writeFile(wb, `商品列表_${new Date().toLocaleDateString()}.xlsx`);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请重试');
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

// 处理花材清单
const handleMaterialsChange = (value) => {
  form.specification.materials = value
    .split('\n')
    .filter((item) => item.trim());
};

// 修改表单验证规则
const rules = {
  title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  main_category: [
    { required: true, message: '请选择商品分类', trigger: 'change' },
  ],
  'price_info.current_price': [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
  ],
  'sales_data.stock_status': [
    { required: true, message: '请选择库存状态', trigger: 'change' },
  ],
  'sales_data.rating': [
    { required: true, message: '请选择商品评分', trigger: 'change' },
  ],
  images: [{ required: true, message: '请上传商品图片', trigger: 'change' }],
  'promotion.main_description': [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
  ],
  'promotion.flower_language': [
    { required: true, message: '请输入花语', trigger: 'blur' },
  ],
  'specification.category': [
    { required: true, message: '请选择商品分类标签', trigger: 'change' },
  ],
  'specification.materials': [
    { required: true, message: '请输入花材清单', trigger: 'blur' },
  ],
  'specification.packaging': [
    { required: true, message: '请输入包装说明', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
};

// 处理上传成功
const handleUploadSuccess = (response) => {
  console.log('上传响应:', response);
  if (!form.images) {
    form.images = [];
  }
  if (form.images.length >= 4) {
    ElMessage.warning('最多只能上传4张图片');
    return;
  }
  if (response.code === 200 && response.url) {
    console.log('添加图片URL:', response.url);
    form.images.push(response.url);
    console.log('当前图片列表:', form.images);
  } else {
    console.error('上传响应异常:', response);
    ElMessage.error('图片上传失败：未获取到图片地址');
  }
};

// 上传前验证
const beforeUpload = (file) => {
  console.log('准备上传文件:', file);
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！');
    return false;
  }
  return true;
};

// 处理图片移除
const handleRemoveImage = (index) => {
  console.log('移除图片索引:', index);
  console.log('移除前图片列表:', form.images);
  form.images.splice(index, 1);
  console.log('移除后图片列表:', form.images);
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
  margin-bottom: 10px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.image-item .el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 4px;
  /* background-color: rgba(255, 255, 255, 0.9); */
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1;
}

.remove-btn:hover {
  /* background-color: #f56c6c; */
  transform: scale(1.1);
}

.remove-btn .el-icon {
  font-size: 14px;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}
</style>
