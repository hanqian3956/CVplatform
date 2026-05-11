<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">租户管理</span>
    </div>

    <el-tabs v-model="activeTab" class="user-tabs">
      <el-tab-pane label="租户算法" name="user">
        <div class="search-form">
          <el-form :model="searchForm" inline>
            <el-form-item label="用户">
              <el-input v-model="searchForm.keyword" placeholder="联系人/公司" clearable />
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
            <el-table-column prop="company" label="公司" min-width="180" />
            <el-table-column prop="userName" label="联系人" min-width="120" />
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
      </el-tab-pane>

      <el-tab-pane name="enterprise">
        <template #label>
          <el-badge :is-dot="enterprisePendingCount > 0" class="tab-badge">
            <span>企业认证审批</span>
          </el-badge>
        </template>
        <div class="search-form">
          <el-form :model="enterpriseSearch" inline>
            <el-form-item label="关键字">
              <el-input v-model="enterpriseSearch.keyword" placeholder="企业名称/联系人/电话" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="enterpriseSearch.status" placeholder="全部" clearable style="width: 140px">
                <el-option label="待审批" value="pending" />
                <el-option label="已通过" value="approved" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadEnterpriseAudits">
                <el-icon><Search /></el-icon>查询
              </el-button>
              <el-button @click="resetEnterpriseSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table-container">
          <el-table :data="enterpriseList" v-loading="enterpriseLoading" border>
            <el-table-column prop="enterpriseName" label="企业名称" min-width="200" />
            <el-table-column prop="contactName" label="联系人" width="100" />
            <el-table-column prop="contactPhone" label="联系人电话" width="140" />
            <el-table-column prop="salesPerson" label="销售人员" width="120" />
            <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.status === 'pending'" type="warning">待审批</el-tag>
                <el-tag v-else-if="row.status === 'approved'" type="success">已通过</el-tag>
                <el-tag v-else type="danger">已驳回</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提交时间" width="160" />
            <el-table-column label="操作" width="160" fixed="right" align="center">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 'pending'"
                  type="primary"
                  link
                  size="small"
                  @click="handleReviewEnterprise(row)"
                >审批</el-button>
                <el-button type="primary" link size="small" @click="handleViewEnterprise(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="enterprisePagination.page"
              v-model:page-size="enterprisePagination.pageSize"
              :total="enterprisePagination.total"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              @change="loadEnterpriseAudits"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane name="trial">
        <template #label>
          <el-badge :is-dot="trialPendingCount > 0" class="tab-badge">
            <span>算法试用审批</span>
          </el-badge>
        </template>
        <div class="search-form">
          <el-form :model="trialSearch" inline>
            <el-form-item label="关键字">
              <el-input v-model="trialSearch.keyword" placeholder="企业名称/算法名称/申请人" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="trialSearch.status" placeholder="全部" clearable style="width: 140px">
                <el-option label="待审批" value="pending" />
                <el-option label="已通过" value="approved" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadTrialAudits">
                <el-icon><Search /></el-icon>查询
              </el-button>
              <el-button @click="resetTrialSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table-container">
          <el-table :data="trialList" v-loading="trialLoading" border>
            <el-table-column prop="enterpriseName" label="企业名称" min-width="180" />
            <el-table-column prop="algorithmName" label="算法名称" min-width="150" />
            <el-table-column prop="algorithmId" label="算法ID" width="120" />
            <el-table-column prop="videoChannels" label="视频接入路数" width="130" align="center" />
            <el-table-column prop="applicantName" label="申请人" width="100" />
            <el-table-column prop="applicantPhone" label="申请人电话" width="140" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.status === 'pending'" type="warning">待审批</el-tag>
                <el-tag v-else-if="row.status === 'approved'" type="success">已通过</el-tag>
                <el-tag v-else type="danger">已驳回</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提交时间" width="160" />
            <el-table-column label="操作" width="160" fixed="right" align="center">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 'pending'"
                  type="primary"
                  link
                  size="small"
                  @click="handleReviewTrial(row)"
                >审批</el-button>
                <el-button type="primary" link size="small" @click="handleViewTrial(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="trialPagination.page"
              v-model:page-size="trialPagination.pageSize"
              :total="trialPagination.total"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              @change="loadTrialAudits"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 用户授权详情弹窗 -->
    <el-dialog v-model="dialogVisible" :title="`租户管理 - ${currentUserName}`" width="1200px">
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
              :default-value="defaultPickerDates"
            />
          </el-form-item>
          <el-form-item label="状态" prop="purchaseStatus">
            <el-select v-model="form.purchaseStatus" placeholder="请选择状态" style="width: 160px">
              <el-option label="试用中" value="trial" />
              <el-option label="已购买" value="purchased" />
            </el-select>
          </el-form-item>
          <el-form-item label="视频路数" prop="videoChannels">
            <el-input-number
              v-model="form.videoChannels"
              :min="1"
              :precision="0"
              :step="1"
              step-strictly
              placeholder="请输入视频路数"
              style="width: 160px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">{{ isEditForm ? '保存' : '添加' }}</el-button>
            <el-button @click="handleCancelForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 该用户授权列表 -->
      <el-table :data="sortedConfigs" border size="small" @sort-change="handleSortChange">
        <el-table-column prop="algorithmName" label="算法名称" min-width="150" />
        <el-table-column prop="videoChannels" label="视频路数" width="100" align="center" />
        <el-table-column prop="startTime" label="授权时间" width="120" />
        <el-table-column prop="endTime" label="结束时间" width="120" />
        <el-table-column prop="validity" label="有效期" width="120" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag v-if="row.cancelled" type="info">取消授权</el-tag>
            <el-tag v-else-if="isExpired(row.endTime)" type="danger">已过期</el-tag>
            <el-tag v-else type="success">有效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.purchaseStatus === 'purchased'" type="primary">已购买</el-tag>
            <el-tag v-else type="warning">试用中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.operator || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEditConfig(row)">编辑</el-button>
            <el-button type="danger" link size="small" :disabled="row.cancelled" @click="handleCancelAuth(row)">取消授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog v-model="auditDialogVisible" :title="auditDialogTitle" width="560px">
      <el-descriptions v-if="currentAuditType === 'enterprise' && currentEnterprise" :column="1" border size="small">
        <el-descriptions-item label="企业名称">{{ currentEnterprise.enterpriseName }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ currentEnterprise.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系人电话">{{ currentEnterprise.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="销售人员">{{ currentEnterprise.salesPerson }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentEnterprise.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentEnterprise.createTime }}</el-descriptions-item>
        <el-descriptions-item v-if="currentEnterprise.status !== 'pending'" label="审批人">{{ currentEnterprise.auditor }}</el-descriptions-item>
        <el-descriptions-item v-if="currentEnterprise.status !== 'pending'" label="审批意见">{{ currentEnterprise.auditRemark }}</el-descriptions-item>
        <el-descriptions-item v-if="currentEnterprise.status !== 'pending'" label="审批时间">{{ currentEnterprise.auditTime }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions v-if="currentAuditType === 'trial' && currentTrial" :column="1" border size="small">
        <el-descriptions-item label="企业名称">{{ currentTrial.enterpriseName }}</el-descriptions-item>
        <el-descriptions-item label="算法名称">{{ currentTrial.algorithmName }}</el-descriptions-item>
        <el-descriptions-item label="算法ID">{{ currentTrial.algorithmId }}</el-descriptions-item>
        <el-descriptions-item label="视频接入路数">{{ currentTrial.videoChannels }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentTrial.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="申请人电话">{{ currentTrial.applicantPhone }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentTrial.createTime }}</el-descriptions-item>
        <el-descriptions-item v-if="currentTrial.status !== 'pending'" label="审批人">{{ currentTrial.auditor }}</el-descriptions-item>
        <el-descriptions-item v-if="currentTrial.status !== 'pending'" label="审批意见">{{ currentTrial.auditRemark }}</el-descriptions-item>
        <el-descriptions-item v-if="currentTrial.status !== 'pending'" label="审批时间">{{ currentTrial.auditTime }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="auditEditable" class="audit-form">
        <el-form :model="auditForm" label-width="90px">
          <el-form-item label="审批意见">
            <el-input v-model="auditForm.auditRemark" type="textarea" :rows="3" placeholder="请输入审批意见" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="auditDialogVisible = false">关闭</el-button>
        <template v-if="auditEditable">
          <el-button type="danger" @click="handleSubmitAudit('rejected')">驳回</el-button>
          <el-button type="primary" @click="handleSubmitAudit('approved')">通过</el-button>
        </template>
      </template>
    </el-dialog>

    <!-- 试用审批通过弹窗 -->
    <el-dialog v-model="trialApproveDialogVisible" title="试用审批通过" width="560px">
      <el-form ref="trialApproveFormRef" :model="trialApproveForm" :rules="trialApproveRules" label-width="110px">
        <el-form-item label="算法">
          <el-input :value="trialApproveForm.algorithmName" disabled />
        </el-form-item>
        <el-form-item label="有效期" prop="timeRange">
          <el-date-picker
            v-model="trialApproveForm.timeRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="视频路数" prop="videoChannels">
          <el-input-number
            v-model="trialApproveForm.videoChannels"
            :min="1"
            :precision="0"
            :step="1"
            step-strictly
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="trialApproveForm.auditRemark" type="textarea" :rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="trialApproveDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="trialApproveSubmitting" @click="handleConfirmTrialApprove">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  fetchUserAlgorithmSummaries,
  fetchConfigsByUserId,
  createUserAlgorithmConfig,
  modifyUserAlgorithmConfig,
} from '@/api/userAlgorithm'
import { fetchAlgorithmList } from '@/api/algorithm'
import {
  fetchEnterpriseAudits,
  reviewEnterpriseAudit,
  fetchTrialAudits,
  reviewTrialAudit,
  fetchAuditPendingCounts,
} from '@/api/audit'
import { useUserStore } from '@/stores/user'
import type { UserAlgorithmSummary, UserAlgorithmConfig, Algorithm, EnterpriseAudit, AlgorithmTrialAudit } from '@/types'

const userStore = useUserStore()

const activeTab = ref<'user' | 'enterprise' | 'trial'>('user')
const enterprisePendingCount = ref(0)
const trialPendingCount = ref(0)

async function loadPendingCounts() {
  const res = await fetchAuditPendingCounts()
  enterprisePendingCount.value = res.data.enterprise
  trialPendingCount.value = res.data.trial
}

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
  purchaseStatus: 'trial' as 'trial' | 'purchased',
  videoChannels: 1,
})

