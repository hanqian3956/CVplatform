<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">用户管理</span>
      <el-button v-permission="'system:user:create'" type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增用户
      </el-button>
    </div>

    <div class="table-container">
      <el-table :data="userList" v-loading="loading" border>
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="nickname" label="昵称" min-width="150" />
        <el-table-column prop="phone" label="联系方式" width="140" />
        <el-table-column prop="roleNames" label="角色" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="(name, idx) in row.roleNames" :key="idx" size="small" style="margin-right: 4px">
              {{ name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'enabled'" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button v-permission="'system:user:edit'" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button v-permission="'system:user:delete'" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
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
import { fetchUsers, createUser, modifyUser, removeUser } from '@/api/user'
import { fetchRoles } from '@/api/role'
import type { User, Role } from '@/types'

const loading = ref(false)
const userList = ref<User[]>([])
const roles = ref<Role[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentId = ref('')

const form = ref({
  username: '',
  nickname: '',
  password: '',
  phone: '',
  roleIds: [] as string[],
  status: 'enabled' as 'enabled' | 'disabled',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change', type: 'array' }],
}

async function loadData() {
  loading.value = true
  const res = await fetchUsers()
  userList.value = res.data
  loading.value = false
}

async function loadRoles() {
  const res = await fetchRoles()
  roles.value = res.data.filter(r => r.status === 'enabled')
}

function handleAdd() {
  isEdit.value = false
  form.value = { username: '', nickname: '', password: '', phone: '', roleIds: [], status: 'enabled' }
  dialogVisible.value = true
}

function handleEdit(row: User) {
  isEdit.value = true
  currentId.value = row.id
  form.value = {
    username: row.username,
    nickname: row.nickname,
    password: '',
    phone: row.phone || '',
    roleIds: row.roleIds,
    status: row.status,
  }
  dialogVisible.value = true
}

async function handleDelete(row: User) {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', { type: 'warning' })
    await removeUser(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // cancel
  }
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (isEdit.value) {
    const data: Partial<User> = {
      nickname: form.value.nickname,
      phone: form.value.phone,
      roleIds: form.value.roleIds,
      status: form.value.status,
    }
    if (form.value.password) {
      data.password = form.value.password
    }
    await modifyUser(currentId.value, data)
    ElMessage.success('修改成功')
  } else {
    await createUser(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

onMounted(() => {
  loadRoles()
  loadData()
})
</script>
