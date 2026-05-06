import type { Algorithm, AlgorithmVersion, PageResult } from '@/types'
import { updateAlgorithmCount } from './category'

let algorithms: Algorithm[] = [
  {
    id: 'a1',
    name: '烟火检测算法',
    subtitle: '早期烟火识别，防火于未"燃"',
    description: '火焰识别算法基于大规模火焰数据识别训练，配合摄像头，实时识别监控区内明火情况。如有火灾隐患，立刻发出警报。适用于工地、商场、超市等任何有火灾隐患的场所。',
    coverUrl: 'https://placehold.co/400x200/1890ff/ffffff?text=Fire+Detection',
    videoUrl: '',
    categoryId: 'c1',
    categoryName: '基础类',
    status: 'online',
    latestVersion: 'V1.2.3',
    scenes: [
      { title: '仓库仓储', description: '通过摄像头，自动识别仓库明火情况，实时预警，防止火灾发生' },
      { title: '工厂车间', description: '通过摄像头，自动识别厂区明火情况，一旦发现明火，立即警报，防止火灾发生' },
      { title: '户外场所', description: '通过摄像头，自动识别户外特定区域的明火情况，助力消防、城管等场景及时发现火源' },
    ],
    modelFile: {
      name: 'fire_detection_yolov8.pt',
      size: 128450560,
      type: 'pt',
    },
    createTime: '2024-04-28 14:35:36',
    updateTime: '2024-04-28 14:35:36',
  },
  {
    id: 'a2',
    name: '安全帽识别',
    subtitle: '智能识别人员是否佩戴安全帽',
    description: '基于深度学习的人员安全帽佩戴检测算法，可实时检测工地、厂区等场景人员是否佩戴安全帽，未佩戴则实时告警。',
    coverUrl: 'https://placehold.co/400x200/52c41a/ffffff?text=Helmet+Detection',
    videoUrl: '',
    categoryId: 'c2',
    categoryName: '行业类',
    status: 'online',
    latestVersion: 'V2.0.1',
    scenes: [
      { title: '建筑工地', description: '自动识别工地人员安全帽佩戴情况，保障施工安全' },
    ],
    createTime: '2024-05-10 09:20:15',
    updateTime: '2024-05-10 09:20:15',
  },
  {
    id: 'a3',
    name: '越界检测',
    subtitle: '智能区域入侵检测算法',
    description: '通过设定虚拟警戒线或警戒区域，实时检测人员或物体是否越界，适用于危险区域防护、周界防范等场景。',
    coverUrl: 'https://placehold.co/400x200/fa8c16/ffffff?text=Boundary+Detection',
    videoUrl: '',
    categoryId: 'c1',
    categoryName: '基础类',
    status: 'offline',
    latestVersion: 'V1.0.5',
    scenes: [
      { title: '危险区域', description: '实时检测人员是否进入危险区域，及时告警' },
    ],
    createTime: '2024-06-01 16:45:22',
    updateTime: '2024-06-01 16:45:22',
  },
  {
    id: 'a4',
    name: '离岗识别',
    subtitle: '检测值班人员是否擅自离岗',
    description: '实时检测值班岗位是否有人值守，当人员离开岗位超过设定时间时自动告警，适用于监控室、收银台等场景。',
    coverUrl: 'https://placehold.co/400x200/722ed1/ffffff?text=Absence+Detection',
    videoUrl: '',
    categoryId: 'c2',
    categoryName: '行业类',
    status: 'online',
    latestVersion: 'V1.1.0',
    scenes: [
      { title: '监控室', description: '检测监控室值班人员是否在岗' },
    ],
    createTime: '2024-06-15 11:30:00',
    updateTime: '2024-06-15 11:30:00',
  },
  {
    id: 'a5',
    name: '摔倒识别',
    subtitle: '检测人员意外摔倒事件',
    description: '基于人体姿态估计的摔倒检测算法，可实时识别人员摔倒行为，适用于养老院、医院、公共场所等。',
    coverUrl: 'https://placehold.co/400x200/eb2f96/ffffff?text=Fall+Detection',
    videoUrl: '',
    categoryId: 'c1',
    categoryName: '基础类',
    status: 'online',
    latestVersion: 'V1.0.0',
    scenes: [
      { title: '养老院', description: '实时检测老人摔倒情况，及时通知护理人员' },
    ],
    createTime: '2024-07-01 08:00:00',
    updateTime: '2024-07-01 08:00:00',
  },
]