const timeRange = ref<string[]>([])

function getTodayStr(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 日期选择器默认展示月份（为了使开始日期默认在当天附近）
const defaultPickerDates = ref<[Date, Date]>([new Date(), new Date()])

const formRules: FormRules = {
  algorithmId: [{ required: true, message: '请选择算法', trigger: 'change' }],
  purchaseStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
  videoChannels: [
    { required: true, message: '请输入视频路数', trigger: 'blur' },
    { type: 'integer', min: 1, message: '视频路数必须为正整数', trigger: 'blur' },
  ],
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

// 有效期排序：点击后按 有效 -> 取消授权 -> 已过期排序；再次点击恢复按授权时间倒序
const validitySortActive = ref(false)

function getValidityOrder(row: UserAlgorithmConfig): number {
  if (row.cancelled) return 1
  if (isExpired(row.endTime)) return 2
  return 0
}

const sortedConfigs = computed(() => {
  if (validitySortActive.value) {
    return [...userConfigs.value].sort((a, b) => getValidityOrder(a) - getValidityOrder(b))
  }
  return userConfigs.value
})

function handleSortChange(params: { prop: string; order: string | null }) {
  if (params.prop === 'validity') {
    validitySortActive.value = params.order !== null
  }
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
    purchaseStatus: 'trial',
    videoChannels: 1,
  }
  // 默认开始时间为当天
  timeRange.value = [getTodayStr(), '']
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
    purchaseStatus: row.purchaseStatus || 'trial',
    videoChannels: row.videoChannels || 1,
  }
  timeRange.value = [row.startTime, row.endTime]
  showForm.value = true
}

