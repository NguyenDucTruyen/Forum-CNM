import type { Category } from './category'
import type { ResponseData } from './index'
import type { UserData } from './user'

export interface RequestCreateBlog {
  category_id: string
  title: string
  content: string
  blogImage: string
  statusBlog: string
}

export interface BlogData {
  user_id: string
  category_id: string
  title: string
  content: string
  blogImage: string
  statusBlog: string
  updated_at: string
  created_at: string
  id: string
}
export interface ResponseCreateBlog {
  data: BlogData
  message: string
  status: string
}
export interface ResponseBlogData extends ResponseData {
  data: BlogData[]
  message: string
  status: string
}

export interface ResponseDetailBlog {
  category: string
  data: BlogData
}
export interface RequestChangeStatus {
  statusBlog: string
}
export const isActiveEnum = {
  BANNER: 'banner',
  ACTIVE: 'active',
  BLOCKPOSTING: 'blockposting',
  DELETE: 'delete',
  BLOCKCOMMENT: 'blockcomment',
}

export const statusEnum = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
}

export const reactionEnum = {
  LIKE: 'like',
  DISLIKE: 'dislike',
}
