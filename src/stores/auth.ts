import type { EmailData, LoginData, RegisterData } from '@/types'
import { apiLogin, apiLoginWithGoogle, apiLogout, apiRegister, apiSendOtpSignup, forgotPassword, requestResetPassword } from '@/api/auth'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const access_token = ref(localStorage.getItem('access_token') || '')
  const userStore = useUserStore()
  const isAuthenticated = computed(() => !!access_token.value)
  const router = useRouter()
  const returnUrl = ref('')

  async function login(credentials: LoginData) {
    try {
      const data = await apiLogin(credentials)
      localStorage.setItem('access_token', data.access_token)
      await userStore.getMe()
      router.push(returnUrl.value || '/home')
      returnUrl.value = ''
    }
    catch (error) {
      return Promise.reject(error)
    }
  }

  async function loginWithGoogle(access_token: string) {
    const data = await apiLoginWithGoogle({ access_token })
    localStorage.setItem('access_token', data.access_token)
    await userStore.getMe()
    router.push(returnUrl.value || '/home')
    returnUrl.value = ''
  }

  async function logout() {
    await apiLogout()
    localStorage.removeItem('access_token')
    userStore.removeUser()
    router.push('/auth/login')
    access_token.value = ''
  }
  function sendOTPSignup(data: EmailData) {
    return apiSendOtpSignup(data)
  }

  function register(credentials: RegisterData) {
    return apiRegister(credentials)
  }

  function setReturnUrl(url: string) {
    returnUrl.value = url
  }

  function sendEmailResetPassword(data: EmailData) {
    return forgotPassword(data)
  }

  function resetPassword(data: RegisterData) {
    return requestResetPassword(data)
  }
  return {
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    register,
    returnUrl,
    access_token,
    setReturnUrl,
    resetPassword,
    sendEmailResetPassword,
    sendOTPSignup,
  }
})
