import type { RequestBodyComment, RequestUpdateComment, ResponseCommentData, ResponseCreateComment } from '@/types'
import { $delete, $get, $post, $put } from './axios'

export async function apiGetComments(blogId: string): Promise<ResponseCommentData> {
  return $get(`/getCommentBlog/${blogId}`)
}

export async function apiCreateComment(data: RequestBodyComment): Promise<ResponseCreateComment> {
  return $post('/createComment', data)
}

export function apiUpdateComment(idComment: string, data: RequestUpdateComment) {
  return $put(`/updateComment/${idComment}`, data)
}
export function apiDeleteComment(idComment: string) {
  return $delete(`/deleteComment/${idComment}`)
}
