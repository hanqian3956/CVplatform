import type { Category } from '@/types'

let categories: Category[] = [
  { id: 'c1', name: '基础类', type: 'basic', sort: 1, algorithmCount: 3 },
  { id: 'c2', name: '行业类', type: 'industry', sort: 2, algorithmCount: 2 },
]

export function getCategories(): Category[] {
  return [...categories].sort((a, b) => a.sort - b.sort)
}

export function addCategory(category: Omit<Category, 'id' | 'algorithmCount'>): Category {
  const newCategory: Category = {
    ...category,
    id: 'c' + Date.now(),
    algorithmCount: 0,
  }
  categories.push(newCategory)
  return newCategory
}

export function updateCategory(id: string, data: Partial<Category>): Category | null {
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return null
  categories[index] = { ...categories[index], ...data }
  return categories[index]
}

export function deleteCategory(id: string): boolean {
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return false
  if (categories[index].algorithmCount > 0) return false
  categories.splice(index, 1)
  return true
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

export function updateAlgorithmCount(categoryId: string, delta: number) {
  const cat = categories.find(c => c.id === categoryId)
  if (cat) {
    cat.algorithmCount += delta
  }
}
