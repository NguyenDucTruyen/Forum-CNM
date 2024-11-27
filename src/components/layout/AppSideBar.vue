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
      return userStore.user?.roleName === 'admin'
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
