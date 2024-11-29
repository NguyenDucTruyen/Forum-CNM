import type { BlogData, RequestCreateBlog, ResponseBlogData, ResponseCreateBlog } from '@/types'
import { $delete, $get, $patch, $post, $put } from './axios'

export async function apiGetBlogs(config: any): Promise<ResponseBlogData> {
  return $get('/getListBlog', config)
}

export async function apiGetBlogById(id: string): Promise<BlogData> {
  return $get(`/getDetailBlog/${id}`)
}

export function apiGetBlogByCategory(idCategory: string, config: any): Promise<ResponseBlogData> {
  return $get(`/getBlogCategory/${idCategory}`, config)
}

export function apiGetBlogByUser(idUser: string, config: any): Promise<ResponseBlogData> {
  return $get(`/getBlogUser/${idUser}`, config)
}

export async function apiCreateBlog(data: RequestCreateBlog): Promise<ResponseCreateBlog> {
  return $post('/createBlog', { ...data, statusBlog: 'pending' })
}

export async function apiUpdateBlog(id: string, data: RequestCreateBlog): Promise<ResponseCreateBlog> {
  return $put(`/updateBlog/${id}`, data)
}

export async function apiDeleteBlog(id: string): Promise<void> {
  return $delete(`/deleteBlog/${id}`)
}
