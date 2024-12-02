import type { ResponseListMessage, ResponseMessage } from '@/types'
import { $get, $post } from './axios'

export function apiGetConversation(id: string): Promise<ResponseListMessage> {
  return $get(`/chat/${id}`)
}

export function apiSendMessage(id: string, message: string): Promise<ResponseMessage> {
  return $post(`/chat/${id}`, { message })
}
