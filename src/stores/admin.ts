import { apiAdminChangeStatusUser } from '@/api/admin'
import { apiGetBlogs } from '@/api/blog'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  async function toggleUserStatus(data: { user_id: string }) {
    return await apiAdminChangeStatusUser(data)
  }
  return {
    toggleUserStatus,
  }
})
