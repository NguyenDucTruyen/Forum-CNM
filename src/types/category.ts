import type { BlogData } from './blog'

export interface Category {
  categoryName: string
  updated_at: string
  created_at: string
  id: string
}

export interface RequestCreateCategory {
  categoryName: string
}

export interface ResponseCreateCategory {
  message: string
  status: string
  data: Category
}
export interface ResponseCategoryData {
  message: string
  status: string
  data: Category[]
}
