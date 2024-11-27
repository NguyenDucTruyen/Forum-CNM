import type { Category } from './category'
import type { UserData } from './user'

export interface RequestCreateBlog {
  category: string
  title: string
  content: string
  blogImages: string[]
}

export interface Reaction {
  _id: string
  userId: string
  reaction: string
}
export interface BlogData {
  _id: string
  userId: UserData
  category: Category
  title: string
  content: string
  blogImage: any[]
  status: string
  reactionCount: number
  deleted: boolean
  reaction: Reaction[]
  createdAt: string
  updatedAt: string
}

export interface ResponseBlogData {
  docs: BlogData[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
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
