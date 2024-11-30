import type { Category, RequestCreateCategory } from '@/types'
import { apiGetCategories } from '@/api/category'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[] | null>(null)

  async function getCategories() {
    const response = await apiGetCategories()
    categories.value = response.data
  }

  return {
    categories,
    getCategories,
  }
})
