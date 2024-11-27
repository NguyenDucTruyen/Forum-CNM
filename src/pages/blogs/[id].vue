<script setup lang="ts">
import type { BlogData, CommentData, CommentReply, Reaction, RequestBodyComment } from '@/types'

import { toast } from '@/components/ui/toast'
import { useBlogStore } from '@/stores/blog'
import { useCommentStore } from '@/stores/comment'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const blogStore = useBlogStore()
const commentStore = useCommentStore()

if (!route.params.id) {
  router.push('/home')
}
const blog = ref<BlogData | null>(null)
const comments = ref<CommentData[]>([])
comments.value = await commentStore.getCommentByBlogId(route.params.id as string) as CommentData[]
blog.value = await blogStore.getBlogById(route.params.id as string)

const countComment = computed(() => {
  return comments.value.reduce((count, comment) => count + comment.reply.length + 1, 0)
})
const countLike = computed(() => {
  return blog.value?.reaction.filter((reaction: Reaction) => reaction.reaction === 'like').length
})
const countDislike = computed(() => {
  return blog.value?.reaction.filter((reaction: Reaction) => reaction.reaction === 'dislike').length
})
const userReaction = computed(() => {
  const reaction = blog.value?.reaction.find((reaction: Reaction) => reaction.userId === userStore.user?._id)
  return reaction?.reaction || null
})

async function postComment(content: string) {
  const response = await commentStore.createComment(blog.value?._id as string, { content })
  const newComment = {
    ...response,
    userId: {
      _id: userStore.user?._id as string,
      email: userStore.user?.email as string,
    },
  } as CommentData
  comments.value.push(newComment)
  const container = document.querySelector('.container-default')
  if (container)
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
}
async function hanldeUpdateComment(data: CommentData) {
  await commentStore.updateCommentById(data._id, { content: data.content })
  toast({
    title: 'Success',
    description: 'Comment updated successfully.',
  })
}
async function deleteComment(id: string) {
  await commentStore.deleteCommentById(id)
  const index = comments.value.findIndex(comment => comment._id === id)
  comments.value.splice(index, 1)
}
async function apiReactionsBlog(reaction: 'like' | 'dislike') {
  const response = await blogStore.reactionBlog(blog.value?._id as string, reaction)
  if (blog.value) {
    blog.value.reaction = response.reaction
  }
}
</script>

<template>
  <section v-if="blog" class="mt-8 px-6 ">
    <div class="header relative">
      <p class="text-3xl font-semibold lg:max-w-[46rem] pb-2">
        {{ blog.title }}
      </p>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
        <div class="meta-item">
          <label>Author:</label>
          <RouterLink :to="{ name: 'profile-id', params: { id: blog.userId._id } }">
            {{ blog.userId.email }}
          </RouterLink>
        </div>
        <div class="meta-item">
          <label>Category:</label>
          <RouterLink to="/home">
            {{ blog.category?.name ?? 'Uncategorized' }}
          </RouterLink>
        </div>
        <div class="meta-item">
          <label>Published: {{ blog.createdAt.split('T')[0] }}</label>
        </div>
      </div>
      <RouterLink to="/blogs/create" class="lg:absolute top-0 right-0">
        <Button class="mb-4 lg:mb-0 ">
          Create Blog
        </Button>
      </RouterLink>
      <Separator />
    </div>
    <div class="ql-snow content">
      <div class="ql-editor" v-html="blog?.content" />
    </div>
    <Separator />
    <div class="mb-4">
      <div class="flex my-4 h-8 items-center">
        <Button
          :variant="userReaction === 'like' ? '' : 'outline'"
          class="mr-2"
          @click="apiReactionsBlog('like')"
        >
          <Icon name="IconThumbsUp" />
          <span class="ml-2">Like ({{ countLike }})</span>
        </Button>
        <Button
          :variant="userReaction === 'dislike' ? '' : 'outline'"
          class="mr-2"
          @click="apiReactionsBlog('dislike')"
        >
          <Icon name="IconThumbsDown" />
          <span class="ml-2">Dislike ({{ countDislike }})</span>
        </Button>
        <!-- <Separator orientation="vertical" /> -->
        <div class="flex items-center gap-2 ml-2">
          <Icon name="IconComment" />
          <span>{{ countComment }} Comments</span>
        </div>
      </div>
    </div>
    <h1 class="text-xl mt-10 mb-8">
      Does This Topic Interest You? Let Us Know What You Think!
    </h1>
    <Comment
      @comment="postComment"
    />
    <!-- <Separator label="Comment Area" label-style="text-xl" class="my-4 h-1" /> -->
    <template
      v-for="item in comments"
      :key="item._id"
    >
      <Separator label="Comment" label-style=" text-lg" class="my-4 h-[2px]" />
      <CommentBox
        :comment="item"
        @update-comment="hanldeUpdateComment"
        @delete="deleteComment"
      />
    </template>
  </section>
</template>

<style scoped lang="scss">
.meta-item {
    @apply flex items-center gap-2;
    label {
        @apply text-sm min-w-4 truncate;
    }
    a {
        @apply text-sm max-w-48 truncate text-primary hover:underline;
    }
}
</style>
