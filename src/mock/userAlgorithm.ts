import type { UserAlgorithmConfig, UserAlgorithmSummary } from '@/types'

let configs: UserAlgorithmConfig[] = [
  {
    id: 'uc1',
    userId: 'u1001',
    userName: '张三',
    company: '张三科技有限公司',
    algorithmId: 'a1',
    algorithmName: '烟火检测算法',
    startTime: '2024-01-01',
    endTime: '2025-01-01',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 'uc2',
    userId: 'u1002',
    userName: '李四',
    company: '李四智能科技有限公司',
    algorithmId: 'a2',
    algorithmName: '安全帽识别',
    startTime: '2024-03-01',
    endTime: '2024-12-31',
    createTime: '2024-03-01 14:30:00',
  },
]

export function getUserAlgorithmConfigs(params: {
  userId?: string
  algorithmId?: string
  page?: number
  pageSize?: number
}): { list: UserAlgorithmConfig[]; total: number; page: number; pageSize: number } {
  const { userId, algorithmId, page = 1, pageSize = 10 } = params
  let list = [...configs]

  if (userId) {
    list = list.filter(c => c.userId === userId)
  }
  if (algorithmId) {
    list = list.filter(c => c.algorithmId === algorithmId)
  }

  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  list = list.slice(start, end)

  return { list, total, page, pageSize }
}

export function addUserAlgorithmConfig(data: Omit<UserAlgorithmConfig, 'id' | 'createTime'>): UserAlgorithmConfig {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const newConfig: UserAlgorithmConfig = {
    ...data,
    id: 'uc' + Date.now(),
    createTime: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  }
  configs.push(newConfig)
  return newConfig
}

export function updateUserAlgorithmConfig(id: string, data: Partial<UserAlgorithmConfig>): UserAlgorithmConfig | null {
  const index = configs.findIndex(c => c.id === id)
  if (index === -1) return null
  configs[index] = { ...configs[index], ...data }
  return configs[index]
}

export function deleteUserAlgorithmConfig(id: string): boolean {
  const index = configs.findIndex(c => c.id === id)
  if (index === -1) return false
  configs.splice(index, 1)
  return true
}

export function getUserAlgorithmSummaries(params: {
  keyword?: string
  page?: number
  pageSize?: number
}): { list: UserAlgorithmSummary[]; total: number; page: number; pageSize: number } {
  const { keyword, page = 1, pageSize = 10 } = params

  const userMap = new Map<string, UserAlgorithmSummary>()

  for (const config of configs) {
    if (keyword && !config.userName.includes(keyword) && !config.userId.includes(keyword)) {
      continue
    }

    const isExpired = new Date(config.endTime) < new Date()
    if (userMap.has(config.userId)) {
      const summary = userMap.get(config.userId)!
      summary.totalCount++
      if (isExpired) {
        summary.expiredCount++
      } else {
        summary.validCount++
      }
    } else {
      userMap.set(config.userId, {
        userId: config.userId,
        userName: config.userName,
        company: config.company,
        totalCount: 1,
        validCount: isExpired ? 0 : 1,
        expiredCount: isExpired ? 1 : 0,
      })
    }
  }

  const list = Array.from(userMap.values())
  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return { list: list.slice(start, end), total, page, pageSize }
}

export function getConfigsByUserId(userId: string): UserAlgorithmConfig[] {
  return configs.filter(c => c.userId === userId).sort((a, b) => b.createTime.localeCompare(a.createTime))
}
