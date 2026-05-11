import type { User } from '@/types'

let users: User[] = [
  {
    id: 'u1',
    username: 'admin',
    nickname: '超级管理员',
    password: '123456',
    phone: '13800000001',
    roleIds: ['r1'],
    roleNames: ['超级管理员'],
    status: 'enabled',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'u2',
    username: 'operator',
    nickname: '运营小王',
    password: '123456',
    phone: '13800000002',
    roleIds: ['r2'],
    roleNames: ['运营人员'],
    status: 'enabled',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 'u3',
    username: 'viewer',
    nickname: '访客小李',
    password: '123456',
    phone: '13800000003',
    roleIds: ['r3'],
    roleNames: ['访客'],
    status: 'enabled',
    createTime: '2024-01-01 00:00:00',
  },
]

export function getUserByUsername(username: string): User | undefined {
  return users.find(u => u.username === username)
}

export function getUsers(): User[] {
  return [...users]
}

export function addUser(data: Omit<User, 'id' | 'createTime'>): User {
  const newUser: User = {
    ...data,
    id: 'u' + Date.now(),
    createTime: formatDate(new Date()),
  }
  users.push(newUser)
  return newUser
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...data }
  return users[index]
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return false
  users.splice(index, 1)
  return true
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
