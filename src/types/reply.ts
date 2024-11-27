export interface Reply {
  user_id: number
  comment_id: string
  content: string
  updated_at: string
  created_at: string
  id: number
}

export interface RequestCreateReply {
  comment_id: string
  content: string
}

export interface ResponseCreateReply {
  message: string
  status: string
  data: Reply
}

export interface RequestUpdateReply {
  content: string
}
