<route>
  {
    meta: {
      title: 'Admin',
      layout: 'admin',
    },
  }
  </route>

<script setup lang="ts">
import { useAdminStore } from '@/stores/admin'
import { useBlogStore } from '@/stores/blog'
import { useConfirmStore } from '@/stores/confirm'
import { type ResponseBlogData, type ResponseListUser, statusEnum, type UserData } from '@/types'
import { MoreHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'

const adminStore = useAdminStore()
const confirmStore = useConfirmStore()
const blogStore = useBlogStore()
const route = useRoute()
const router = useRouter()
const query = ref({
  page: 1,
  per_page: 5,
  search: '',
})
if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}
const data = ref<ResponseBlogData | null>()
const isLoading = ref(false)
async function fetchData() {
  isLoading.value = true
  data.value = await blogStore.getBlogs({ params: query.value }) as ResponseBlogData
  isLoading.value = false
}
watch(route, async (newVal) => {
  const container = document.querySelector('.container-default')
  if (container)
    container.scrollTo({ top: 0, behavior: 'smooth' })
  query.value.page = Number(newVal.query.page)

  fetchData()
}, { immediate: true })
function getDate(date: string) {
  if (!date)
    return ''
  return date.split('T')[0]
}

async function confirmDeleteBlog(id: string) {
  const result = await confirmStore.showConfirmDialog({
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this blog?',
  })
  if (result) {
    await blogStore.deleteBlog(id)
    const index = data.value?.data.findIndex(e => e.id === id)
    if (index !== undefined && index !== -1)
      data.value?.data.splice(index, 1)
  }
}
async function revertBlog(id: string) {
  const result = await confirmStore.showConfirmDialog({
    title: 'Confirm Revert',
    message: 'Are you sure you want to revert this blog?',
  })

  if (result) {
    await adminStore.changeStatusBlog(id, statusEnum.PENDING)
    const index = data.value?.data.findIndex(e => e.id === id)
    if (index !== undefined && index !== -1)
      data.value?.data.splice(index, 1)
  }
}
function handleUpdateQuery() {
  if (!query.value.search)
    return
  router.push({ query: { page: 1, search: query.value.search } })
}

function handleDeleteQuery() {
  if (!query.value.search) {
    router.push({ query: { page: 1 } })
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="relative flex-col w-full flex justify-between items-center gap-4">
      <h2 class="text-2xl font-semibold mb-4 ">
        Published Blogs Management
      </h2>
      <div class="p-6 bg-muted w-full rounded-lg">
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
      </div>
      <div v-if="isLoading" class="flex w-full p-8 justify-center items-center">
        <Icon name="IconLoading" />
      </div>
      <div v-else-if="data?.data.length" class="rounded-lg overflow-hidden shadow-md w-full">
        <div class="grid lg:grid-cols-7 grid-cols-6 gap-4 p-4 border-b font-semibold">
          <div>
            Thumbnail
          </div>
          <div class="lg:col-span-2">
            Title
          </div>
          <div class="lg:col-span-2">
            Category
          </div>
          <div>
            Created Time
          </div>
          <div>Action</div>
        </div>
        <div
          v-for="blog in data?.data"
          :key="blog.id"
          class="grid lg:grid-cols-7 grid-cols-6 gap-4 p-4 items-center hover:bg-secondary rounded-lg"
        >
          <!-- Avatar and Name -->
          <div class="flex items-center gap-4">
            <img
              v-if="blog"
              v-lazy="blog.blogImage ?? null"
              alt=""
              class="w-10 h-10 rounded-full object-cover"
            >
          </div>
          <div class="lg:col-span-2 truncate">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RouterLink :to="`/blogs/${blog.id}`">
                    {{ blog.title }}
                  </RouterLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View detail blog</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div class="lg:col-span-2 truncate">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RouterLink :to="`/blogs/category/${blog.category_id}`">
                    {{ blog.category.categoryName }}
                  </RouterLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View category </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
            <div>{{ getDate(blog.created_at) }}</div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  class="cursor-pointer w-12"
                  as-child
                >
                  <Button variant="outline" class="w-12 p-0">
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="">
                  <DropdownMenuLabel class="text-center">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="cursor-pointer">
                    <Button
                      @click="revertBlog(blog.id)"
                    >
                      Revert Blog
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem class="cursor-pointer">
                    <Button
                      variant="destructive"
                      @click="confirmDeleteBlog(blog.id)"
                    >
                      Delete Blog
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
        <PaginationTable
          :total="data.total"
          :current-page="data?.current_page || 1"
          :items-per-page="query.per_page"
        />
      </div>
      <p v-else class="text-lg text-center text-muted-foreground">
        No blog found
      </p>
    </div>
  </div>
</template>

  <style scoped>
  /* Tailwind CSS handles most styling; scoped styles can be added if needed */
  </style>
