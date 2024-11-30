import type { RequestCreateCategory, ResponseCategoryData, ResponseCreateCategory, ResponseListUser } from '@/types'

import { $delete, $get, $post, $put } from './axios'

export async function apiAdminChangeStatusUser(data: { user_id: string }) {
  return $put('/activeUser', data)
}

export async function apiGetAllUsers(): Promise<ResponseListUser> {
  return $get('/getAll')
}

export async function apiGetCategories() {
  return $get('/getListCategory') as Promise<ResponseCategoryData>
}

export async function apiCreateCategory(data: RequestCreateCategory) {
  return $post('/createCategory', data) as Promise<ResponseCreateCategory>
}

export async function apiUpdateCategory(id: string, data: RequestCreateCategory) {
  return $put(`/updateCategory/${id}`, data) as Promise<ResponseCreateCategory>
}

export async function apiDeleteCategory(id: string) {
  return $delete(`/deleteCategory/${id}`)
}
