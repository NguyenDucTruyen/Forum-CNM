<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const items = ref([
  {
    id: 0,
    title: 'Home',
    icon: 'IconHome',
    url: '/home',
  },
  {
    id: 1,
    title: 'Newest and Recent',
    icon: 'IconNew',
    url: '/blogs/newest',
  },
  {
    id: 2,
    title: 'Popular of the day',
    icon: 'IconPopular',
    url: '/blogs/popular',
  },
  {
    id: 3,
    title: 'Admin Management',
    icon: 'IconAdmin',
    url: '/admin',
    admin: true,
  },
])
const accessibleItems = computed(() => {
  return items.value.filter((item) => {
    if (item.admin) {
      return userStore.user?.roleName === 'ADMIN'
    }
    return true
  })
})
</script>

<template>
  <div class="flex flex-col items-start gap-5">
    <div class="bg-muted rounded-lg flex flex-col items-start gap-2 w-72 p-2">
      <AppSideBarItem
        v-for="item in accessibleItems"
        :key="item.id"
        v-bind="item"
      />
    </div>
  </div>
</template>