function handleCancelForm() {
  showForm.value = false
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (!timeRange.value || timeRange.value.length !== 2 || !timeRange.value[0] || !timeRange.value[1]) {
    ElMessage.warning('请选择有效期')
    return
  }
  // 试用期限制：不超过 30 天
  if (form.value.purchaseStatus === 'trial') {
    const start = new Date(timeRange.value[0])
    const end = new Date(timeRange.value[1])
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays > 30) {
      ElMessage.warning('使试用期限请选择30天内')
      return
    }
  }
  form.value.startTime = timeRange.value[0]
  form.value.endTime = timeRange.value[1]

  if (isEditForm.value) {
    await modifyUserAlgorithmConfig(currentConfigId.value, {
      algorithmId: form.value.algorithmId,
      algorithmName: form.value.algorithmName,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      purchaseStatus: form.value.purchaseStatus,
      videoChannels: form.value.videoChannels,
      operator: userStore.userInfo?.nickname || userStore.userInfo?.username || '',
    })
    ElMessage.success('修改成功')
  } else {
    await createUserAlgorithmConfig({
      ...form.value,
      operator: userStore.userInfo?.nickname || userStore.userInfo?.username || '',
    })
    ElMessage.success('新增成功')
  }
  showForm.value = false
  await loadUserConfigs()
  await loadData() // 刷新列表统计
}

