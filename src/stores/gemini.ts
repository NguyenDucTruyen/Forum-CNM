import { apiGetConversation, apiSendMessage } from '@/api/gemini'
import { defineStore } from 'pinia'

export const useGeminiStore = defineStore('gemini', () => {
  function getConversation(id: string) {
    return apiGetConversation(id)
  }
  function sendMessage(id: string, content: string) {
    return apiSendMessage(id, content)
  }
  return {
    getConversation,
    sendMessage,
  }
})
