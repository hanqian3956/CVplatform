import type { ApiResponse, UserAlgorithmConfig, UserAlgorithmSummary } from '@/types'
import {
  getUserAlgorithmConfigs,
  addUserAlgorithmConfig,
  updateUserAlgorithmConfig,
  deleteUserAlgorithmConfig,
  getUserAlgorithmSummaries,
  getConfigsByUserId,
} from '@/mock/userAlgorithm'

export function fetchUserAlgorithmConfigs(params: {
  userId?: string
  algorithmId?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<{ list: UserAlgorithmConfig[]; total: number; page: number; pageSize: number }>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getUserAlgorithmConfigs(params),
  })
}

export function createUserAlgorithmConfig(data: Omit<UserAlgorithmConfig, 'id' | 'createTime'>): Promise<ApiResponse<UserAlgorithmConfig>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: addUserAlgorithmConfig(data),
  })
}

export function modifyUserAlgorithmConfig(id: string, data: Partial<UserAlgorithmConfig>): Promise<ApiResponse<UserAlgorithmConfig | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updateUserAlgorithmConfig(id, data),
  })
}

export function removeUserAlgorithmConfig(id: string): Promise<ApiResponse<boolean>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: deleteUserAlgorithmConfig(id),
  })
}

export function fetchUserAlgorithmSummaries(params: {
  keyword?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<{ list: UserAlgorithmSummary[]; total: number; page: number; pageSize: number }>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getUserAlgorithmSummaries(params),
  })
}

export function fetchConfigsByUserId(userId: string): Promise<ApiResponse<UserAlgorithmConfig[]>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getConfigsByUserId(userId),
  })
}
