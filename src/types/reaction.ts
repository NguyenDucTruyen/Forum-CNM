export interface Reaction {
  id: string
  user_id: string
  blog_id: string
  reactionType: boolean
}
export interface ResponseReaction {
  dislike: number
  like: number
  total: number
  data: Reaction[]
}

export interface ResponsePostReaction {
  data: Reaction
}
