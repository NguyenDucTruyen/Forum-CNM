import type { Category, ResponseCategoryBlogs } from '@/types'
import { apiGetCategories, apitGetCategoryBySlug } from '@/api/category'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  const fetchCategories = async () => {
    const data = await apiGetCategories()
    categories.value = data
  }
  function getCategoryBySlug(slug: string, config: any): Promise<ResponseCategoryBlogs> {
    return apitGetCategoryBySlug(slug, config)
  }

  return {
    categories,
    fetchCategories,
    getCategoryBySlug,
  }
})
