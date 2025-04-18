<template>
  <div class="users-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchForm.email"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="disabled" />
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

    <!-- 用户列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增用户
          </el-button>
        </div>
      </template>

      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="createTime" label="注册时间" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "正常" : "禁用" }}
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
                type="warning"
                size="small"
                @click="handleStatusChange(row)"
              >
                {{ row.status === "active" ? "禁用" : "启用" }}
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

    <!-- 用户编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="'active'"
            :inactive-value="'disabled'"
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

// 搜索表单
const searchForm = reactive({
  username: "",
  email: "",
  status: "",
});

// 用户列表数据
const userList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref("add"); // 'add' 或 'edit'
const userFormRef = ref(null);
const userForm = reactive({
  username: "",
  email: "",
  phone: "",
  password: "",
  status: "active",
});

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码不能少于6个字符", trigger: "blur" },
  ],
};

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    // TODO: 调用后端API获取用户列表
    // const response = await fetch('/api/users')
    // const data = await response.json()
    // 模拟数据
    userList.value = [
      {
        id: 1,
        username: "张三",
        email: "zhangsan@example.com",
        phone: "13800138000",
        createTime: "2024-03-20",
        status: "active",
      },
    ];
    total.value = 100;
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchUserList();
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
  fetchUserList();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchUserList();
};

// 新增用户
const handleAdd = () => {
  dialogType.value = "add";
  Object.keys(userForm).forEach((key) => {
    userForm[key] = key === "status" ? "active" : "";
  });
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row) => {
  dialogType.value = "edit";
  Object.keys(userForm).forEach((key) => {
    if (key !== "password") {
      userForm[key] = row[key];
    }
  });
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return;

  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端API保存用户数据
        // const response = await fetch('/api/users', {
        //   method: dialogType.value === 'add' ? 'POST' : 'PUT',
        //   body: JSON.stringify(userForm)
        // })
        ElMessage.success(dialogType.value === "add" ? "添加成功" : "更新成功");
        dialogVisible.value = false;
        fetchUserList();
      } catch (error) {
        console.error("保存用户失败:", error);
        ElMessage.error("操作失败");
      }
    }
  });
};

// 修改用户状态
const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === "active" ? "禁用" : "启用"}该用户吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    // TODO: 调用后端API修改用户状态
    // await fetch(`/api/users/${row.id}/status`, { method: 'PUT' })
    row.status = row.status === "active" ? "disabled" : "active";
    ElMessage.success("状态修改成功");
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改状态失败:", error);
      ElMessage.error("修改状态失败");
    }
  }
};

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm("确定要删除该用户吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // TODO: 调用后端API删除用户
    // await fetch(`/api/users/${row.id}`, { method: 'DELETE' })
    ElMessage.success("删除成功");
    fetchUserList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除用户失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

onMounted(() => {
  fetchUserList();
});
</script>

<style scoped>
.users-page {
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
</style>
