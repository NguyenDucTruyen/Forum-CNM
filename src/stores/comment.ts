import type { CommentData, CommentReply, RequestBodyComment } from '@/types'

import { apiCreateComment, apiCreateReplyComment, apiDeleteCommentById, apitGetCommentByBlogId, apiUpdateCommentById } from '@/api/comment'
import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', () => {
  function getCommentByBlogId(id: string): Promise<CommentData[]> {
    return apitGetCommentByBlogId(id)
  }
  function createComment(id: string, data: RequestBodyComment) {
    return apiCreateComment(id, data)
  }
  function updateCommentById(id: string, data: RequestBodyComment) {
    return apiUpdateCommentById(id, data)
  }
  function createReplyComment(idComment: string, data: RequestBodyComment) {
    return apiCreateReplyComment(idComment, data)
  }
  function deleteCommentById(id: string) {
    return apiDeleteCommentById(id)
  }
  return {
    getCommentByBlogId,
    createComment,
    updateCommentById,
    createReplyComment,
    deleteCommentById,
  }
})
