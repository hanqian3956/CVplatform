import type { ApiResponse, Category } from '@/types'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/mock/category'

export function fetchCategories(): Promise<ApiResponse<Category[]>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: getCategories(),
  })
}

export function createCategory(data: Omit<Category, 'id' | 'algorithmCount'>): Promise<ApiResponse<Category>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: addCategory(data),
  })
}

export function modifyCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category | null>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: updateCategory(id, data),
  })
}

export function removeCategory(id: string): Promise<ApiResponse<boolean>> {
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: deleteCategory(id),
  })
}
