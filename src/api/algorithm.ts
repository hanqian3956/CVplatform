import type { ApiResponse, Algorithm, AlgorithmVersion, PageResult } from '@/types'
import {
  getAlgorithmList,
  getAlgorithmById,
  addAlgorithm,
  updateAlgorithm,
  deleteAlgorithm,
  toggleAlgorithmStatus,
  getVersionsByAlgorithmId,
  addVersion,
  updateVersion,
  deleteVersion,
} from '@/mock/algorithm'

export function fetchAlgorithmList(params: {
  keyword?: string
  categoryId?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PageResult<Algorithm>>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getAlgorithmList(params),
  })
}

export function fetchAlgorithmDetail(id: string): Promise<ApiResponse<Algorithm | undefined>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getAlgorithmById(id),
  })
}

export function createAlgorithm(data: Omit<Algorithm, 'id' | 'createTime' | 'updateTime' | 'latestVersion'>): Promise<ApiResponse<Algorithm>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: addAlgorithm(data),
  })
}

export function modifyAlgorithm(id: string, data: Partial<Algorithm>): Promise<ApiResponse<Algorithm | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updateAlgorithm(id, data),
  })
}

export function removeAlgorithm(id: string): Promise<ApiResponse<boolean>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: deleteAlgorithm(id),
  })
}

export function toggleStatus(id: string): Promise<ApiResponse<Algorithm | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: toggleAlgorithmStatus(id),
  })
}

export function fetchVersions(algorithmId: string): Promise<ApiResponse<AlgorithmVersion[]>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getVersionsByAlgorithmId(algorithmId),
  })
}

export function createVersion(data: Omit<AlgorithmVersion, 'id' | 'createTime'>): Promise<ApiResponse<AlgorithmVersion>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: addVersion(data),
  })
}

export function modifyVersion(id: string, data: Partial<AlgorithmVersion>): Promise<ApiResponse<AlgorithmVersion | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updateVersion(id, data),
  })
}

export function removeVersion(id: string): Promise<ApiResponse<boolean>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: deleteVersion(id),
  })
}
