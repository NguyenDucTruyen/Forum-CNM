<script setup lang="ts">
import type { BlogData, ResponseBlogData } from '@/types'
import { useBlogStore } from '@/stores/blog'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const userStore = useUserStore()

const isLoading = ref(true)
const blogs = ref<ResponseBlogData | null>()
const query = ref({
  page: 1,
  limit: 5,
  title: '',
})
if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}

watch(route, async (newVal) => {
  const container = document.querySelector('.container-default')
  if (container)
    container.scrollTo({ top: 0, behavior: 'smooth' })
  query.value.page = Number(newVal.query.page)
  isLoading.value = true
  blogs.value = await blogStore.getNewBlogs({ params: query.value }) as ResponseBlogData
  isLoading.value = false
}, { immediate: true })
</script>

<template>
  <div class="rounded-lg p-6 bg-muted">
    <h2 class="text-2xl font-bold mb-2">
      Newest blogs
    </h2>
    <p class="text-sm mb-4">
      What's new? Interesting posts for you, {{ userStore?.user?.email }}!
    </p>
    <div class="relative w-full flex justify-between items-center gap-4">
      <RouterLink to="/blogs/create">
        <Button>Create blog</Button>
      </RouterLink>
    </div>
  </div>
  <div v-show="isLoading && !blogs" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <div v-if="blogs?.docs" class="flex flex-col p-6 bg-muted rounded-lg flex-1 pt-12 relative">
    <template v-if="blogs?.docs.length">
      <div
        v-for="blog in blogs?.docs"
        :key="blog._id"
        class="blog w-full"
      >
        <BlogCard
          :value="blog"
          :category="blog.category?.name ?? 'Uncategorized'"
          @click="$router.push(`/blogs/${blog._id}`)"
        />
      </div>
      <PaginationTable
        :total="blogs?.totalDocs"
        :current-page="blogs?.page || 1"
        :items-per-page="query.limit"
      />
    </template>
    <p v-else class="text-lg text-center text-muted-foreground">
      No blog found
    </p>
    <div v-show="isLoading" class="flex w-full justify-center items-center absolute top-2 left-0">
      <Icon name="IconLoading" />
    </div>
  </div>
</template>
