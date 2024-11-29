import type { RequestCreateReply, RequestUpdateReply, ResponseCommentData, ResponseCreateReply, ResponseUpdateReply } from '@/types'

import { $delete, $post, $put } from './axios'

export async function apitCreateReply(data: RequestCreateReply): Promise<ResponseCreateReply> {
  return $post('/createReply', data)
}

export function apiUpdateReply(idReply: string, data: RequestUpdateReply): Promise<ResponseUpdateReply> {
  return $put(`/updateReply/${idReply}`, data)
}

export function apiDeleteReply(idReply: string) {
  return $delete(`/deleteReply/${idReply}`)
}
