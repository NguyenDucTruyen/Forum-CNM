import type { Category, RequestCreateCategory, ResponseCategoryData, ResponseCreateCategory } from '@/types'

import { $get, $post } from '@/api/axios'

export async function apiGetCategories() {
  return $get('/getListCategory') as Promise<ResponseCategoryData>
}

export async function apiCreateCategory(data: RequestCreateCategory) {
  return $post('/createCategory', data) as Promise<ResponseCreateCategory>
}

export async function apiUpdateCategory(id: string, data: RequestCreateCategory) {
  return $get(`/updateCategory/${id}`, data) as Promise<ResponseCreateCategory>
}

export async function apiDeleteCategory(id: string) {
  return $get(`/deleteCategory/${id}`)
}
