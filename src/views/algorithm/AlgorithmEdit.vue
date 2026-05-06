<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">{{ isEdit ? '编辑算法' : '新增算法' }}</span>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
      <el-card class="form-card">
        <template #header>
          <span>基本信息</span>
        </template>
        <el-form-item label="算法名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入算法名称" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="一句话描述算法" />
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入详细描述" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 300px" @change="handleCategoryChange">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图URL" prop="coverUrl">
          <el-input v-model="form.coverUrl" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="视频URL" prop="videoUrl">
          <el-input v-model="form.videoUrl" placeholder="请输入视频URL（可选）" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="online">上架</el-radio>
            <el-radio label="offline">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card class="form-card">
        <template #header>
          <span>算法模型上传</span>
        </template>
        <el-form-item label="模型文件" prop="modelFile">
          <div v-if="form.modelFile" class="model-file-info">
            <el-icon class="model-icon"><Document /></el-icon>
            <div class="model-detail">
              <div class="model-name">{{ form.modelFile.name }}</div>
              <div class="model-meta">
                <el-tag size="small" type="info">{{ form.modelFile.type.toUpperCase() }}</el-tag>
                <span class="model-size">{{ formatFileSize(form.modelFile.size) }}</span>
              </div>
            </div>
            <el-button type="danger" link @click="handleRemoveModel">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </div>
          <el-upload
            v-else
            drag
            action="#"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="handleModelUpload"
            :before-upload="beforeModelUpload"
            accept=".pt,.onnx,.weights,.engine,.tflite,.pb"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 YOLO 模型格式：.pt / .onnx / .weights / .engine / .tflite / .pb
                <br>
                文件大小限制：500MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-card>

      <el-card class="form-card">
        <template #header>
          <span>应用场景</span>
        </template>
        <div v-for="(scene, index) in form.scenes" :key="index" class="scene-item">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-input v-model="scene.title" placeholder="场景标题" />
            </el-col>
            <el-col :span="14">
              <el-input v-model="scene.description" placeholder="场景描述" />
            </el-col>
            <el-col :span="2">
              <el-button type="danger" circle @click="removeScene(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" plain @click="addScene">
          <el-icon><Plus /></el-icon>添加场景
        </el-button>
      </el-card>

      <el-card v-if="isEdit" class="form-card">
        <template #header>
          <div class="card-header-flex">
            <span>版本管理</span>
            <el-button type="primary" size="small" @click="handleAddVersion">
              <el-icon><Plus /></el-icon>新增版本
            </el-button>
          </div>
        </template>
        <el-table :data="versionList" border size="small">
          <el-table-column prop="version" label="版本号" width="120" />
          <el-table-column prop="description" label="发布说明" min-width="200" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'published'" type="success">已发布</el-tag>
              <el-tag v-else type="info">草稿</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isLatest" label="最新版本" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.isLatest" type="primary">是</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEditVersion(row)">编辑</el-button>
              <el-button type="primary" link size="small" @click="handleSetLatest(row)" :disabled="row.isLatest">设为最新</el-button>
              <el-button type="danger" link size="small" @click="handleDeleteVersion(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" size="large" @click="handleSubmit">保存</el-button>
        <el-button size="large" @click="$router.back()">取消</el-button>
      </div>
    </el-form>

    <el-dialog v-model="versionDialogVisible" :title="isEditVersion ? '编辑版本' : '新增版本'" width="500px">
      <el-form :model="versionForm" :rules="versionRules" ref="versionFormRef" label-width="100px">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="versionForm.version" placeholder="如 V1.0.0" />
        </el-form-item>
        <el-form-item label="发布说明" prop="description">
          <el-input v-model="versionForm.description" type="textarea" :rows="3" placeholder="请输入版本发布说明" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="versionForm.status">
            <el-radio label="published">已发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设为最新">
          <el-switch v-model="versionForm.isLatest" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="versionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitVersion">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadRawFile } from 'element-plus'
import { Document, Delete, UploadFilled } from '@element-plus/icons-vue'
import {
  fetchAlgorithmDetail,
  createAlgorithm,
  modifyAlgorithm,
  fetchVersions,
  createVersion,
  modifyVersion,
  removeVersion,
} from '@/api/algorithm'
import { fetchCategories } from '@/api/category'
import type { Algorithm, AlgorithmVersion, Category } from '@/types'

const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const algorithmId = ref('')
const formRef = ref<FormInstance>()

