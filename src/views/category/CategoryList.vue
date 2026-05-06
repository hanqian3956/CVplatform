<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">分类管理</span>
      <el-button v-permission="'category:create'" type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增分类
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="categoryList" v-loading="loading" border>
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="type" label="分类类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'basic'" type="success">基础类</el-tag>
            <el-tag v-else type="warning">行业类</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="algorithmCount" label="算法数量" width="100" align="center" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'category:edit'" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button v-permission="'category:delete'" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="basic">基础类</el-radio>
            <el-radio label="industry">行业类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { fetchCategories, createCategory, modifyCategory, removeCategory } from '@/api/category'
import type { Category } from '@/types'

const loading = ref(false)
const categoryList = ref<Category[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentId = ref('')

const form = ref({
  name: '',
  type: 'basic' as 'basic' | 'industry',
  sort: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分类类型', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  const res = await fetchCategories()
  categoryList.value = res.data
  loading.value = false
}

function handleAdd() {
  isEdit.value = false
  form.value = { name: '', type: 'basic', sort: 0 }
  dialogVisible.value = true
}

function handleEdit(row: Category) {
  isEdit.value = true
  currentId.value = row.id
  form.value = { name: row.name, type: row.type, sort: row.sort }
  dialogVisible.value = true
}

async function handleDelete(row: Category) {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？如果分类下存在算法将无法删除。', '提示', {
      type: 'warning',
    })
    const res = await removeCategory(row.id)
    if (res.data) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error('该分类下存在算法，无法删除')
    }
  } catch {
    // cancel
  }
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (isEdit.value) {
    await modifyCategory(currentId.value, form.value)
    ElMessage.success('修改成功')
  } else {
    await createCategory(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

onMounted(() => {
  loadData()
})
</script>
