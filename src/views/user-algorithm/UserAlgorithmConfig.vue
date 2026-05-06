<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">用户管理</span>
    </div>

    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户">
          <el-input v-model="searchForm.keyword" placeholder="用户名称/账号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="userList" v-loading="loading" border>
        <el-table-column prop="userName" label="用户名称" min-width="120" />
        <el-table-column prop="userId" label="账号" width="120" />
        <el-table-column prop="company" label="所属公司" min-width="180" />
        <el-table-column prop="totalCount" label="已授权算法数量" width="140" align="center" />
        <el-table-column prop="validCount" label="有效期内" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.validCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiredCount" label="已过期" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.expiredCount > 0" type="danger">{{ row.expiredCount }}</el-tag>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEditUser(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 用户授权详情弹窗 -->
    <el-dialog v-model="dialogVisible" :title="`用户管理 - ${currentUserName}`" width="800px">
      <div class="dialog-header-actions">
        <el-button v-if="!showForm" type="primary" @click="handleShowAddForm">
          <el-icon><Plus /></el-icon>新增授权
        </el-button>
      </div>

      <!-- 新增/编辑表单 -->
      <div v-if="showForm" class="form-section">
        <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px" inline>
          <el-form-item label="选择算法" prop="algorithmId" style="width: 320px">
            <el-select v-model="form.algorithmId" placeholder="请选择算法" style="width: 220px" @change="handleAlgorithmChange">
              <el-option v-for="alg in algorithms" :key="alg.id" :label="alg.name" :value="alg.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="有效期" prop="timeRange">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">{{ isEditForm ? '保存' : '添加' }}</el-button>
            <el-button @click="handleCancelForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 该用户授权列表 -->
      <el-table :data="userConfigs" border size="small">
        <el-table-column prop="algorithmName" label="算法名称" min-width="150" />
        <el-table-column prop="startTime" label="授权时间" width="130" />
        <el-table-column prop="endTime" label="结束时间" width="130" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="isExpired(row.endTime)" type="danger">已过期</el-tag>
            <el-tag v-else type="success">有效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEditConfig(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDeleteConfig(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  fetchUserAlgorithmSummaries,
  fetchConfigsByUserId,
  createUserAlgorithmConfig,
  modifyUserAlgorithmConfig,
  removeUserAlgorithmConfig,
} from '@/api/userAlgorithm'
import { fetchAlgorithmList } from '@/api/algorithm'
import type { UserAlgorithmSummary, UserAlgorithmConfig, Algorithm } from '@/types'

const loading = ref(false)
const userList = ref<UserAlgorithmSummary[]>([])
const userConfigs = ref<UserAlgorithmConfig[]>([])
const algorithms = ref<Algorithm[]>([])

const searchForm = ref({
  keyword: '',
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const dialogVisible = ref(false)
const currentUserId = ref('')
const currentUserName = ref('')

const showForm = ref(false)
const isEditForm = ref(false)
const formRef = ref<FormInstance>()
const currentConfigId = ref('')

const form = ref({
  userId: '',
  userName: '',
  algorithmId: '',
  algorithmName: '',
  startTime: '',
  endTime: '',
})

const timeRange = ref<string[]>([])

const formRules: FormRules = {
  algorithmId: [{ required: true, message: '请选择算法', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  const res = await fetchUserAlgorithmSummaries({
    keyword: searchForm.value.keyword,
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
  })
  userList.value = res.data.list
  pagination.value.total = res.data.total
  loading.value = false
}

async function loadAlgorithms() {
  const res = await fetchAlgorithmList({ page: 1, pageSize: 1000 })
  algorithms.value = res.data.list
}

async function loadUserConfigs() {
  const res = await fetchConfigsByUserId(currentUserId.value)
  userConfigs.value = res.data
}

function handleSearch() {
  pagination.value.page = 1
  loadData()
}

function handleReset() {
  searchForm.value = { keyword: '' }
  pagination.value.page = 1
  loadData()
}

function handlePageChange() {
  loadData()
}

function handleAlgorithmChange(val: string) {
  const alg = algorithms.value.find(a => a.id === val)
  if (alg) {
    form.value.algorithmName = alg.name
  }
}

// 打开用户授权弹窗
async function handleEditUser(row: UserAlgorithmSummary) {
  currentUserId.value = row.userId
  currentUserName.value = row.userName
  dialogVisible.value = true
  showForm.value = false
  await loadUserConfigs()
}

// 显示新增表单
function handleShowAddForm() {
  isEditForm.value = false
  form.value = {
    userId: currentUserId.value,
    userName: currentUserName.value,
    algorithmId: '',
    algorithmName: '',
    startTime: '',
    endTime: '',
  }
  timeRange.value = []
  showForm.value = true
}

// 编辑某条授权
function handleEditConfig(row: UserAlgorithmConfig) {
  isEditForm.value = true
  currentConfigId.value = row.id
  form.value = {
    userId: row.userId,
    userName: row.userName,
    algorithmId: row.algorithmId,
    algorithmName: row.algorithmName,
    startTime: row.startTime,
    endTime: row.endTime,
  }
  timeRange.value = [row.startTime, row.endTime]
  showForm.value = true
}

function handleCancelForm() {
  showForm.value = false
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (!timeRange.value || timeRange.value.length !== 2) {
    ElMessage.warning('请选择有效期')
    return
  }
  form.value.startTime = timeRange.value[0]
  form.value.endTime = timeRange.value[1]

  if (isEditForm.value) {
    await modifyUserAlgorithmConfig(currentConfigId.value, {
      algorithmId: form.value.algorithmId,
      algorithmName: form.value.algorithmName,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
    })
    ElMessage.success('修改成功')
  } else {
    await createUserAlgorithmConfig(form.value)
    ElMessage.success('新增成功')
  }
  showForm.value = false
  await loadUserConfigs()
  await loadData() // 刷新列表统计
}

async function handleDeleteConfig(row: UserAlgorithmConfig) {
  try {
    await ElMessageBox.confirm('确定要删除该授权吗？', '提示', { type: 'warning' })
    await removeUserAlgorithmConfig(row.id)
    ElMessage.success('删除成功')
    await loadUserConfigs()
    await loadData()
  } catch {
    // cancel
  }
}

function isExpired(endTime: string): boolean {
  return new Date(endTime) < new Date()
}

onMounted(() => {
  loadAlgorithms()
  loadData()
})
</script>

<style scoped lang="scss">
.dialog-header-actions {
  margin-bottom: 16px;
}

.form-section {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
