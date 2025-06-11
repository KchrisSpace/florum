<!-- 定制管理 -->
<template>
  <div class="custom">
    <div class="custom-header">
      <h2>定制管理</h2>
      <div class="filter-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户ID/邮箱/手机号/留言"
          class="search-input"
          clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="statusFilter"
          placeholder="全部状态"
          clearable
          style="width: 140px; margin-left: 10px">
          <el-option label="待处理" value="待处理" />
          <el-option label="进行中" value="进行中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
        </el-select>
      </div>
    </div>

    <el-card class="custom-card">
      <el-table :data="filteredCustoms" style="width: 100%" v-loading="loading">
        <el-table-column prop="user_id" label="用户ID" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="custom_img" label="图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.custom_img"
              :src="row.custom_img"
              style="width: 60px; height: 60px"
              fit="cover" />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="custom_message"
          label="定制留言"
          min-width="200" />
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{ row }">
            <el-select
              v-model="row.status"
              placeholder="请选择"
              size="small"
              @change="handleStatusChange(row)">
              <el-option label="待处理" value="待处理" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <span class="link-item detail" @click="showDetail(row)"
              >查看详情</span
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="定制详情"
      width="50%"
      :close-on-click-modal="false">
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">用户ID：</span>
          <span>{{ custom.user_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">邮箱：</span>
          <span>{{ custom.email }}</span>
        </div>
        <div class="detail-item">
          <span class="label">手机号：</span>
          <span>{{ custom.phone }}</span>
        </div>
        <div class="detail-item">
          <span class="label">图片：</span>
          <el-image
            v-if="custom.custom_img"
            :src="custom.custom_img"
            style="width: 100px; height: 100px"
            fit="cover"
            :preview-src-list="[custom.custom_img]" />
          <span v-else>无</span>
        </div>
        <div class="detail-item">
          <span class="label">定制留言：</span>
          <span>{{ custom.custom_message }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <el-tag :type="getStatusType(custom.status)">
            {{ custom.status }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">提交时间：</span>
          <span>{{ new Date(custom.created_at).toLocaleString() }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

// 加载状态
const loading = ref(false);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 过滤条件
const searchKeyword = ref('');
const statusFilter = ref('');

// 对话框控制
const detailVisible = ref(false);
const custom = ref({});

// 定制数据
const customs = ref([]);

// 获取定制数据
const fetchCustoms = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/custom`);
    customs.value = response.data;
    total.value = response.data.length;
  } catch (error) {
    console.error('获取定制数据失败:', error);
    ElMessage.error('获取定制数据失败');
  } finally {
    loading.value = false;
  }
};

// 获取状态对应的标签类型
const getStatusType = (status) => {
  const statusMap = {
    待处理: 'warning',
    进行中: 'primary',
    已完成: 'success',
    已取消: 'info',
    处理中: 'primary',
  };
  return statusMap[status] || 'info';
};

// 处理状态变更
const handleStatusChange = async (row) => {
  try {
    loading.value = true;
    const response = await axios.put(`${API_URL}/custom/${row.id}`, {
      status: row.status,
    });
    if (response.data) {
      ElMessage.success('状态更新成功');
      fetchCustoms(); // 重新获取数据
    }
  } catch (error) {
    console.error('更新状态失败:', error);
    ElMessage.error('更新状态失败');
  } finally {
    loading.value = false;
  }
};

// 过滤后的定制列表
const filteredCustoms = computed(() => {
  let result = customs.value;

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter((item) => item.status === statusFilter.value);
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (item) =>
        (item.user_id && item.user_id.toLowerCase().includes(keyword)) ||
        (item.email && item.email.toLowerCase().includes(keyword)) ||
        (item.phone && item.phone.toLowerCase().includes(keyword)) ||
        (item.custom_message &&
          item.custom_message.toLowerCase().includes(keyword))
    );
  }

  // 分页
  total.value = result.length;
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

// 显示详情
const showDetail = (row) => {
  custom.value = row;
  detailVisible.value = true;
};

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 初始化
onMounted(() => {
  fetchCustoms();
});
</script>

<style scoped>
.custom {
  padding: 20px;
}

.custom-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.custom-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: 20px;
}

.detail-item {
  margin-bottom: 20px;
}

.detail-item .label {
  font-weight: bold;
  margin-right: 10px;
  color: #606266;
}

.detail-item .content {
  margin-top: 10px;
  line-height: 1.5;
  color: #303133;
}

.link-item {
  cursor: pointer;
  font-size: 14px;
  color: #409eff;
}

.link-item:hover {
  opacity: 0.8;
}
</style>
