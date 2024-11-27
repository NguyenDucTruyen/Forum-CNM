import { $delete, $get, $patch, $post, $put } from './axios'

export async function apiLikeBlog(data: { blog_id: string }) {
  return $post('/likeReaction', data)
}
export async function apiDislikeBlog(data: { blog_id: string }) {
  return $delete('/dislikeReaction', data)
}
