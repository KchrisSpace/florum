<!-- 建议和反馈 -->
<template>
  <div class="suggestion">
    <div class="suggestion-header">
      <h2>建议和反馈</h2>
      <div class="filter-section">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="已处理" value="processed" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索建议内容"
          class="search-input"
          clearable
        >
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
        v-loading="loading"
      >
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="content" label="提交内容" min-width="300" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
              {{ row.status === "pending" ? "待处理" : "已处理" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showDetail(row)">
              查看详情
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="success"
              size="small"
              @click="handleReply(row)"
            >
              回复
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
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="建议详情"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="detail-content">
        <div class="detail-item">
          <span class="label">用户名：</span>
          <span>{{ currentSuggestion.userName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">提交时间：</span>
          <span>{{ currentSuggestion.createTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <el-tag
            :type="
              currentSuggestion.status === 'pending' ? 'warning' : 'success'
            "
          >
            {{ currentSuggestion.status === "pending" ? "待处理" : "已处理" }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">建议内容：</span>
          <p class="content">{{ currentSuggestion.content }}</p>
        </div>
        <div v-if="currentSuggestion.reply" class="detail-item">
          <span class="label">回复内容：</span>
          <p class="content">{{ currentSuggestion.reply }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyVisible"
      title="回复建议"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="replyForm" label-width="80px">
        <el-form-item label="建议内容">
          <p class="suggestion-content">{{ currentSuggestion.content }}</p>
        </el-form-item>
        <el-form-item label="回复内容" required>
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReply" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";

// 加载状态
const loading = ref(false);
const submitting = ref(false);

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 过滤条件
const filterStatus = ref("");
const searchKeyword = ref("");

// 对话框控制
const detailVisible = ref(false);
const replyVisible = ref(false);
const currentSuggestion = ref({});
const replyForm = ref({
  content: "",
});

// 模拟数据
const suggestions = ref([
  {
    id: 1,
    userName: "张三",
    content: "建议增加商品分类筛选功能，这样可以更方便地找到想要的商品。",
    status: "pending",
    createTime: "2024-03-20 10:00:00",
    reply: "",
  },
  {
    id: 2,
    userName: "李四",
    content: "希望优化搜索功能，目前的搜索结果不够准确。",
    status: "processed",
    createTime: "2024-03-19 15:30:00",
    reply: "感谢您的建议，我们已经在优化搜索功能，预计下周上线。",
  },
  {
    id: 3,
    userName: "王五",
    content: "建议增加商品评价功能，这样可以帮助其他用户更好地了解商品。",
    status: "pending",
    createTime: "2024-03-18 09:15:00",
    reply: "",
  },
]);

// 过滤后的建议列表
const filteredSuggestions = computed(() => {
  let result = suggestions.value;

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter((item) => item.status === filterStatus.value);
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.content.toLowerCase().includes(keyword) ||
        item.userName.toLowerCase().includes(keyword)
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

// 处理回复
const handleReply = (suggestion) => {
  currentSuggestion.value = suggestion;
  replyForm.value.content = "";
  replyVisible.value = true;
};

// 提交回复
const submitReply = async () => {
  if (!replyForm.value.content) {
    ElMessage.warning("请输入回复内容");
    return;
  }

  submitting.value = true;
  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 更新建议状态和回复内容
    const index = suggestions.value.findIndex(
      (item) => item.id === currentSuggestion.value.id
    );
    if (index !== -1) {
      suggestions.value[index].status = "processed";
      suggestions.value[index].reply = replyForm.value.content;
    }

    replyVisible.value = false;
    ElMessage.success("回复成功");
  } catch (error) {
    ElMessage.error("回复失败，请重试");
  } finally {
    submitting.value = false;
  }
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