let versions: AlgorithmVersion[] = [
  { id: 'v1', algorithmId: 'a1', version: 'V1.0.0', description: '初始版本', status: 'published', isLatest: false, createTime: '2024-01-10 10:00:00' },
  { id: 'v2', algorithmId: 'a1', version: 'V1.2.0', description: '优化检测精度', status: 'published', isLatest: false, createTime: '2024-03-15 14:20:00' },
  { id: 'v3', algorithmId: 'a1', version: 'V1.2.3', description: '支持夜间检测', status: 'published', isLatest: true, createTime: '2024-04-28 14:35:36' },
  { id: 'v4', algorithmId: 'a2', version: 'V1.0.0', description: '初始版本', status: 'published', isLatest: false, createTime: '2024-04-01 09:00:00' },
  { id: 'v5', algorithmId: 'a2', version: 'V2.0.1', description: '大幅提升识别速度', status: 'published', isLatest: true, createTime: '2024-05-10 09:20:15' },
  { id: 'v6', algorithmId: 'a3', version: 'V1.0.5', description: '初始版本', status: 'published', isLatest: true, createTime: '2024-06-01 16:45:22' },
  { id: 'v7', algorithmId: 'a4', version: 'V1.1.0', description: '初始版本', status: 'published', isLatest: true, createTime: '2024-06-15 11:30:00' },
  { id: 'v8', algorithmId: 'a5', version: 'V1.0.0', description: '初始版本', status: 'published', isLatest: true, createTime: '2024-07-01 08:00:00' },
]

export function getAlgorithmList(params: {
  keyword?: string
  categoryId?: string
  status?: string
  page?: number
  pageSize?: number
}): PageResult<Algorithm> {
  const { keyword, categoryId, status, page = 1, pageSize = 10 } = params
  let list = [...algorithms]

  if (keyword) {
    const lower = keyword.toLowerCase()
    list = list.filter(a => a.name.toLowerCase().includes(lower) || a.id.toLowerCase().includes(lower))
  }
  if (categoryId) {
    list = list.filter(a => a.categoryId === categoryId)
  }
  if (status) {
    list = list.filter(a => a.status === status)
  }

  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  list = list.slice(start, end)

  return { list, total, page, pageSize }
}

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find(a => a.id === id)
}

export function addAlgorithm(data: Omit<Algorithm, 'id' | 'createTime' | 'updateTime' | 'latestVersion'>): Algorithm {
  const now = formatDate(new Date())
  const newAlgorithm: Algorithm = {
    ...data,
    id: 'a' + Date.now(),
    latestVersion: '-',
    createTime: now,
    updateTime: now,
  }
  algorithms.push(newAlgorithm)
  updateAlgorithmCount(data.categoryId, 1)
  return newAlgorithm
}

export function updateAlgorithm(id: string, data: Partial<Algorithm>): Algorithm | null {
  const index = algorithms.findIndex(a => a.id === id)
  if (index === -1) return null
  const old = algorithms[index]
  if (data.categoryId && data.categoryId !== old.categoryId) {
    updateAlgorithmCount(old.categoryId, -1)
    updateAlgorithmCount(data.categoryId, 1)
  }
  algorithms[index] = { ...old, ...data, updateTime: formatDate(new Date()) }
  return algorithms[index]
}

export function deleteAlgorithm(id: string): boolean {
  const index = algorithms.findIndex(a => a.id === id)
  if (index === -1) return false
  const catId = algorithms[index].categoryId
  algorithms.splice(index, 1)
  updateAlgorithmCount(catId, -1)
  return true
}

export function toggleAlgorithmStatus(id: string): Algorithm | null {
  const index = algorithms.findIndex(a => a.id === id)
  if (index === -1) return null
  algorithms[index].status = algorithms[index].status === 'online' ? 'offline' : 'online'
  algorithms[index].updateTime = formatDate(new Date())
  return algorithms[index]
}

export function getVersionsByAlgorithmId(algorithmId: string): AlgorithmVersion[] {
  return versions.filter(v => v.algorithmId === algorithmId).sort((a, b) => b.createTime.localeCompare(a.createTime))
}

export function addVersion(data: Omit<AlgorithmVersion, 'id' | 'createTime'>): AlgorithmVersion {
  const newVersion: AlgorithmVersion = {
    ...data,
    id: 'v' + Date.now(),
    createTime: formatDate(new Date()),
  }
  if (data.isLatest) {
    versions.filter(v => v.algorithmId === data.algorithmId).forEach(v => { v.isLatest = false })
    const alg = algorithms.find(a => a.id === data.algorithmId)
    if (alg) alg.latestVersion = data.version
  }
  versions.push(newVersion)
  return newVersion
}

export function updateVersion(id: string, data: Partial<AlgorithmVersion>): AlgorithmVersion | null {
  const index = versions.findIndex(v => v.id === id)
  if (index === -1) return null
  const old = versions[index]
  versions[index] = { ...old, ...data }
  if (data.isLatest && data.isLatest !== old.isLatest) {
    versions.filter(v => v.algorithmId === old.algorithmId && v.id !== id).forEach(v => { v.isLatest = false })
    const alg = algorithms.find(a => a.id === old.algorithmId)
    if (alg) alg.latestVersion = versions[index].version
  }
  return versions[index]
}

export function deleteVersion(id: string): boolean {
  const index = versions.findIndex(v => v.id === id)
  if (index === -1) return false
  const v = versions[index]
  if (v.isLatest) {
    const alg = algorithms.find(a => a.id === v.algorithmId)
    if (alg) {
      const remaining = versions.filter(rv => rv.algorithmId === v.algorithmId && rv.id !== id)
      alg.latestVersion = remaining.length > 0 ? remaining.sort((a, b) => b.createTime.localeCompare(a.createTime))[0].version : '-'
    }
  }
  versions.splice(index, 1)
  return true
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
