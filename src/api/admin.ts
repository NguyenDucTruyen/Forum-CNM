import type { isActiveEnum, ResponseBlogData } from '@/types'
import { $delete, $get, $patch, $post, $put } from './axios'

export async function apiAdminGetUsers(config: any) {
  return $get('/users', config)
}
export async function apiAdminChangeStatus(userId: string, status: string) {
  return $post(`/users/${userId}/changeStatus`, {
    isActive: status,
  })
}
export async function apiDeleteUser(userId: string) {
  return $delete(`/users/${userId}`)
}

export async function apiGetPendingBlogs(config: any): Promise<ResponseBlogData> {
  return $get('/blogs/awaiting-approval', config)
}
export async function apitChangeStatusBlog(blogId: string, status: string) {
  return $patch(`/blogs/${blogId}/review`, {
    status,
  })
}
