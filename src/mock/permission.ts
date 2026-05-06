import type { Permission } from '@/types'

export const permissions: Permission[] = [
  { id: 'p1', name: '算法管理', code: 'algorithm:list', type: 'menu', path: '/algorithm/list', sort: 1 },
  { id: 'p2', name: '新增算法', code: 'algorithm:create', type: 'button', parentId: 'p1', sort: 2 },
  { id: 'p3', name: '编辑算法', code: 'algorithm:edit', type: 'button', parentId: 'p1', sort: 3 },
  { id: 'p4', name: '删除算法', code: 'algorithm:delete', type: 'button', parentId: 'p1', sort: 4 },
  { id: 'p5', name: '算法上下架', code: 'algorithm:toggle', type: 'button', parentId: 'p1', sort: 5 },

  { id: 'p6', name: '分类管理', code: 'category:list', type: 'menu', path: '/category/list', sort: 6 },
  { id: 'p7', name: '新增分类', code: 'category:create', type: 'button', parentId: 'p6', sort: 7 },
  { id: 'p8', name: '编辑分类', code: 'category:edit', type: 'button', parentId: 'p6', sort: 8 },
  { id: 'p9', name: '删除分类', code: 'category:delete', type: 'button', parentId: 'p6', sort: 9 },

  { id: 'p10', name: '用户算法授权', code: 'user-algorithm:list', type: 'menu', path: '/user-algorithm/config', sort: 10 },
  { id: 'p11', name: '新增授权', code: 'user-algorithm:create', type: 'button', parentId: 'p10', sort: 11 },
  { id: 'p12', name: '编辑授权', code: 'user-algorithm:edit', type: 'button', parentId: 'p10', sort: 12 },
  { id: 'p13', name: '删除授权', code: 'user-algorithm:delete', type: 'button', parentId: 'p10', sort: 13 },

  { id: 'p14', name: '系统管理', code: 'system', type: 'menu', sort: 14 },
  { id: 'p15', name: '用户管理', code: 'system:user:list', type: 'menu', path: '/system/user', parentId: 'p14', sort: 15 },
  { id: 'p16', name: '新增用户', code: 'system:user:create', type: 'button', parentId: 'p15', sort: 16 },
  { id: 'p17', name: '编辑用户', code: 'system:user:edit', type: 'button', parentId: 'p15', sort: 17 },
  { id: 'p18', name: '删除用户', code: 'system:user:delete', type: 'button', parentId: 'p15', sort: 18 },

  { id: 'p19', name: '角色管理', code: 'system:role:list', type: 'menu', path: '/system/role', parentId: 'p14', sort: 19 },
  { id: 'p20', name: '新增角色', code: 'system:role:create', type: 'button', parentId: 'p19', sort: 20 },
  { id: 'p21', name: '编辑角色', code: 'system:role:edit', type: 'button', parentId: 'p19', sort: 21 },
  { id: 'p22', name: '删除角色', code: 'system:role:delete', type: 'button', parentId: 'p19', sort: 22 },
]

export function getPermissions(): Permission[] {
  return [...permissions].sort((a, b) => a.sort - b.sort)
}

export function getPermissionCodes(): string[] {
  return permissions.map(p => p.code)
}
