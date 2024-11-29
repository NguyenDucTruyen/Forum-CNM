import type { CommentData, RequestBodyComment, RequestCreateReply, RequestUpdateComment, RequestUpdateReply } from '@/types'

import { apiCreateComment, apiDeleteComment, apiGetComments, apiUpdateComment } from '@/api/comment'
import { apiDeleteReply, apitCreateReply, apiUpdateReply } from '@/api/reply'
import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', () => {
  // Comment
  async function getCommentByBlogId(id: string) {
    const { data } = await apiGetComments(id)
    return data
  }

  async function createComment(body: RequestBodyComment) {
    const { data } = await apiCreateComment(body)
    return data
  }

  async function updateCommentById(id: string, data: RequestUpdateComment) {
    return apiUpdateComment(id, data)
  }
  async function deleteCommentById(id: string) {
    return apiDeleteComment(id)
  }

  // Reply
  async function createReplyComment(body: RequestCreateReply) {
    const { data } = await apitCreateReply(body)
    return data
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
