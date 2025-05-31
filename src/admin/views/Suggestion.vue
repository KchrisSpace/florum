<!-- 建议和反馈 -->
<template>
  <div class="suggestion">
    <div class="suggestion-header">
      <h2>建议和反馈</h2>
      <div class="filter-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索建议内容"
          class="search-input"
          clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <el-card class="suggestion-card">
      <el-table
        :data="filteredSuggestions"
        style="width: 100%"
        v-loading="loading">
        <el-table-column prop="name" label="用户名" width="120" />
        <el-table-column
          prop="feedback_message"
          label="反馈内容"
          min-width="300" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="created_at" label="提交时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showDetail(row)">
              查看详情
            </el-button>
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
      title="反馈详情"
      width="50%"
      :close-on-click-modal="false">
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">用户名：</span>
          <span>{{ currentSuggestion.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">邮箱：</span>
          <span>{{ currentSuggestion.email }}</span>
        </div>
        <div class="detail-item">
          <span class="label">电话：</span>
          <span>{{ currentSuggestion.phone }}</span>
        </div>
        <div class="detail-item">
          <span class="label">提交时间：</span>
          <span>{{
            new Date(currentSuggestion.created_at).toLocaleString()
          }}</span>
        </div>
        <div class="detail-item">
          <span class="label">反馈内容：</span>
          <p class="content">{{ currentSuggestion.feedback_message }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

// 加载状态
const loading = ref(false);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 过滤条件
const filterStatus = ref('');
const searchKeyword = ref('');

// 对话框控制
const detailVisible = ref(false);
const currentSuggestion = ref({});

// 模拟数据
const suggestions = ref([
  {
    id: '1',
    user_id: '02',
    name: '刘盈盈',
    email: '123456@qq.com',
    phone: '12345678901',
    feedback_message: '花布很好看，我很喜欢',
    created_at: '2025-04-25T17:51:56.908Z',
  },
]);

// 过滤后的建议列表
const filteredSuggestions = computed(() => {
  let result = suggestions.value;

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.feedback_message.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword)
    );
  }

  // 分页
  total.value = result.length;
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

// 显示详情
const showDetail = (suggestion) => {
  currentSuggestion.value = suggestion;
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
  // 这里可以添加获取数据的逻辑
  total.value = suggestions.value.length;
});
</script>

<style scoped>
.suggestion {
  padding: 20px;
}

.suggestion-header {
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

.suggestion-card {
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

.suggestion-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin: 0;
}
</style>
