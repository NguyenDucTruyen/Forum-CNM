<script setup lang="ts">
import type { BlogData, CommentData, Reaction, Reply, ResponseDetailBlog, ResponseReaction, UserData } from '@/types'

import { toast } from '@/components/ui/toast'
import { useBlogStore } from '@/stores/blog'
import { useCommentStore } from '@/stores/comment'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const blogStore = useBlogStore()
const commentStore = useCommentStore()
const author = ref<UserData | null>(null)
if (!route.params.id) {
  router.push('/home')
}
const blog = ref<ResponseDetailBlog | null>(null)
const reactions = ref<ResponseReaction | null>(null)
const comments = ref<CommentData[]>([])
const isLoading = ref(false)

async function fetchData() {
  isLoading.value = true
  blog.value = await blogStore.getBlogById(route.params.id as string)
  isLoading.value = false

  userStore.getUserData(blog.value.data.user_id).then((res) => {
    author.value = res
  })
  commentStore.getCommentByBlogId(route.params.id as string).then((res) => {
    comments.value = res
  })

  blogStore.getReactionBlog(route.params.id as string).then((res) => {
    reactions.value = res
  })
}
fetchData()

async function postComment(content: string) {
  const newComment = await commentStore.createComment({ content, blog_id: blog.value?.data.id as string })
  comments.value.push(newComment)

  const container = document.querySelector('.container-default')
  if (container)
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
}

async function hanldeUpdateComment(data: CommentData) {
  const { data: updatedComment } = await commentStore.updateCommentById(data.id, { content: data.content })
  const index = comments.value.findIndex(comment => comment.id === updatedComment.id)
  comments.value[index] = updatedComment
}

async function deleteComment(id: string) {
  await commentStore.deleteCommentById(id)
  const index = comments.value.findIndex(comment => comment.id === id)
  comments.value.splice(index, 1)
}

async function apiReactionsBlog(reaction: 'like' | 'dislike') {
  if (reaction === 'like')
    await blogStore.likeBlog(blog.value?.data.id as string)
  else
    await blogStore.dislikeBlog(blog.value?.data.id as string)
  blogStore.getReactionBlog(route.params.id as string).then((res) => {
    reactions.value = res
  })
}

const nameAuthorDisplay = computed(() => {
  if (author.value?.firstName || author.value?.lastName) {
    return `${author.value?.firstName ?? ''} ${author.value?.lastName ?? ''}`
  }
  return author.value?.email
})

const countComment = computed(() => {
  return comments.value.reduce((count, comment) => count + comment.replies.length + 1, 0)
})

const countLike = computed(() => {
  return reactions.value?.data.filter(item => item.reactionType === true).length
})

const countDislike = computed(() => {
  return reactions.value?.data.filter(item => item.reactionType === false).length
})

const userReaction = computed(() => {
  const reaction = reactions.value?.data.find(item => item.user_id === userStore.user?.id)
  if (!reaction)
    return null
  return reaction?.reactionType
})
</script>

<template>
  <div v-if="isLoading" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <section v-else-if="blog" class="mt-8 px-6 ">
    <div class="header relative">
      <p class="text-3xl font-semibold lg:max-w-[46rem] pb-2">
        {{ blog.data.title }}
      </p>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
        <div class="meta-item">
          <label>Author:</label>
          <RouterLink :to="{ name: 'profile-id', params: { id: blog.data.user_id } }">
            {{ nameAuthorDisplay }}
          </RouterLink>
        </div>
        <div class="meta-item">
          <label>Category:</label>
          <RouterLink :to="`/blogs/category/${blog.data.category_id}`">
            {{ blog.category }}
          </RouterLink>
        </div>
        <div class="meta-item">
          <label>Published: {{ blog.data.created_at.split('T')[0] }}</label>
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
      <div class="ql-editor" v-html="blog?.data.content" />
    </div>
    <Separator />
    <div class="mb-4">
      <div class="flex my-4 h-8 items-center">
        <Button
          :variant="userReaction === true ? '' : 'outline'"
          class="mr-2"
          @click="apiReactionsBlog('like')"
        >
          <Icon name="IconThumbsUp" />
          <span class="ml-2">Like {{ countLike ? `(${countLike})` : '' }}</span>
        </Button>
        <Button
          :variant="userReaction === false ? '' : 'outline'"
          class="mr-2"
          @click="apiReactionsBlog('dislike')"
        >
          <Icon name="IconThumbsDown" />
          <span class="ml-2">Dislike {{ countDislike ? `(${countDislike})` : '' }}</span>
        </Button>
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
    <div class="mt-10" />
    <template
      v-for="item in comments"
      :key="item.id"
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
