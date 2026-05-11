import type { EnterpriseAudit, AlgorithmTrialAudit } from '@/types'

let enterpriseAudits: EnterpriseAudit[] = [
  {
    id: 'ea1',
    enterpriseName: '杭州智能科技有限公司',
    contactName: '张伟',
    contactPhone: '13800138001',
    salesPerson: '李明',
    remark: '客户希望尽快完成认证，计划下月采购',
    status: 'pending',
    createTime: '2026-04-28 09:20:00',
  },
  {
    id: 'ea2',
    enterpriseName: '上海视界信息技术有限公司',
    contactName: '王芳',
    contactPhone: '13900139002',
    salesPerson: '赵强',
    remark: '已完成合同评审',
    status: 'approved',
    auditor: '管理员',
    auditRemark: '资料齐全，同意认证',
    auditTime: '2026-04-25 15:30:00',
    createTime: '2026-04-23 10:10:00',
  },
  {
    id: 'ea3',
    enterpriseName: '北京测试信息科技',
    contactName: '刘洋',
    contactPhone: '13700137003',
    salesPerson: '孙丽',
    remark: '',
    status: 'rejected',
    auditor: '管理员',
    auditRemark: '营业执照信息缺失',
    auditTime: '2026-04-20 11:00:00',
    createTime: '2026-04-19 16:00:00',
  },
]

let trialAudits: AlgorithmTrialAudit[] = [
  {
    id: 'ta1',
    enterpriseName: '杭州智能科技有限公司',
    algorithmId: 'a1',
    algorithmName: '烟火检测算法',
    videoChannels: 6,
    applicantName: '张伟',
    applicantPhone: '13800138001',
    status: 'pending',
    createTime: '2026-04-29 10:00:00',
  },
  {
    id: 'ta2',
    enterpriseName: '上海视界信息技术有限公司',
    algorithmId: 'a2',
    algorithmName: '安全帽识别',
    videoChannels: 4,
    applicantName: '王芳',
    applicantPhone: '13900139002',
    status: 'approved',
    auditor: '管理员',
    auditRemark: '同意试用 30 天',
    auditTime: '2026-04-26 09:00:00',
    createTime: '2026-04-25 14:00:00',
  },
]

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function nowStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// Enterprise Audit
export function getEnterpriseAudits(params: {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}): { list: EnterpriseAudit[]; total: number; page: number; pageSize: number } {
  const { keyword, status, page = 1, pageSize = 10 } = params
  let list = [...enterpriseAudits]
  if (keyword) {
    list = list.filter(
      e =>
        e.enterpriseName.includes(keyword) ||
        e.contactName.includes(keyword) ||
        e.contactPhone.includes(keyword)
    )
  }
  if (status) {
    list = list.filter(e => e.status === status)
  }
  list.sort((a, b) => b.createTime.localeCompare(a.createTime))
  const total = list.length
  const start = (page - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total, page, pageSize }
}

export function auditEnterprise(
  id: string,
  data: { status: 'approved' | 'rejected'; auditor: string; auditRemark: string }
): EnterpriseAudit | null {
  const index = enterpriseAudits.findIndex(e => e.id === id)
  if (index === -1) return null
  enterpriseAudits[index] = {
    ...enterpriseAudits[index],
    status: data.status,
    auditor: data.auditor,
    auditRemark: data.auditRemark,
    auditTime: nowStr(),
  }
  return enterpriseAudits[index]
}

export function getEnterprisePendingCount(): number {
  return enterpriseAudits.filter(e => e.status === 'pending').length
}

// Trial Audit
export function getTrialAudits(params: {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}): { list: AlgorithmTrialAudit[]; total: number; page: number; pageSize: number } {
  const { keyword, status, page = 1, pageSize = 10 } = params
  let list = [...trialAudits]
  if (keyword) {
    list = list.filter(
      t =>
        t.enterpriseName.includes(keyword) ||
        t.algorithmName.includes(keyword) ||
        t.applicantName.includes(keyword)
    )
  }
  if (status) {
    list = list.filter(t => t.status === status)
  }
  list.sort((a, b) => b.createTime.localeCompare(a.createTime))
  const total = list.length
  const start = (page - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total, page, pageSize }
}

export function auditTrial(
  id: string,
  data: { status: 'approved' | 'rejected'; auditor: string; auditRemark: string }
): AlgorithmTrialAudit | null {
  const index = trialAudits.findIndex(t => t.id === id)
  if (index === -1) return null
  trialAudits[index] = {
    ...trialAudits[index],
    status: data.status,
    auditor: data.auditor,
    auditRemark: data.auditRemark,
    auditTime: nowStr(),
  }
  return trialAudits[index]
}

export function getTrialPendingCount(): number {
  return trialAudits.filter(t => t.status === 'pending').length
}