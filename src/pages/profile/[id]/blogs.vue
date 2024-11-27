<route>
    {
        meta: {
            title: 'User Blogs',
            layout: 'profile'
        }
    }
  </route>

<script setup lang="ts">
import type { BlogData, ResponseBlogData, UserData } from '@/types'
import { toast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const user = ref<UserData | null>(null)
const isLoading = ref(true)
const blogs = ref<ResponseBlogData | null>()
const query = ref({
  page: 1,
  limit: 1000,
})
if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}
onMounted(async () => {
  try {
    user.value = await userStore.getUserData(route.params.id as string)
    isLoading.value = true
    blogs.value = await userStore.getBlogsByUser(user.value?._id || '', { params: query.value }) as ResponseBlogData
    isLoading.value = false
  }
  catch (error) {
    console.error(error)
    toast({
      title: 'Error',
      description: 'User not found',
      variant: 'destructive',
    })
    router.push('/home')
  }
})

const paginateBlogs = computed(() => {
  const container = document.querySelector('.container-default')
  if (container)
    container.scrollTo({ top: 0, behavior: 'smooth' })
  return blogs.value?.docs.slice((route.query.page - 1) * 5, route.query.page * 5)
})
</script>

<template>
  <div class="rounded-lg p-6 bg-muted">
    <h2 class="text-2xl font-bold mb-2">
      Well come
    </h2>
    <p class="text-sm mb-4">
      Blogs of {{ user?.email }}
    </p>
  </div>
  <div v-show="isLoading && !blogs" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <div v-if="paginateBlogs && $route.query.page" class="flex flex-col p-6 bg-muted rounded-lg flex-1 pt-12 relative">
    <template v-if="paginateBlogs.length">
      <div
        v-for="blog in paginateBlogs"
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
        :current-page="Number($route.query.page || 1)"
        :items-per-page="5"
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
