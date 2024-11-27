<script setup lang="ts">
import type { BlogData, ResponseCategoryBlogs } from '@/types'

import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()

const isLoading = ref(true)
const category = ref<ResponseCategoryBlogs | null>(null)
const query = ref({
  page: 1,
  limit: 5,
  title: '',
})

if (!route.params.slug) {
  router.push('/home')
}

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
  category.value = await categoryStore.getCategoryBySlug(route.params.slug as string, { params: query.value })
  isLoading.value = false
}, { immediate: true })
function handleUpdateQuery() {
  if (!query.value.title)
    return
  router.push({ query: { page: 1, title: query.value.title } })
}
function handleDeleteQuery() {
  if (!query.value.title) {
    router.push({ query: { page: 1 } })
  }
}
</script>

<template>
  <div class="rounded-lg p-6 bg-muted">
    <h2 class="text-2xl font-bold mb-2">
      Well come to {{ category?.name }} category
    </h2>
    <p class="text-sm mb-4">
      {{ category?.description }}
    </p>
    <div class="relative w-full flex justify-between items-center gap-4">
      <div class="relative w-full max-w-sm items-center">
        <input
          v-model="query.title"
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
  <div v-show="isLoading && !category" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <div v-if="category?.blogs" class="flex flex-col p-6 bg-muted rounded-lg flex-1 relative pt-12">
    <template v-if="category?.blogs.length">
      <div
        v-for="blog in category?.blogs"
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
        :total="category?.totalDocs"
        :current-page="category?.page || 1"
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
