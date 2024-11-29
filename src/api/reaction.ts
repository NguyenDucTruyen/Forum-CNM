import type { ResponseData, ResponsePostReaction, ResponseReaction } from '@/types'
import { $delete, $get, $patch, $post, $put } from './axios'

export function apiLikeBlog(id: string): Promise<ResponsePostReaction> {
  return $post('/likeReaction', { blog_id: id })
}
export function apiDislikeBlog(id: string): Promise<ResponsePostReaction> {
  return $post('/dislikeReaction', { blog_id: id })
}
export function apiGetReactionBlog(id: string): Promise<ResponseReaction> {
  return $get(`/getReactionBlog/${id}`)
}
