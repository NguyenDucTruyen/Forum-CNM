export interface CommentReply {
  userId: {
    _id: string
    email: string
    profileImage?: string
    firstName?: string
    lastName?: string
    createdAt?: string
  }
  content: string
  _id: string
}
export interface RequestBodyComment {
  content: string
}
export interface CommentData {
  _id: string
  userId: {
    _id: string
    email: string
    profileImage: string
    firstName: string
    lastName: string
  }
  blogId: string
  content: string
  deleted: boolean
  reply: CommentReply[]
  createdAt: string
  updatedAt: string
}
