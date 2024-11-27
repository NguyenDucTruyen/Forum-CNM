import type { isActiveEnum, ResponseBlogData } from '@/types'
import { $delete, $get, $patch, $post, $put } from './axios'

export async function apiAdminChangeStatusUser(data: { user_id: string }) {
  return $put('/activeUser', data)
}
