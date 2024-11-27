import { $get, $post } from './axios'

export async function checkoutSession() {
  return $post('/create-checkout-session', {})
}
export async function getDetailSession(id:string) {
  return $get(`/checkout-session?sessionId=${id}`)
}
