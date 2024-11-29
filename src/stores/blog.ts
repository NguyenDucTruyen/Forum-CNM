import type { BlogData, RequestCreateBlog, ResponseBlogData } from '@/types'
import { apiCreateBlog, apiDeleteBlog, apiGetBlogByCategory, apiGetBlogById, apiGetBlogByUser, apiGetBlogs, apiUpdateBlog } from '@/api/blog'
import { apiDislikeBlog, apiLikeBlog } from '@/api/reaction'
import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', () => {
  function getBlogs(config: any): Promise<ResponseBlogData> {
    return apiGetBlogs(config)
  }
  function createBlog(data: RequestCreateBlog) {
    return apiCreateBlog(data)
  }
  function updateBlog(id: string, data: RequestCreateBlog) {
    return apiUpdateBlog(id, data)
  }
  function deleteBlog(id: string) {
    return apiDeleteBlog(id)
  }
  function getBlogByUser(user_id: string, config: any) {
    return apiGetBlogByUser(user_id, config)
  }
  function getBlogByCategory(category: string, config: any) {
    return apiGetBlogByCategory(category, config)
  }

  function getBlogById(id: string): Promise<BlogData> {
    return apiGetBlogById(id)
  } 
  // Reaction
  function likeBlog(blog_id: string) {
    return apiLikeBlog({ blog_id })
  }
  function dislikeBlog(blog_id: string) {
    return apiDislikeBlog({ blog_id })
  }
  return {
    getBlogs,
    createBlog,
    likeBlog,
    dislikeBlog,
    updateBlog,
    deleteBlog,
    getBlogByUser,
    getBlogById,
    getBlogByCategory,
  }
})
