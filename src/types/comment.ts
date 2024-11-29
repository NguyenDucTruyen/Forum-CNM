import type { Reply } from '@/types/reply'

export interface CommentData {
  user_id: string
  blog_id: string
  content: string
  updated_at: string
  created_at: string
  id: string
  replies: Reply[]
}

export interface RequestBodyComment {
  content: string
  blog_id: string
}
export interface RequestUpdateComment {
  content: string
}
export interface ResponseCreateComment {
  data: CommentData
  message: string
}

export interface ResponseCommentData {
  data: CommentData[]
  message: string
}
