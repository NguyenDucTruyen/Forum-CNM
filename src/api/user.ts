import type { RequestUpdateUser } from '@/types'
import { $get, $post, $put } from '@/api/axios'
import { jwtDecode } from 'jwt-decode'

export async function apiGetMe() {
  const access_token = localStorage.getItem('access_token')
  if (!access_token)
    return null
  const { sub } = jwtDecode(access_token)
  return $get(`/auth/getDetail/${sub}`)
}
export async function apiGetUserData(userId: string) {
  return $get(`/auth/getDetail/${userId}`)
}
export function apiUpdateUserData(data: RequestUpdateUser) {
  return $put('/auth/update', data)
}
export async function apiChangePassword(data: { password: string, newPassword: string, confirmNewPassword: string }) {
  return $post('/users/changePassword', data)
}
export async function apiGetBlogsByUser(userId: string, config: any) {
  return $get(`/users/${userId}/blogs`, config)
}
