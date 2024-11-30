import type { RequestCreateCategory } from '@/types'
import { apiAdminChangeStatusUser, apiCreateCategory, apiDeleteCategory, apiGetAllUsers, apiGetCategories, apiUpdateCategory } from '@/api/admin'
import { apiGetBlogs } from '@/api/blog'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  async function toggleUserStatus(data: { user_id: string }) {
    return await apiAdminChangeStatusUser(data)
  }
  async function getAllUsers() {
    const { data } = await apiGetAllUsers()
    return data
  }
  async function createCategory(data: RequestCreateCategory) {
    return apiCreateCategory(data)
  }
  async function getListCategory() {
    const { data } = await apiGetCategories()
    return data
  }
  async function updateCategory(id: string, data: RequestCreateCategory) {
    return apiUpdateCategory(id, data)
  }
  async function deleteCategory(id: string) {
    return apiDeleteCategory(id)
  }
  return {
    toggleUserStatus,
    getAllUsers,
    getListCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