async function handleCancelAuth(row: UserAlgorithmConfig) {
  try {
    await ElMessageBox.confirm(`确定要取消算法「${row.algorithmName}」的授权吗？`, '提示', { type: 'warning' })
    await modifyUserAlgorithmConfig(row.id, {
      cancelled: true,
      operator: userStore.userInfo?.nickname || userStore.userInfo?.username || '',
    })
    ElMessage.success('已取消授权')
    await loadUserConfigs()
    await loadData()
  } catch {
    // cancel
  }
}

function isExpired(endTime: string): boolean {
  return new Date(endTime) < new Date()
}

// ===== 企业认证审批 =====
const enterpriseLoading = ref(false)
const enterpriseList = ref<EnterpriseAudit[]>([])
const enterpriseSearch = ref({ keyword: '', status: '' })
const enterprisePagination = ref({ page: 1, pageSize: 10, total: 0 })

async function loadEnterpriseAudits() {
  enterpriseLoading.value = true
  const res = await fetchEnterpriseAudits({
    keyword: enterpriseSearch.value.keyword,
    status: enterpriseSearch.value.status,
    page: enterprisePagination.value.page,
    pageSize: enterprisePagination.value.pageSize,
  })
  enterpriseList.value = res.data.list
  enterprisePagination.value.total = res.data.total
  enterpriseLoading.value = false
  loadPendingCounts()
}

function resetEnterpriseSearch() {
  enterpriseSearch.value = { keyword: '', status: '' }
  enterprisePagination.value.page = 1
  loadEnterpriseAudits()
}

// ===== 算法试用审批 =====
const trialLoading = ref(false)
const trialList = ref<AlgorithmTrialAudit[]>([])
const trialSearch = ref({ keyword: '', status: '' })
const trialPagination = ref({ page: 1, pageSize: 10, total: 0 })

async function loadTrialAudits() {
  trialLoading.value = true
  const res = await fetchTrialAudits({
    keyword: trialSearch.value.keyword,
    status: trialSearch.value.status,
    page: trialPagination.value.page,
    pageSize: trialPagination.value.pageSize,
  })
  trialList.value = res.data.list
  trialPagination.value.total = res.data.total
  trialLoading.value = false
  loadPendingCounts()
}

function resetTrialSearch() {
  trialSearch.value = { keyword: '', status: '' }
  trialPagination.value.page = 1
  loadTrialAudits()
}

// ===== 审批弹窗 =====
const auditDialogVisible = ref(false)
const currentAuditType = ref<'enterprise' | 'trial'>('enterprise')
const currentEnterprise = ref<EnterpriseAudit | null>(null)
const currentTrial = ref<AlgorithmTrialAudit | null>(null)
const auditEditable = ref(false)
const auditForm = ref({ auditRemark: '' })

const auditDialogTitle = computed(() => {
  if (currentAuditType.value === 'enterprise') {
    return auditEditable.value ? '企业认证审批' : '企业认证详情'
  }
  return auditEditable.value ? '算法试用审批' : '算法试用详情'
})

function handleReviewEnterprise(row: EnterpriseAudit) {
  currentAuditType.value = 'enterprise'
  currentEnterprise.value = row
  currentTrial.value = null
  auditEditable.value = true
  auditForm.value = { auditRemark: '' }
  auditDialogVisible.value = true
}

function handleViewEnterprise(row: EnterpriseAudit) {
  currentAuditType.value = 'enterprise'
  currentEnterprise.value = row
  currentTrial.value = null
  auditEditable.value = false
  auditDialogVisible.value = true
}

function handleReviewTrial(row: AlgorithmTrialAudit) {
  currentAuditType.value = 'trial'
  currentTrial.value = row
  currentEnterprise.value = null
  auditEditable.value = true
  auditForm.value = { auditRemark: '' }
  auditDialogVisible.value = true
}

function handleViewTrial(row: AlgorithmTrialAudit) {
  currentAuditType.value = 'trial'
  currentTrial.value = row
  currentEnterprise.value = null
  auditEditable.value = false
  auditDialogVisible.value = true
}

