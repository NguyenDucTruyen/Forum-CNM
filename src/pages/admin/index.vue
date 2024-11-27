<route>
{
  meta: {
    title: 'Admin',
    layout: 'admin',
  },
}
</route>

<script setup lang="ts">
import type { ResponseListUser, UserData } from '@/types'
import { useAdminStore } from '@/stores/admin'
import { useConfirmStore } from '@/stores/confirm'
import { MoreHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'

const adminStore = useAdminStore()
const confirmStore = useConfirmStore()
const route = useRoute()
const router = useRouter()
const query = ref({
  page: 1,
  limit: 5,
})
if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}
const data = ref<ResponseListUser | null>()
async function fetchData() {
  data.value = await adminStore.getUsers({ params: query.value }) as ResponseListUser
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
const modal = ref({
  isOpen: false,
  user: {} as UserData,
})
async function save(id: string, status: string) {
  modal.value.isOpen = false
  await adminStore.changeStatus(id, status)
  await fetchData()
}
function cancel() {
  modal.value.isOpen = false
  modal.value.user = {} as UserData
}
function editUser(user: UserData) {
  modal.value.isOpen = true
  modal.value.user = user
}
async function confirmDeleteUser(id: string) {
  const result = await confirmStore.showConfirmDialog({
    title: 'Confirm Delete User',
    message: 'Are you sure you want to delete this user?',
  })
  if (result) {
    await adminStore.deleteUser(id)
    await fetchData()
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4 ">
      <!-- User Management -->
    </h2>
    <div v-if="data?.docs" class="rounded-lg overflow-hidden shadow-md w-full">
      <div class="grid lg:grid-cols-7 grid-cols-5 gap-4 p-4 border-b font-semibold">
        <div class="lg:col-span-2">
          Name
        </div>
        <div class="lg:col-span-2">
          Email
        </div>
        <div>Gender</div>
        <div>Birthday</div>
        <div>Status</div>
      </div>
      <div
        v-for="user in data?.docs"
        :key="user._id"
        class="grid lg:grid-cols-7 grid-cols-5 gap-4 p-4 items-center hover:bg-secondary"
      >
        <!-- Avatar and Name -->
        <div class="flex lg:col-span-2 items-center gap-4 truncate">
          <img
            v-if="user"
            v-lazy="user.profileImage ?? 'https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small_2x/simple-user-default-icon-free-png.png'"
            alt=""
            class="w-10 h-10 rounded-full object-cover"
          >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RouterLink :to="`/profile/${user._id}`">
                  {{ (user.firstName ?? '') + (user.lastName ?? '') }}
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
                <RouterLink :to="`/profile/${user._id}`">
                  {{ user.email }}
                </RouterLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>View detail blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>{{ user.gender === true ? 'Male' : user.gender === false ? 'Female' : '' }}</div>
        <div>{{ getDate(user.dayOfBirth) }}</div>
        <div class="flex justify-between items-center gap-2">
          <span
            class="px-2 py-1 rounded text-sm truncate"
            :class="{
              'bg-success ': user.isActive === 'active',
              'bg-destructive ': user.isActive !== 'active',
            }"
          >
            {{ user.isActive.toLocaleUpperCase() }}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="cursor-pointer"
              as-child
            >
              <Button variant="outline" class="w-8 h-8 p-0">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="cursor-pointer" @click="editUser(user)">
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer" @click="confirmDeleteUser(user._id)">
                Delete User
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
  <EditStatus
    v-if="modal.isOpen"
    :user="modal.user"
    @cancel="cancel"
    @save="save"
  />
</template>

<style scoped>
/* Tailwind CSS handles most styling; scoped styles can be added if needed */
</style>
