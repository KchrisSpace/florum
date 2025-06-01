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
        <el-form-item label="修改密码">
          <el-switch v-model="showPasswordField" />
        </el-form-item>
        <el-form-item label="新密码" prop="password" v-if="showPasswordField">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入新密码" />
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
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="600px">
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
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { API_URL } from '../../pages/const';
import { ElMessage, ElMessageBox } from 'element-plus';

const roles = ref([]);
onMounted(async () => {
  fetchUserList();
  // 获取角色列表
  const res = await fetch(`${API_URL}/roles`);
  const data = await res.json();
  if (data.code === 200) {
    roles.value = data.data;
  }
});
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
  status: 'active', // 默认值
});

// 表单验证规则
const showPasswordField = ref(false);
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
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (showPasswordField.value && (!value || value.trim() === '')) {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      },
    },
    {
      min: 6,
      message: '密码不能少于6个字符',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (showPasswordField.value && value && value.length < 6) {
          callback(new Error('密码不能少于6个字符'));
        } else {
          callback();
        }
      },
    },
  ],
};

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params = new URLSearchParams();

    // 添加分页参数
    params.append('page', currentPage.value);
    params.append('pageSize', pageSize.value);

    // 添加搜索条件，只有当有值时才添加
    if (searchForm.username && searchForm.username.trim()) {
      params.append('username', searchForm.username.trim());
    }
    if (searchForm.email && searchForm.email.trim()) {
      params.append('email', searchForm.email.trim());
    }
    if (searchForm.status) {
      params.append('status', searchForm.status);
    }

    console.log('请求URL:', `${API_URL}/users?${params.toString()}`);
    console.log('搜索条件:', searchForm);

    const response = await fetch(`${API_URL}/users?${params.toString()}`);
    if (!response.ok) {
      throw new Error('获取用户列表失败');
    }

    const result = await response.json();
    console.log('接口返回数据:', result);

    if (result.code === 200) {
      // 处理不同的数据结构
      let userData = [];
      let totalCount = 0;

      if (result.data) {
        if (Array.isArray(result.data)) {
          // 如果直接返回数组
          userData = result.data;
          totalCount = result.data.length;
        } else if (result.data.list && Array.isArray(result.data.list)) {
          // 如果返回 {list: [], total: number} 格式
          userData = result.data.list;
          totalCount = result.data.total || result.data.list.length;
        } else {
          // 如果返回单个对象，转换为数组
          userData = [result.data];
          totalCount = 1;
        }
      }

      console.log('处理后的用户数据:', userData);
      console.log('总数:', totalCount);

      // 确保数据格式正确
      userList.value = userData.map((u) => {
        const user = {
          id: u.id,
          username: u.username || u.user_name || '',
          email: u.email || u.user_email || '',
          phone: u.phone || u.user_phone || '',
          createTime: u.createTime || u.created_at || '',
          status: u.status || 'active',
        };
        console.log('处理后的单条用户数据:', user);
        return user;
      });
      total.value = totalCount;
    } else {
      throw new Error(result.message || '获取用户列表失败');
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
  currentPage.value = 1; // 重置到第一页
  fetchUserList();
};

// 重置搜索
const resetSearch = () => {
  // 重置所有搜索条件
  searchForm.username = '';
  searchForm.email = '';
  searchForm.status = '';
  currentPage.value = 1; // 重置到第一页
  fetchUserList();
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
  userForm.id = row.id;
  // 强制转换为字符串，防止 undefined/null
  userForm.status = row.status === 'active' ? 'active' : 'disabled';
  // 清空密码字段和密码显示开关
  userForm.password = '';
  showPasswordField.value = false;
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return;

  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构建更新数据对象
        const updateData = {};

        // 只添加有值的字段
        if (userForm.username) updateData.user_name = userForm.username;
        if (userForm.email) updateData.user_email = userForm.email;
        if (userForm.phone) updateData.user_phone = userForm.phone;
        // 只有当密码不为空时才更新密码
        if (userForm.password && userForm.password.trim() !== '') {
          updateData.user_password = userForm.password;
        }
        if (userForm.status) updateData.status = userForm.status;

        // 添加更新时间
        updateData.updated_at = new Date().toISOString();

        // 如果没有要更新的字段，提示错误
        if (Object.keys(updateData).length === 0) {
          ElMessage.warning('没有要更新的字段');
          return;
        }

        console.log('发送的更新数据:', updateData);

        // 发送更新请求
        const url = `${API_URL}/users/${userForm.id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userData: JSON.stringify(updateData) }),
        });

        const result = await response.json();
        if (result.code === 200) {
          ElMessage.success('更新成功');
          dialogVisible.value = false;
          fetchUserList();
        } else {
          throw new Error(result.message || '保存用户失败');
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
    // 弹出确认对话框
    await ElMessageBox.confirm(
      `确定要${row.status === 'active' ? '禁用' : '启用'}该用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 构建更新数据
    const updateData = {
      status: row.status === 'active' ? 'disabled' : 'active',
      updated_at: new Date().toISOString(),
    };

    // 发送PUT请求更新状态
    const response = await fetch(`${API_URL}/users/${row.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData: JSON.stringify(updateData) }),
    });

    const result = await response.json();
    if (result.code === 200) {
      // 更新本地状态
      row.status = updateData.status;
      ElMessage.success('状态修改成功');
    } else {
      throw new Error(result.message || '修改状态失败');
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
    // 弹出确认对话框
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    // 发送DELETE请求删除用户
    const response = await fetch(`${API_URL}/users/${row.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('删除失败');
    }

    const result = await response.json();
    if (result.code === 200) {
      ElMessage.success('删除成功');
      // 重新获取用户列表
      fetchUserList();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error);
      ElMessage.error(error.message || '删除用户失败');
    }
  }
};

// 用户详情
const handleDetail = (row) => {
  fetchUserDetail(row.id); // 用 id 字段
};

const fetchUserDetail = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error('获取用户详情失败');
    }
    const result = await response.json();
    // 兼容后端返回格式
    const user = result.data || result;
    Object.assign(currentUser, {
      username: user.user_name,
      email: user.user_email,
      phone: user.user_phone,
      createTime: user.createTime || user.created_at || '',
      status: user.status || 'active',
    });
    detailDialogVisible.value = true;
  } catch (error) {
    console.error('获取用户详情失败:', error);
    ElMessage.error(error.message || '获取用户详情失败');
  }
};

// 当前用户
const currentUser = reactive({
  username: '',
  email: '',
  phone: '',
  createTime: '',
  status: '',
});
const detailDialogVisible = ref(false);
// 初始化
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

.list-card {
  margin-bottom: 20px;
}

.pagination {
  text-align: right;
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.permission-tag {
  margin-right: 5px;
}
</style>
