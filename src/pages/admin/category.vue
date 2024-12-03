<route>
  {
    meta: {
      title: 'Admin',
      layout: 'admin',
    },
  }
  </route>

<script setup lang="ts">
import type { Category, RequestCreateCategory } from '@/types'
import { useAdminStore } from '@/stores/admin'
import { useConfirmStore } from '@/stores/confirm'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const confirmStore = useConfirmStore()
const categories = ref<Category[] | null>(null)
const modal = ref({
  isOpen: false,
  category: null as Category | null,
})
const isLoading = ref(false)

async function fetchCategories() {
  isLoading.value = true
  categories.value = await adminStore.getListCategory()
  isLoading.value = false
}
onMounted(fetchCategories)
const query = ref({
  page: 1,
  limit: 5,
})

if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}

const paginateCategories = computed(() => {
  const container = document.querySelector('.container-default')
  if (container)
    container.scrollTo({ top: 0, behavior: 'smooth' })
  if (route.query.page && categories.value) {
    const page = Number(route.query.page)
    return categories.value.slice((page - 1) * 5, page * 5)
  }
  return []
})

async function confirmDeleteCategory(id: string) {
  const result = await confirmStore.showConfirmDialog({
    title: 'Confirm Delete User',
    message: 'Are you sure you want to delete this user?',
  })
  if (result) {
    await adminStore.deleteCategory(id)
    const index = categories.value?.findIndex(e => e.id === id)
    if (categories.value && index !== undefined)
      categories.value.splice(index, 1)
  }
}
function cancel() {
  modal.value.isOpen = false
  modal.value.category = null
}
function editCategory(category: Category) {
  modal.value.isOpen = true
  modal.value.category = category
}
async function updatedCategory(data: RequestCreateCategory) {
  modal.value.isOpen = false
  if (modal.value.category) {
    const { data: updatedCategory } = await adminStore.updateCategory(modal.value.category!.id as string, data)
    const index = categories.value?.findIndex(e => e.id === updatedCategory.id)
    if (categories.value && index !== undefined && index !== -1)
      categories.value[index] = updatedCategory
    modal.value.category = null
  }
  else {
    const { data: newCategory } = await adminStore.createCategory(data)
    categories.value?.unshift(newCategory)
  }
}
function getDate(date: string) {
  const dmy = date.split('T')[0]
  const times = date.split('T')[1].split(':')
  return `${dmy}, ${times[0]}:${times[1]}`
}
</script>

<template>
  <div v-if="isLoading" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <div v-else class="container mx-auto p-4">
    <div class="grid grid-cols-2">
      <h2 class="text-2xl font-semibold mb-4 ">
        Categories Management
      </h2>
      <div class="flex justify-end">
        <Button @click="modal.isOpen = true">
          Create Category
        </Button>
      </div>
    </div>

    <div v-if="paginateCategories" class="rounded-lg overflow-hidden shadow-md w-full">
      <div class="grid grid-cols-3 gap-4 p-4 border-b font-semibold">
        <div>Name</div>
        <div>Created At</div>
        <div class="pl-6">
          Action
        </div>
      </div>
      <div
        v-for="category in paginateCategories"
        :key="category.id"
        class="grid grid-cols-3 gap-4 p-4 items-center rounded-md hover:bg-secondary"
      >
        <!-- Avatar and Name -->
        <div class="flex items-center gap-4 truncate">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RouterLink :to="`/blogs/category/${category.id}`">
                  {{ category.categoryName }}
                </RouterLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>View category's blogs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div class="truncate">
          {{ getDate(category.created_at) }}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            class="cursor-pointer"
            as-child
          >
            <Button variant="outline" class="w-28 p-0">
              Open menu
              <!-- <MoreHorizontal class="w-4 h-4" /> -->
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="">
            <DropdownMenuLabel class="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer" @click="editCategory(category)">
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @click="confirmDeleteCategory(category.id)">
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <PaginationTable
        v-if="categories"
        :total="categories?.length"
        :current-page="Number($route.query.page || 1)"
        :items-per-page="5"
      />
    </div>
  </div>
  <CreateCategory
    v-if="modal.isOpen"
    :value="modal.category"
    @cancel="cancel"
    @save="updatedCategory"
  />
</template>

  <style scoped>
  /* Tailwind CSS handles most styling; scoped styles can be added if needed */
  </style>
