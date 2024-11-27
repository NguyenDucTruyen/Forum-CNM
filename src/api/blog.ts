import type { BlogData, RequestCreateBlog, ResponseBlogData } from '@/types'
import { $get, $patch, $post } from './axios'

export async function apiGetBlogs(config: any): Promise<ResponseBlogData> {
  return $get('/blogs', config)
}
export async function apiCreateBlog(data: RequestCreateBlog): Promise<ResponseBlogData> {
  return $post('/blogs', data)
}

export async function apiGetBlogById(id: string): Promise<BlogData> {
  return $get(`/blogs/${id}`)
}
export async function apiGetNewBlogs(config: any): Promise<ResponseBlogData> {
  return $get('/blogs/newest', config)
}
export async function apiGetPopularBlogs(config: any): Promise<ResponseBlogData> {
  return $get('/blogs/popular', config)
}
export async function apiReactionsBlog(id: string, reaction: string): Promise<BlogData> {
  return $patch(`/blogs/${id}`, { reaction })
}
