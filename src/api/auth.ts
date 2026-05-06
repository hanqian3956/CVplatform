import type { ApiResponse, User } from '@/types'
import { getUserByUsername, getUsers } from '@/mock/user'
import { getRoleById } from '@/mock/role'

export interface LoginData {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: Omit<User, 'password'>
  permissions: string[]
}

function buildLoginResult(user: User, token: string): LoginResult {
  const permissions = new Set<string>()
  for (const roleId of user.roleIds) {
    const role = getRoleById(roleId)
    if (role && role.status === 'enabled') {
      role.permissions.forEach(p => permissions.add(p))
    }
  }
  const { password, ...userWithoutPassword } = user
  return {
    token,
    user: userWithoutPassword,
    permissions: Array.from(permissions),
  }
}

export function login(data: LoginData): Promise<ApiResponse<LoginResult | null>> {
  const user = getUserByUsername(data.username)
  if (!user || user.password !== data.password) {
    return Promise.resolve({
      code: 401,
      message: '用户名或密码错误',
      data: null,
    })
  }

  if (user.status === 'disabled') {
    return Promise.resolve({
      code: 403,
      message: '账号已禁用',
      data: null,
    })
  }

  const token = 'token_' + user.id + '_' + Date.now()
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: buildLoginResult(user, token),
  })
}

export function getUserInfo(token: string): Promise<ApiResponse<LoginResult | null>> {
  const userId = token.split('_')[1]
  const users = getUsers()
  const user = users.find((u: User) => u.id === userId)

  if (!user) {
    return Promise.resolve({ code: 401, message: 'token 无效', data: null })
  }

  return Promise.resolve({
    code: 200,
    message: 'success',
    data: buildLoginResult(user, token),
  })
}
