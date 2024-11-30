import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL
const route = useRoute()
const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

/*  Read more:
*   https://github.com/axios/axios?tab=readme-ov-file#interceptors
*/
axiosInstance.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  config.headers['Access-Control-Allow-Origin'] = '*'
  const access_token = localStorage.getItem('access_token')
  if (access_token)
    config.headers.Authorization = `Bearer ${access_token}`
  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config

    if ((error.response && error.response.status === 401 && !originalRequest._retry)) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshtoken')

      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
          const { access_token } = response.data

          localStorage.setItem('access_token', access_token)
          axiosInstance.defaults.headers.Authorization = `Bearer ${access_token}`
          originalRequest.headers.Authorization = `Bearer ${access_token}`

          // Retry the original request
          return axiosInstance(originalRequest)
        }
        catch (refreshError) {
          const authStore = useAuthStore()
          authStore.setReturnUrl(route.fullPath)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refreshtoken')
          window.location.href = '/auth/login'
          return Promise.reject(refreshError)
        }
      }
      else if (!window.location.pathname.includes('/auth/')) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refreshtoken')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  },
)

async function $get(url: string, config = {}) {
  const response = await axiosInstance.get(url, config)
  return response.data
}

async function $post(url: string, data: any, config = {}) {
  const response = await axiosInstance.post(url, data, config)
  return response.data
}

async function $put(url: string, data: any, config = {}) {
  const response = await axiosInstance.put(url, data, config)
  return response.data
}
async function $patch(url: string, data: any, config = {}) {
  const response = await axiosInstance.patch(url, data, config)
  return response.data
}

async function $delete(url: string, config = {}) {
  const response = await axiosInstance.delete(url, config)
  return response.data
}

export { $delete, $get, $patch, $post, $put }
