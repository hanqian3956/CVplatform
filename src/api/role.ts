import type { ApiResponse, Role } from '@/types'
import { getRoles, addRole, updateRole, deleteRole } from '@/mock/role'

export function fetchRoles(): Promise<ApiResponse<Role[]>> {
  return Promise.resolve({ code: 200, message: 'success', data: getRoles() })
}

export function createRole(data: Omit<Role, 'id' | 'createTime'>): Promise<ApiResponse<Role>> {
  return Promise.resolve({ code: 200, message: 'success', data: addRole(data) })
}

export function modifyRole(id: string, data: Partial<Role>): Promise<ApiResponse<Role | null>> {
  return Promise.resolve({ code: 200, message: 'success', data: updateRole(id, data) })
}

export function removeRole(id: string): Promise<ApiResponse<boolean>> {
  return Promise.resolve({ code: 200, message: 'success', data: deleteRole(id) })
}
