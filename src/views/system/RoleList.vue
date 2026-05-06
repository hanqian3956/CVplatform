<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">角色管理</span>
      <el-button v-permission="'system:role:create'" type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增角色
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="roleList" v-loading="loading" border>
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'enabled'" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button v-permission="'system:role:edit'" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button v-permission="'system:role:delete'" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新增角色'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="权限分配" prop="permissions">
          <el-tree
            ref="treeRef"
            :data="permissionTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedKeys"
            :props="{ label: 'name', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="enabled">正常</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
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
import { fetchRoles, createRole, modifyRole, removeRole } from '@/api/role'
import { fetchPermissions } from '@/api/permission'
import type { Role, Permission } from '@/types'

const loading = ref(false)
const roleList = ref<Role[]>([])
const allPermissions = ref<Permission[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const treeRef = ref<any>()
const currentId = ref('')
const checkedKeys = ref<string[]>([])

const form = ref({
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  status: 'enabled' as 'enabled' | 'disabled',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

const permissionTree = ref<any[]>([])

function buildPermissionTree(permissions: Permission[]) {
  const map = new Map<string, any>()
  const roots: any[] = []

  for (const p of permissions) {
    map.set(p.id, { ...p, children: [] })
  }

  for (const p of permissions) {
    const node = map.get(p.id)
    if (p.parentId && map.has(p.parentId)) {
      map.get(p.parentId).children.push(node)
    } else {
      roots.push(node)
    }
  }

  // 过滤掉空children
  function clean(node: any) {
    if (node.children.length === 0) {
      delete node.children
    } else {
      node.children.forEach(clean)
    }
  }
  roots.forEach(clean)

  return roots
}

async function loadData() {
  loading.value = true
  const res = await fetchRoles()
  roleList.value = res.data
  loading.value = false
}

async function loadPermissions() {
  const res = await fetchPermissions()
  allPermissions.value = res.data
  permissionTree.value = buildPermissionTree(res.data)
}

function handleAdd() {
  isEdit.value = false
  form.value = { name: '', code: '', description: '', permissions: [], status: 'enabled' }
  checkedKeys.value = []
  dialogVisible.value = true
}

function handleEdit(row: Role) {
  isEdit.value = true
  currentId.value = row.id
  form.value = {
    name: row.name,
    code: row.code,
    description: row.description,
    permissions: [...row.permissions],
    status: row.status,
  }
  // 只选中叶子节点（按钮权限）
  checkedKeys.value = allPermissions.value
    .filter(p => row.permissions.includes(p.code) && p.type === 'button')
    .map(p => p.id)
  dialogVisible.value = true
}

async function handleDelete(row: Role) {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', { type: 'warning' })
    await removeRole(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // cancel
  }
}

async function handleSubmit() {
  await formRef.value?.validate()

  // 获取树中选中的节点key
  const checked = treeRef.value?.getCheckedKeys() || []
  const halfChecked = treeRef.value?.getHalfCheckedKeys() || []
  const selectedIds = [...checked, ...halfChecked]

  // 将id映射为code
  const selectedCodes = allPermissions.value
    .filter(p => selectedIds.includes(p.id))
    .map(p => p.code)

  form.value.permissions = selectedCodes

  if (isEdit.value) {
    await modifyRole(currentId.value, form.value)
    ElMessage.success('修改成功')
  } else {
    await createRole(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

onMounted(() => {
  loadPermissions()
  loadData()
})
</script>
