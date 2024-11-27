import type { CommentData, RequestBodyComment, RequestCreateReply, RequestUpdateReply } from '@/types'

import { apiCreateComment, apiDeleteComment, apiGetComments, apiUpdateComment } from '@/api/comment'
import { apiDeleteReply, apitCreateReply, apiUpdateReply } from '@/api/reply'
import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', () => {
  // Comment
  async function getCommentByBlogId(id: string) {
    return apiGetComments(id)
  }

  async function createComment(data: RequestBodyComment) {
    return apiCreateComment(data)
  }

  async function updateCommentById(id: string, data: RequestBodyComment) {
    return apiUpdateComment(id, data)
  }
  async function deleteCommentById(id: string) {
    return apiDeleteComment(id)
  }

  // Reply
  async function createReplyComment(data: RequestCreateReply) {
    return apitCreateReply(data)
  }

  async function updateReplyComment(id: string, data: RequestUpdateReply) {
    return apiUpdateReply(id, data)
  }
  async function deleteReplyComment(id: string) {
    return apiDeleteReply(id)
  }
  return {
    getCommentByBlogId,
    createComment,
    updateCommentById,
    createReplyComment,
    deleteCommentById,
    updateReplyComment,
    deleteReplyComment,
  }
})
