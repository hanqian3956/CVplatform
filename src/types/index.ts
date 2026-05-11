export interface AlgorithmVersion {
  id: string
  algorithmId: string
  version: string
  description: string
  status: 'published' | 'draft'
  isLatest: boolean
  createTime: string
}

export interface AlgorithmScene {
  title: string
  description: string
}

export interface AlgorithmModelFile {
  name: string
  size: number
  type: string
}

export interface Algorithm {
  id: string
  name: string
  subtitle: string
  description: string
  coverUrl: string
  videoUrl: string
  categoryId: string
  categoryName: string
  status: 'online' | 'offline'
  version: string
  latestVersion: string
  scenes: AlgorithmScene[]
  modelFile?: AlgorithmModelFile
  createTime: string
  updateTime: string
}

export interface Category {
  id: string
  name: string
  type: 'basic' | 'industry'
  sort: number
  algorithmCount: number
}

export interface UserAlgorithmConfig {
  id: string
  userId: string
  userName: string
  company: string
  algorithmId: string
  algorithmName: string
  startTime: string
  endTime: string
  purchaseStatus: 'trial' | 'purchased'
  videoChannels: number
  cancelled?: boolean
  operator?: string
  createTime: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface UserAlgorithmSummary {
  userId: string
  userName: string
  company: string
  totalCount: number
  validCount: number
  expiredCount: number
}

export interface Permission {
  id: string
  name: string
  code: string
  type: 'menu' | 'button'
  parentId?: string
  path?: string
  sort: number
}

export interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  status: 'enabled' | 'disabled'
  createTime: string
}

export interface User {
  id: string
  username: string
  nickname: string
  password: string
  phone: string
  roleIds: string[]
  roleNames: string[]
  status: 'enabled' | 'disabled'
  createTime: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export type AuditStatus = 'pending' | 'approved' | 'rejected'

export interface EnterpriseAudit {
  id: string
  enterpriseName: string
  contactName: string
  contactPhone: string
  salesPerson: string
  remark: string
  status: AuditStatus
  auditor?: string
  auditRemark?: string
  auditTime?: string
  createTime: string
}

export interface AlgorithmTrialAudit {
  id: string
  enterpriseName: string
  algorithmId: string
  algorithmName: string
  videoChannels: number
  applicantName: string
  applicantPhone: string
  status: AuditStatus
  auditor?: string
  auditRemark?: string
  auditTime?: string
  createTime: string
}
