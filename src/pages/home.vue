<script setup lang="ts">
import type { BlogData, ResponseBlogData } from '@/types'
import { useBlogStore } from '@/stores/blog'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const userStore = useUserStore()
const categoryStore = useCategoryStore()

const isLoading = ref(true)
const blogs = ref<ResponseBlogData | null>()
const query = ref({
  page: 1,
  per_page: 5,
  search: '',
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

  if (!categoryStore.categories) {
    await categoryStore.getCategories()
  }
  blogs.value = await blogStore.getBlogs({ params: query.value }) as ResponseBlogData
  isLoading.value = false
}, { immediate: true })

function handleUpdateQuery() {
  if (!query.value.search)
    return
  router.push({ query: { page: 1, title: query.value.search } })
}
function handleDeleteQuery() {
  if (!query.value.search) {
    router.push({ query: { page: 1 } })
  }
}
</script>

<template>
  <div class="rounded-lg p-6 bg-muted">
    <h2 class="text-2xl font-bold mb-2">
      Well come
    </h2>
    <p class="text-sm mb-4">
      How are you today, {{ userStore?.user?.email }}?
    </p>
    <div class="relative w-full flex justify-between items-center gap-4">
      <div class="relative w-full max-w-sm items-center">
        <input
          v-model="query.search"
          type="text"
          placeholder="Type tile to search"
          class="flex h-10 w-full border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 rounded-full bg-background max-w-sm"
          @change="handleUpdateQuery"
          @input="handleDeleteQuery"
        >
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center h-10"
          style="left: 0.75rem"
        >
          <Icon name="IconSearch" class="w-4" />
        </span>
      </div>
      <RouterLink to="/blogs/create">
        <Button>Create blog</Button>
      </RouterLink>
    </div>
  </div>
  <div v-show="isLoading && !blogs" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <div v-if="blogs?.data" class="flex flex-col p-6 bg-muted rounded-lg flex-1 pt-12 relative">
    <template v-if="blogs?.data.length">
      <div
        v-for="blog in blogs?.data"
        :key="blog.id"
        class="blog w-full"
      >
        <BlogCard
          :value="blog"
          :category="blog.category_id"
          @click="$router.push(`/blogs/${blog.id}`)"
        />
      </div>
      <PaginationTable
        :total="blogs?.total"
        :current-page="blogs?.current_page || 1"
        :items-per-page="query.per_page"
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
