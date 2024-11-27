import type { Category } from './category'
import type { UserData } from './user'

export interface RequestCreateBlog {
  category_id: string
  title: string
  content: string
  blogImage: string
  statusBlog: string
}

export interface Reaction {
  _id: string
  userId: string
  reaction: string
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
  id: number
}
export interface ResponseCreateBlog {
  data: BlogData
  message: string
  status: string
}
export interface ResponseBlogData {
  data: BlogData[]
  message: string
  status: string
}

export const isActiveEnum = {
  BANNER: 'banner',
  ACTIVE: 'active',
  BLOCKPOSTING: 'blockposting',
  DELETE: 'delete',
  BLOCKCOMMENT: 'blockcomment',
}

export const statusEnum = {
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
}

export const reactionEnum = {
  LIKE: 'like',
  DISLIKE: 'dislike',
}
