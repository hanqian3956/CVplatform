import type { ApiResponse, User } from '@/types'
import { getUsers, addUser, updateUser, deleteUser } from '@/mock/user'
import { getRoleById } from '@/mock/role'

export function fetchUsers(): Promise<ApiResponse<User[]>> {
  const users = getUsers().map(u => {
    const { password, ...rest } = u
    return { ...rest, password: '' }
  })
  return Promise.resolve({ code: 200, message: 'success', data: users })
}

export function createUser(data: Omit<User, 'id' | 'createTime' | 'roleNames'>): Promise<ApiResponse<User>> {
  const roleNames = data.roleIds.map(id => {
    const role = getRoleById(id)
    return role?.name || ''
  }).filter(Boolean)

  const newUser = addUser({ ...data, roleNames })
  return Promise.resolve({ code: 200, message: 'success', data: newUser })
}

export function modifyUser(id: string, data: Partial<User>): Promise<ApiResponse<User | null>> {
  if (data.roleIds) {
    data.roleNames = data.roleIds.map(rid => {
      const role = getRoleById(rid)
      return role?.name || ''
    }).filter(Boolean)
  }
  const updated = updateUser(id, data)
  return Promise.resolve({ code: 200, message: 'success', data: updated })
}

export function removeUser(id: string): Promise<ApiResponse<boolean>> {
  return Promise.resolve({ code: 200, message: 'success', data: deleteUser(id) })
}