async function handleSubmitAudit(status: 'approved' | 'rejected') {
  const auditor = userStore.userInfo?.nickname || userStore.userInfo?.username || ''
  const remark = auditForm.value.auditRemark || (status === 'approved' ? '审批通过' : '审批驳回')
  if (currentAuditType.value === 'enterprise' && currentEnterprise.value) {
    await reviewEnterpriseAudit(currentEnterprise.value.id, {
      status,
      auditor,
      auditRemark: remark,
    })
    ElMessage.success(status === 'approved' ? '已通过审批' : '已驳回')
    await loadEnterpriseAudits()
  } else if (currentAuditType.value === 'trial' && currentTrial.value) {
    // 试用通过：打开试用配置弹窗
    if (status === 'approved') {
      openTrialApproveDialog(currentTrial.value)
      return
    }
    await reviewTrialAudit(currentTrial.value.id, {
      status,
      auditor,
      auditRemark: remark,
    })
    ElMessage.success('已驳回')
    await loadTrialAudits()
  }
  auditDialogVisible.value = false
}

// ===== 试用审批通过弹窗 =====
const trialApproveDialogVisible = ref(false)
const trialApproveSubmitting = ref(false)
const trialApproveFormRef = ref<FormInstance>()
const trialApproveForm = ref({
  trialId: '',
  algorithmId: '',
  algorithmName: '',
  enterpriseName: '',
  applicantName: '',
  applicantPhone: '',
  timeRange: [] as string[],
  videoChannels: 1,
  auditRemark: '',
})
const trialApproveRules: FormRules = {
  timeRange: [{ required: true, message: '请选择有效期', trigger: 'change' }],
  videoChannels: [{ required: true, message: '请输入视频路数', trigger: 'blur' }],
}

function openTrialApproveDialog(row: AlgorithmTrialAudit) {
  const today = new Date()
  const after7 = new Date()
  after7.setDate(today.getDate() + 7)
  const fmt = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
  trialApproveForm.value = {
    trialId: row.id,
    algorithmId: row.algorithmId,
    algorithmName: row.algorithmName,
    enterpriseName: row.enterpriseName,
    applicantName: row.applicantName,
    applicantPhone: row.applicantPhone,
    timeRange: [fmt(today), fmt(after7)],
    videoChannels: row.videoChannels || 1,
    auditRemark: '',
  }
  auditDialogVisible.value = false
  trialApproveDialogVisible.value = true
}

async function handleConfirmTrialApprove() {
  if (!trialApproveFormRef.value) return
  const valid = await trialApproveFormRef.value.validate().catch(() => false)
  if (!valid) return
  const [startTime, endTime] = trialApproveForm.value.timeRange
  if (!startTime || !endTime) {
    ElMessage.warning('请选择有效期')
    return
  }
  trialApproveSubmitting.value = true
  try {
    const auditor = userStore.userInfo?.nickname || userStore.userInfo?.username || ''
    const remark = trialApproveForm.value.auditRemark || '审批通过'
    // 1. 更新审批状态
    await reviewTrialAudit(trialApproveForm.value.trialId, {
      status: 'approved',
      auditor,
      auditRemark: remark,
    })
    // 2. 在租户管理中的算法列表中增加该算法记录
    const userId = trialApproveForm.value.applicantPhone || `u_${trialApproveForm.value.trialId}`
    await createUserAlgorithmConfig({
      userId,
      userName: trialApproveForm.value.applicantName,
      company: trialApproveForm.value.enterpriseName,
      algorithmId: trialApproveForm.value.algorithmId,
      algorithmName: trialApproveForm.value.algorithmName,
      startTime,
      endTime,
      purchaseStatus: 'trial',
      videoChannels: trialApproveForm.value.videoChannels,
      operator: auditor,
    })
    ElMessage.success('审批通过，已添加至租户算法列表')
    trialApproveDialogVisible.value = false
    await loadTrialAudits()
    await loadData()
  } finally {
    trialApproveSubmitting.value = false
  }
}

onMounted(() => {
  loadAlgorithms()
  loadData()
  loadEnterpriseAudits()
  loadTrialAudits()
  loadPendingCounts()
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

.user-tabs {
  margin-top: 8px;
}

.tab-badge :deep(.el-badge__content.is-dot) {
  top: 4px;
  right: -6px;
}

.audit-form {
  margin-top: 16px;
}
</style>
