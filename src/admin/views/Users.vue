<template>
  <div class="users-page">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchForm.email"
            placeholder="请输入邮箱"
            clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable>
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
              {{ row.status === 'active' ? '正常' : '禁用' }}
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
                @click="handleStatusChange(row)">
                {{ row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                删除
              </el-button>
              <el-button type="info" size="small" @click="handleDetail(row)">
                详情
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

    <!-- 用户编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="500px">
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px">
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
            :inactive-value="'disabled'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="800px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{
              currentUser.username
            }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{
              currentUser.email
            }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{
              currentUser.phone
            }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{
              currentUser.createTime
            }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag
                :type="currentUser.status === 'active' ? 'success' : 'danger'">
                {{ currentUser.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="权限管理" name="role">
          <el-form :model="roleForm" label-width="100px">
            <el-form-item label="用户角色">
              <el-select v-model="roleForm.role_id" @change="handleRoleChange">
                <el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="权限列表">
              <el-tag
                v-for="permission in currentRole.permissions"
                :key="permission"
                class="permission-tag">
                {{ permission }}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="操作日志" name="logs">
          <el-table :data="userLogs" style="width: 100%">
            <el-table-column prop="action" label="操作类型" />
            <el-table-column prop="target" label="操作对象" />
            <el-table-column prop="details" label="详细信息" />
            <el-table-column prop="created_at" label="操作时间" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 搜索表单
const searchForm = reactive({
  username: '',
  email: '',
  status: '',
});

// 用户列表数据
const userList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const userFormRef = ref(null);
const userForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  status: 'active',
});

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6个字符', trigger: 'blur' },
  ],
};

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (searchForm.username) params.append('username', searchForm.username);
    if (searchForm.email) params.append('email', searchForm.email);
    if (searchForm.status) params.append('status', searchForm.status);

    const response = await fetch(`http://localhost:3000/users?${params}`);
    if (!response.ok) {
      throw new Error('获取用户列表失败');
    }
    const result = await response.json();

    if (result.code === 200) {
      userList.value = result.data;
      total.value = result.data.length;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error(error.message || '获取用户列表失败');
    userList.value = [];
    total.value = 0;
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
    searchForm[key] = '';
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

// 编辑用户
const handleEdit = (row) => {
  Object.keys(userForm).forEach((key) => {
    if (key !== 'password') {
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
        const url = `/users/${userForm.id}`;
        const method = 'PUT';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userForm),
        });

        const result = await response.json();
        if (result.code === 200) {
          ElMessage.success('更新成功');
          dialogVisible.value = false;
          fetchUserList();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('保存用户失败:', error);
        ElMessage.error(error.message || '操作失败');
      }
    }
  });
};

// 修改用户状态
const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 'active' ? '禁用' : '启用'}该用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    const response = await fetch(`http://localhost:3000/users/${row.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: row.status === 'active' ? 'disabled' : 'active',
      }),
    });

    const result = await response.json();
    if (result.code === 200) {
      row.status = row.status === 'active' ? 'disabled' : 'active';
      ElMessage.success('状态修改成功');
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('修改状态失败:', error);
      ElMessage.error(error.message || '修改状态失败');
    }
  }
};

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const response = await fetch(`http://localhost:3000/users/${row.id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (result.code === 200) {
      ElMessage.success('删除成功');
      fetchUserList();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error);
      ElMessage.error(error.message || '删除失败');
    }
  }
};

// 查看用户详情
const handleDetail = async (row) => {
  try {
    const [userResponse, roleResponse, logsResponse] = await Promise.all([
      fetch(`http://localhost:3000/users/${row.id}`),
      fetch('http://localhost:3000/roles'),
      fetch(`http://localhost:3000/users/${row.id}/logs`),
    ]);

    const [userResult, roleResult, logsResult] = await Promise.all([
      userResponse.json(),
      roleResponse.json(),
      logsResponse.json(),
    ]);

    if (
      userResult.code === 200 &&
      roleResult.code === 200 &&
      logsResult.code === 200
    ) {
      currentUser.value = userResult.data;
      roles.value = roleResult.data;
      userLogs.value = logsResult.data;
      roleForm.role_id = currentUser.value.role_id;
      detailDialogVisible.value = true;
    } else {
      throw new Error('获取用户详情失败');
    }
  } catch (error) {
    console.error('获取用户详情失败:', error);
    ElMessage.error(error.message || '获取用户详情失败');
  }
};

// 更新用户角色
const handleRoleChange = async (roleId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/users/${currentUser.value.id}/roles`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId }),
      }
    );

    if (!response.ok) {
      throw new Error('更新角色失败');
    }

    // 记录操作日志
    await fetch('http://localhost:3000/users/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.value.id,
        action: 'UPDATE_ROLE',
        target: 'USER',
        details: `更新用户角色为: ${
          roles.value.find((r) => r.id === roleId)?.name
        }`,
      }),
    });

    ElMessage.success('角色更新成功');
    fetchUserList();
  } catch (error) {
    console.error('更新角色失败:', error);
    ElMessage.error('更新角色失败');
  }
};

// 在 script setup 中添加新的响应式变量
const detailDialogVisible = ref(false);
const activeTab = ref('info');
const currentUser = ref({});
const userLogs = ref([]);
const roles = ref([
  { id: 1, name: '超级管理员', permissions: ['all'] },
  { id: 2, name: '商品管理员', permissions: ['product:read', 'product:write'] },
  { id: 3, name: '订单管理员', permissions: ['order:read', 'order:write'] },
  { id: 4, name: '普通用户', permissions: ['read'] },
]);
const currentRole = ref({});
const roleForm = reactive({
  role_id: null,
});
const roleOptions = ref([]);

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

.header-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.permission-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
