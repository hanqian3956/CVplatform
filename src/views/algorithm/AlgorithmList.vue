<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">算法管理</span>
      <el-button v-permission="'algorithm:create'" type="primary" @click="$router.push('/algorithm/create')">
        <el-icon><Plus /></el-icon>新增算法
      </el-button>
    </div>

    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="算法名称/ID" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="上架" value="online" />
            <el-option label="下架" value="offline" />
          </el-select>
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
      <el-table :data="algorithmList" v-loading="loading" border>
        <el-table-column prop="id" label="算法ID" width="100" />
        <el-table-column prop="name" label="算法名称" min-width="150" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="latestVersion" label="最新版本" width="100" align="center" />
        <el-table-column label="模型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.modelFile" size="small" type="success">已上传</el-tag>
            <el-tag v-else size="small" type="info">未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'online'" type="success">上架</el-tag>
            <el-tag v-else type="info">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'algorithm:edit'" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button v-permission="'algorithm:toggle'" :type="row.status === 'online' ? 'danger' : 'success'" link @click="handleToggleStatus(row)">
              {{ row.status === 'online' ? '下架' : '上架' }}
            </el-button>
            <el-button v-permission="'algorithm:delete'" type="danger" link @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchAlgorithmList, toggleStatus, removeAlgorithm } from '@/api/algorithm'
import { fetchCategories } from '@/api/category'
import type { Algorithm, Category } from '@/types'

const router = useRouter()
const loading = ref(false)
const algorithmList = ref<Algorithm[]>([])
const categories = ref<Category[]>([])

const searchForm = ref({
  keyword: '',
  categoryId: '',
  status: '',
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

async function loadData() {
  loading.value = true
  const res = await fetchAlgorithmList({
    ...searchForm.value,
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
  })
  algorithmList.value = res.data.list
  pagination.value.total = res.data.total
  loading.value = false
}

async function loadCategories() {
  const res = await fetchCategories()
  categories.value = res.data
}

function handleSearch() {
  pagination.value.page = 1
  loadData()
}

function handleReset() {
  searchForm.value = { keyword: '', categoryId: '', status: '' }
  pagination.value.page = 1
  loadData()
}

function handlePageChange() {
  loadData()
}

function handleEdit(row: Algorithm) {
  router.push(`/algorithm/edit/${row.id}`)
}

async function handleToggleStatus(row: Algorithm) {
  const action = row.status === 'online' ? '下架' : '上架'
  try {
    await ElMessageBox.confirm(`确定要${action}该算法吗？`, '提示', { type: 'warning' })
    await toggleStatus(row.id)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch {
    // cancel
  }
}

async function handleDelete(row: Algorithm) {
  try {
    await ElMessageBox.confirm('确定要删除该算法吗？此操作不可恢复。', '提示', { type: 'warning' })
    await removeAlgorithm(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // cancel
  }
}

onMounted(() => {
  loadCategories()
  loadData()
})
</script>
