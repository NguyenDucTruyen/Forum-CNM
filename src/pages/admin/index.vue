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
import { ref } from 'vue'

const adminStore = useAdminStore()
const route = useRoute()
const router = useRouter()

const allUsers = ref<UserData[] | null>()
const isLoading = ref(false)
const query = ref({
  page: 1,
  limit: 5,
})

if (!route.query.page) {
  router.push({ query: { page: 1 } })
  query.value.page = 1
}
onMounted(async () => {
  isLoading.value = true
  allUsers.value = await adminStore.getAllUsers()
  isLoading.value = false
})
const paginateUsers = computed(() => {
  if (route.query.page) {
    const page = Number(route.query.page)
    return allUsers.value?.slice((page - 1) * 5, page * 5)
  }
  return []
})

function getDate(date: string) {
  if (!date)
    return ''
  return date.split(' ')[0]
}
async function handleChange(user: UserData, value: boolean) {
  adminStore.toggleUserStatus({ user_id: user.id })
  const currentUser = allUsers.value?.find(u => u.id === user.id)
  if (currentUser)
    currentUser.isActive = value
}
</script>

<template>
  <div v-if="isLoading" class="flex w-full p-8 justify-center items-center">
    <Icon name="IconLoading" />
  </div>
  <div v-else class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4 ">
      <!-- User Management -->
    </h2>
    <div v-if="paginateUsers" class="rounded-lg overflow-hidden shadow-md w-full">
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
        v-for="user in paginateUsers"
        :key="user.id"
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
                <RouterLink :to="`/profile/${user.id}`">
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
                <RouterLink :to="`/profile/${user.id}`">
                  {{ user.email }}
                </RouterLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>View detail blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>{{ user.gender }}</div>
        <div>{{ getDate(user.dayOfBirth ?? '') }}</div>
        <div class="flex justify-between items-center gap-2">
          <Switch :checked="user.isActive" @update:checked="(value:any) => handleChange(user, value)" />
        </div>
      </div>
      <PaginationTable
        :total="allUsers?.length"
        :current-page="Number($route.query.page || 1)"
        :items-per-page="5"
      />
    </div>
  </div>
</template>

<style scoped>
/* Tailwind CSS handles most styling; scoped styles can be added if needed */
</style>
