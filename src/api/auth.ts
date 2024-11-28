import type { EmailData, LoginData, RegisterData } from '@/types'
import { $post } from './axios'

export function apiLogin(data: LoginData) {
  return $post('/auth/login', data)
}

export function apiRegister(data: RegisterData) {
  return $post('/auth/register', data)
}

export function apiSendOtpSignup(data: EmailData) {
  return $post('/auth/sendOtp', data)
}

export function forgotPassword(data: EmailData) {
  return $post('/forgot-password', data)
}

export function requestResetPassword(data: RegisterData) {
  return $post('/reset-password', data)
}
export function apiLoginWithGoogle(data: { access_token: string }) {
  return $post('/auth/google-login', data)
}

export function apiLogout() {
  return $post('/auth/logout', {})
}
