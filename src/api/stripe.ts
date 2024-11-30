import type { UserData } from '@/types'
import { $get, $post } from './axios'

interface ResponseUpgrade {
  message: string
  data: UserData
}
export async function checkoutSession() {
  return $post('/create-checkout-session', {})
}
export async function getDetailSession(id: string): Promise<ResponseUpgrade> {
  return $get(`/checkout-session?sessionId=${id}`)
}
