import type { Category, RequestCreateCategory } from '@/types'
import { apiCreateCategory, apiDeleteCategory, apiGetCategories, apiUpdateCategory } from '@/api/category'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  async function getCategories() {
    const response = await apiGetCategories()
    categories.value = response.data
  }

  // For admin
  async function createCategory(data: RequestCreateCategory) {
    const response = await apiCreateCategory(data)
    categories.value.push(response.data)
  }
  async function updateCategory(id: string, data: RequestCreateCategory) {
    const response = await apiUpdateCategory(id, data)
    const index = categories.value.findIndex(category => category.id === id)
    categories.value[index] = response.data
  }
  async function deleteCategory(id: string) {
    await apiDeleteCategory(id)
    categories.value = categories.value.filter(category => category.id !== id)
  }
  return {
    categories,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
