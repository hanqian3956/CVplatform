import type { ApiResponse, Permission } from '@/types'
import { getPermissions } from '@/mock/permission'

export function fetchPermissions(): Promise<ApiResponse<Permission[]>> {
  return Promise.resolve({ code: 200, message: 'success', data: getPermissions() })
}
