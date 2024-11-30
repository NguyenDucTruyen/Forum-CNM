import type { isActiveEnum, ResponseBlogData, ResponseListUser } from '@/types'
import { $delete, $get, $patch, $post, $put } from './axios'

export async function apiAdminChangeStatusUser(data: { user_id: string }) {
  return $put('/activeUser', data)
}

export async function apiGetAllUsers(): Promise<ResponseListUser> {
  return $get('/getAll')
}
