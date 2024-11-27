import type { RequestUpdateUser, ResponseBlogData, ResponseGetUser, UserData } from '@/types'
import { apiChangePassword, apiGetBlogsByUser, apiGetMe, apiGetUserData, apiUpdateUserData } from '@/api/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserData | null>(null)

  function setUser(newUser: UserData) {
    user.value = newUser
  }

  function removeUser() {
    user.value = null
  }

  async function getMe() {
    const response = await apiGetMe() as ResponseGetUser
    setUser(response.data)
  }

  async function getUserData(id: string): Promise<UserData> {
    const { data } = await apiGetUserData(id) as ResponseGetUser
    return data
  }

  async function changePassword(data: { password: string, newPassword: string, confirmNewPassword: string }) {
    await apiChangePassword(data)
  }

  async function updateUserData(body: RequestUpdateUser): Promise<UserData> {
    const { data } = await apiUpdateUserData(body) as ResponseGetUser
    return data
  }

  const isAuthenticated = computed(() => !!user.value)
  return {
    user,
    getMe,
    setUser,
    removeUser,
    isAuthenticated,
    changePassword,
    getUserData,
    updateUserData,
  }
})
