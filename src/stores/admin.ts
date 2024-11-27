import { apiAdminChangeStatus, apiAdminGetUsers, apiDeleteUser, apiGetPendingBlogs, apitChangeStatusBlog } from '@/api/admin'
import { apiGetBlogs } from '@/api/blog'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  async function getUsers(config: any) {
    return await apiAdminGetUsers(config)
  }
  async function changeStatus(id: string, status: string) {
    return await apiAdminChangeStatus(id, status)
  }

  async function deleteUser(id: string) {
    return await apiDeleteUser(id)
  }
  async function getBlogs(config: any) {
    return await apiGetBlogs(config)
  }
  async function getPendingBlogs(config: any) {
    return await apiGetPendingBlogs(config)
  }
  async function changeStatusBlog(blogId: string, status: string) {
    return await apitChangeStatusBlog(blogId, status)
  }
  return {
    getUsers,
    changeStatus,
    deleteUser,
    getPendingBlogs,
    getBlogs,
    changeStatusBlog,
  }
})
