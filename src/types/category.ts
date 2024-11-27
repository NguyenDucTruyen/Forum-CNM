import type { BlogData } from './blog'

export interface Category {
  _id: string
  name: string
  status: string
  slug: string
  createdAt: string
  updatedAt: string
  description: string
}

export interface ResponseCategoryBlogs extends Category {
  blogs: BlogData[]
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
