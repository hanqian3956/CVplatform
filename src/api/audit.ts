import type { ApiResponse, EnterpriseAudit, AlgorithmTrialAudit } from '@/types'
import {
  getEnterpriseAudits,
  auditEnterprise,
  getTrialAudits,
  auditTrial,
  getEnterprisePendingCount,
  getTrialPendingCount,
} from '@/mock/audit'

export function fetchEnterpriseAudits(params: {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<{ list: EnterpriseAudit[]; total: number; page: number; pageSize: number }>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getEnterpriseAudits(params),
  })
}

export function reviewEnterpriseAudit(
  id: string,
  data: { status: 'approved' | 'rejected'; auditor: string; auditRemark: string }
): Promise<ApiResponse<EnterpriseAudit | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: auditEnterprise(id, data),
  })
}

export function fetchTrialAudits(params: {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<{ list: AlgorithmTrialAudit[]; total: number; page: number; pageSize: number }>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getTrialAudits(params),
  })
}

export function reviewTrialAudit(
  id: string,
  data: { status: 'approved' | 'rejected'; auditor: string; auditRemark: string }
): Promise<ApiResponse<AlgorithmTrialAudit | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: auditTrial(id, data),
  })
}

export function fetchAuditPendingCounts(): Promise<ApiResponse<{ enterprise: number; trial: number }>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      enterprise: getEnterprisePendingCount(),
      trial: getTrialPendingCount(),
    },
  })
}
