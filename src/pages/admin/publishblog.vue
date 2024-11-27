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
import { useConfirmStore } from '@/stores/confirm'
import { type ResponseBlogData, type ResponseListUser, statusEnum, type UserData } from '@/types'
import { MoreHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'

const adminStore = useAdminStore()
const confirmStore = useConfirmStore()
const route = useRoute()
const router = useRouter()
const query = ref({
  page: 1,
  limit: 5,
  title: '',
})
if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}
const data = ref<ResponseBlogData | null>()
async function fetchData() {
  data.value = await adminStore.getBlogs({ params: query.value })
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
    await adminStore.changeStatusBlog(id, statusEnum.REJECTED)
    await fetchData()
  }
}
async function acceptBlog(id: string) {
  const result = await confirmStore.showConfirmDialog({
    title: 'Confirm Acceptance',
    message: 'Are you sure you want to accept this blog?',
  })

  if (result) {
    await adminStore.changeStatusBlog(id, statusEnum.PENDING)
    await fetchData()
  }
}
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
  <div class="container mx-auto p-4">
    <div class="relative flex-col w-full flex justify-between items-center gap-4">
      <div class="p-6 bg-muted w-full rounded-lg">
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
      </div>
      <h2 class="text-2xl font-semibold mb-4 ">
      <!-- Blog Management -->
      </h2>
      <div v-if="data?.docs" class="rounded-lg overflow-hidden shadow-md w-full">
        <div class="grid lg:grid-cols-8 grid-cols-6 gap-4 p-4 border-b font-semibold">
          <div>
            Thumbnail
          </div>
          <div class="lg:col-span-2">
            Title
          </div>
          <div class="lg:col-span-2">
            Author
          </div>
          <div>
            Created Time
          </div>
          <div>Category</div>
          <div>Action</div>
        </div>
        <div
          v-for="blog in data?.docs"
          :key="blog._id"
          class="grid lg:grid-cols-8 grid-cols-6 gap-4 p-4 items-center hover:bg-secondary"
        >
          <!-- Avatar and Name -->
          <div class="flex items-center gap-4">
            <img
              v-if="blog"
              v-lazy="blog.blogImage[0] ?? null"
              alt=""
              class="w-10 h-10 rounded-full object-cover"
            >
          </div>
          <div class="lg:col-span-2 truncate">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RouterLink :to="`/blogs/${blog._id}`">
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
                  <RouterLink :to="`/profile/${blog.userId._id}`">
                    {{ blog.userId.email }}
                  </RouterLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>{{ getDate(blog.createdAt) }}</div>
          <div>{{ blog.category.name }}</div>
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
                    @click="acceptBlog(blog._id)"
                  >
                    Revert Blog
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer">
                  <Button
                    variant="destructive"
                    @click="confirmDeleteBlog(blog._id)"
                  >
                    Delete Blog
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <PaginationTable
          :total="data.totalDocs"
          :current-page="data?.page || 1"
          :items-per-page="query.limit"
        />
      </div>
    </div>
  </div>
</template>

  <style scoped>
  /* Tailwind CSS handles most styling; scoped styles can be added if needed */
  </style>
