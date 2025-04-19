<template>
  <div class="categories-page">
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增分类
          </el-button>
        </div>
      </template>

      <!-- 分类树形表格 -->
      <el-table
        :data="categoryList"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        v-loading="loading"
      >
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <span v-if="row.id !== editingRow?.id">{{ row.name }}</span>
            <el-input
              v-else
              v-model="editingRow.name"
              size="small"
              @keyup.enter="handleSave"
              @blur="handleSave"
            />
          </template>
        </el-table-column>
        <el-table-column prop="code" label="分类编码" width="150" />
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === "active" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleAddSub(row)">
                添加子分类
              </el-button>
              <el-button type="warning" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="handleStatusChange(row)"
              >
                {{ row.status === "active" ? "禁用" : "启用" }}
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row)"
                :disabled="row.children?.length > 0"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增分类' : '编辑分类'"
      width="500px"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-form-item label="上级分类">
          <el-cascader
            v-model="categoryForm.parentId"
            :options="categoryOptions"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'id',
              emitPath: false,
            }"
            placeholder="请选择上级分类"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="categoryForm.code" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="categoryForm.status"
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
import { ref, reactive, computed, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 分类列表数据
const categoryList = ref([]);
const loading = ref(false);
const editingRow = ref(null);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref("add");
const categoryFormRef = ref(null);
const categoryForm = reactive({
  parentId: null,
  name: "",
  code: "",
  sort: 0,
  status: "active",
});

// 表单验证规则
const categoryRules = {
  name: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入分类编码", trigger: "blur" },
    {
      pattern: /^[A-Z0-9_]+$/,
      message: "只能包含大写字母、数字和下划线",
      trigger: "blur",
    },
  ],
  sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
};

// 分类选项（用于级联选择器）
const categoryOptions = computed(() => {
  const formatOptions = (list) => {
    return list.map((item) => ({
      id: item.id,
      name: item.name,
      children: item.children ? formatOptions(item.children) : [],
    }));
  };
  return formatOptions(categoryList.value);
});

// 获取分类列表
const fetchCategoryList = async () => {
  loading.value = true;
  try {
    // TODO: 调用后端API获取分类列表
    // const response = await fetch('/api/categories')
    // const data = await response.json()
    // 模拟数据
    categoryList.value = [
      {
        id: 1,
        name: "鲜花",
        code: "FLOWERS",
        sort: 1,
        status: "active",
        children: [
          {
            id: 2,
            name: "玫瑰",
            code: "FLOWERS_ROSE",
            sort: 1,
            status: "active",
          },
        ],
      },
      {
        id: 3,
        name: "绿植",
        code: "PLANTS",
        sort: 2,
        status: "active",
      },
    ];
  } catch (error) {
    console.error("获取分类列表失败:", error);
    ElMessage.error("获取分类列表失败");
  } finally {
    loading.value = false;
  }
};

// 新增分类
const handleAdd = () => {
  dialogType.value = "add";
  Object.keys(categoryForm).forEach((key) => {
    categoryForm[key] = key === "status" ? "active" : key === "sort" ? 0 : null;
  });
  dialogVisible.value = true;
};

// 新增子分类
const handleAddSub = (row) => {
  dialogType.value = "add";
  Object.keys(categoryForm).forEach((key) => {
    categoryForm[key] = key === "status" ? "active" : key === "sort" ? 0 : null;
  });
  categoryForm.parentId = row.id;
  dialogVisible.value = true;
};

// 编辑分类
const handleEdit = (row) => {
  editingRow.value = { ...row };
};

// 保存行内编辑
const handleSave = async () => {
  if (!editingRow.value?.name) {
    ElMessage.warning("分类名称不能为空");
    return;
  }
  try {
    // TODO: 调用后端API保存分类
    // await fetch(`/api/categories/${editingRow.value.id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ name: editingRow.value.name })
    // })
    const index = categoryList.value.findIndex(
      (item) => item.id === editingRow.value.id
    );
    if (index !== -1) {
      categoryList.value[index].name = editingRow.value.name;
    }
    editingRow.value = null;
    ElMessage.success("保存成功");
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!categoryFormRef.value) return;

  await categoryFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端API保存分类数据
        // const response = await fetch('/api/categories', {
        //   method: dialogType.value === 'add' ? 'POST' : 'PUT',
        //   body: JSON.stringify(categoryForm)
        // })
        ElMessage.success(dialogType.value === "add" ? "添加成功" : "更新成功");
        dialogVisible.value = false;
        fetchCategoryList();
      } catch (error) {
        console.error("保存分类失败:", error);
        ElMessage.error("操作失败");
      }
    }
  });
};

// 修改分类状态
const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === "active" ? "禁用" : "启用"}该分类吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    // TODO: 调用后端API修改分类状态
    // await fetch(`/api/categories/${row.id}/status`, { method: 'PUT' })
    row.status = row.status === "active" ? "inactive" : "active";
    ElMessage.success("状态修改成功");
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改状态失败:", error);
      ElMessage.error("修改状态失败");
    }
  }
};

// 删除分类
const handleDelete = async (row) => {
  if (row.children?.length > 0) {
    ElMessage.warning("该分类下有子分类，无法删除");
    return;
  }

  try {
    await ElMessageBox.confirm("确定要删除该分类吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // TODO: 调用后端API删除分类
    // await fetch(`/api/categories/${row.id}`, { method: 'DELETE' })
    ElMessage.success("删除成功");
    fetchCategoryList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除分类失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

onMounted(() => {
  fetchCategoryList();
});
</script>

<style scoped>
.categories-page {
  padding: 20px;
}

.list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
