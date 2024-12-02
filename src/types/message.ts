export interface Message {
  id: string
  blog_id: string
  user_id: string
  content: string
  created_at: string
  role: string
}

export interface ResponseListMessage {
  message: string
  data: Message[]
}
export interface ResponseMessage {
  message: string
  data: Message
}
