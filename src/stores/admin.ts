import { apiAdminChangeStatusUser, apiGetAllUsers } from '@/api/admin'
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
  return {
    toggleUserStatus,
    getAllUsers,
  }
})
