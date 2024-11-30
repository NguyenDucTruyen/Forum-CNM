import type { RequestChangeStatus, RequestCreateCategory, ResponseBlogData, ResponseCategoryData, ResponseCreateBlog, ResponseCreateCategory, ResponseListUser } from '@/types'

import { $delete, $get, $post, $put } from './axios'

// Usre
export async function apiAdminChangeStatusUser(data: { user_id: string }) {
  return $put('/activeUser', data)
}

export async function apiGetAllUsers(): Promise<ResponseListUser> {
  return $get('/getAll')
}

// BLog
export async function apiGetPendingBlogs(config: any): Promise<ResponseBlogData> {
  return $get('/getListPendingBlog', config)
}
export async function apiChangeStatusBlog(id: string, data: RequestChangeStatus): Promise<ResponseCreateBlog> {
  return $put(`/updateBlogStatus/${id}`, data)
}
// Category
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
