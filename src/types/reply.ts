export interface Reply {
  user_id: string
  comment_id: string
  content: string
  updated_at: string
  created_at: string
  id: string
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

export interface ResponseUpdateReply {
  message: string
  data: Reply
}