const form = ref<Omit<Algorithm, 'id' | 'createTime' | 'updateTime' | 'latestVersion'> & { id?: string }>({
  name: '',
  subtitle: '',
  description: '',
  coverUrl: '',
  videoUrl: '',
  categoryId: '',
  categoryName: '',
  status: 'offline',
  scenes: [],
  modelFile: undefined,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入算法名称', trigger: 'blur' }],
  subtitle: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入详细描述', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const categories = ref<Category[]>([])

function handleCategoryChange(val: string) {
  const cat = categories.value.find(c => c.id === val)
  if (cat) {
    form.value.categoryName = cat.name
  }
}

function addScene() {
  form.value.scenes.push({ title: '', description: '' })
}

function removeScene(index: number) {
  form.value.scenes.splice(index, 1)
}

// 模型上传
const MAX_MODEL_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_MODEL_TYPES = ['pt', 'onnx', 'weights', 'engine', 'tflite', 'pb']

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()
  return ext ? ext.toLowerCase() : ''
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function beforeModelUpload(rawFile: UploadRawFile): boolean {
  const ext = getFileExtension(rawFile.name)
  if (!ALLOWED_MODEL_TYPES.includes(ext)) {
    ElMessage.error(`不支持的模型格式：.${ext}，仅支持 ${ALLOWED_MODEL_TYPES.join(' / ')}`)
    return false
  }
  if (rawFile.size > MAX_MODEL_SIZE) {
    ElMessage.error(`文件大小超过 500MB 限制`)
    return false
  }
  return true
}

function handleModelUpload(options: any) {
  const file = options.file as File
  const ext = getFileExtension(file.name)

  // Mock 上传：模拟进度后保存文件信息
  const uploadProgress = ref(0)
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 30
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      form.value.modelFile = {
        name: file.name,
        size: file.size,
        type: ext,
      }
      ElMessage.success('模型上传成功')
      options.onSuccess?.('ok')
    }
  }, 200)
}

function handleRemoveModel() {
  form.value.modelFile = undefined
  ElMessage.success('模型已删除')
}

// 版本管理
const versionList = ref<AlgorithmVersion[]>([])
const versionDialogVisible = ref(false)
const isEditVersion = ref(false)
const versionFormRef = ref<FormInstance>()
const currentVersionId = ref('')

const versionForm = ref({
  version: '',
  description: '',
  status: 'published' as 'published' | 'draft',
  isLatest: false,
})

const versionRules: FormRules = {
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  description: [{ required: true, message: '请输入发布说明', trigger: 'blur' }],
}

async function loadVersions() {
  if (!algorithmId.value) return
  const res = await fetchVersions(algorithmId.value)
  versionList.value = res.data
}

function handleAddVersion() {
  isEditVersion.value = false
  versionForm.value = { version: '', description: '', status: 'published', isLatest: false }
  versionDialogVisible.value = true
}

function handleEditVersion(row: AlgorithmVersion) {
  isEditVersion.value = true
  currentVersionId.value = row.id
  versionForm.value = {
    version: row.version,
    description: row.description,
    status: row.status,
    isLatest: row.isLatest,
  }
  versionDialogVisible.value = true
}

async function handleSetLatest(row: AlgorithmVersion) {
  try {
    await ElMessageBox.confirm('确定要将该版本设为最新版本吗？', '提示', { type: 'warning' })
    await modifyVersion(row.id, { isLatest: true })
    ElMessage.success('设置成功')
    loadVersions()
  } catch {
    // cancel
  }
}

async function handleDeleteVersion(row: AlgorithmVersion) {
  try {
    await ElMessageBox.confirm('确定要删除该版本吗？', '提示', { type: 'warning' })
    await removeVersion(row.id)
    ElMessage.success('删除成功')
    loadVersions()
  } catch {
    // cancel
  }
}

async function handleSubmitVersion() {
  await versionFormRef.value?.validate()
  const data = {
    ...versionForm.value,
    algorithmId: algorithmId.value,
  }
  if (isEditVersion.value) {
    await modifyVersion(currentVersionId.value, data)
    ElMessage.success('修改成功')
  } else {
    await createVersion(data)
    ElMessage.success('新增成功')
  }
  versionDialogVisible.value = false
  loadVersions()
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (isEdit.value) {
    await modifyAlgorithm(algorithmId.value, form.value)
    ElMessage.success('修改成功')
  } else {
    await createAlgorithm(form.value)
    ElMessage.success('新增成功')
  }
  router.push('/algorithm/list')
}

async function loadDetail() {
  const res = await fetchAlgorithmDetail(algorithmId.value)
  if (res.data) {
    const { id, createTime, updateTime, latestVersion, ...rest } = res.data
    form.value = { ...rest, id }
  }
}

async function loadCategories() {
  const res = await fetchCategories()
  categories.value = res.data
}

onMounted(() => {
  loadCategories()
  if (route.params.id) {
    isEdit.value = true
    algorithmId.value = route.params.id as string
    loadDetail()
    loadVersions()
  }
})
</script>

<style scoped lang="scss">
.form-container {
  max-width: 900px;
}

.form-card {
  margin-bottom: 20px;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scene-item {
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 40px;
}

.model-file-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.model-icon {
  font-size: 40px;
  color: #409eff;
}

.model-detail {
  flex: 1;
}

.model-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 6px;
}

.model-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-size {
  font-size: 12px;
  color: #909399;
}
</style>
