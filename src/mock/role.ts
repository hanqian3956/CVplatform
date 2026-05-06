import type { Role } from '@/types'

let roles: Role[] = [
  {
    id: 'r1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有系统所有权限',
    permissions: [
      'algorithm:list', 'algorithm:create', 'algorithm:edit', 'algorithm:delete', 'algorithm:toggle',
      'category:list', 'category:create', 'category:edit', 'category:delete',
      'user-algorithm:list', 'user-algorithm:create', 'user-algorithm:edit', 'user-algorithm:delete',
      'system:user:list', 'system:user:create', 'system:user:edit', 'system:user:delete',
      'system:role:list', 'system:role:create', 'system:role:edit', 'system:role:delete',
    ],
    status: 'enabled',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'r2',
    name: '运营人员',
    code: 'operator',
    description: '负责算法上架、分类管理、用户授权',
    permissions: [
      'algorithm:list', 'algorithm:create', 'algorithm:edit', 'algorithm:toggle',
      'category:list', 'category:create', 'category:edit',
      'user-algorithm:list', 'user-algorithm:create', 'user-algorithm:edit',
    ],
    status: 'enabled',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'r3',
    name: '访客',
    code: 'viewer',
    description: '只读权限',
    permissions: [
      'algorithm:list',
      'category:list',
      'user-algorithm:list',
    ],
    status: 'enabled',
    createTime: '2024-01-01 00:00:00',
  },
]

export function getRoles(): Role[] {
  return [...roles]
}

export function getRoleById(id: string): Role | undefined {
  return roles.find(r => r.id === id)
}

export function addRole(data: Omit<Role, 'id' | 'createTime'>): Role {
  const newRole: Role = {
    ...data,
    id: 'r' + Date.now(),
    createTime: formatDate(new Date()),
  }
  roles.push(newRole)
  return newRole
}

export function updateRole(id: string, data: Partial<Role>): Role | null {
  const index = roles.findIndex(r => r.id === id)
  if (index === -1) return null
  roles[index] = { ...roles[index], ...data }
  return roles[index]
}

export function deleteRole(id: string): boolean {
  const index = roles.findIndex(r => r.id === id)
  if (index === -1) return false
  roles.splice(index, 1)
  return true
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
