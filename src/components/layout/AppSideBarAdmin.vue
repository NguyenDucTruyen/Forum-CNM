<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const items = ref([
  {
    id: 0,
    title: 'User Management',
    icon: 'IconAdmin',
    url: '/admin',
  },
  {
    id: 1,
    title: 'Publish Blog',
    icon: 'IconAdmin',
    url: '/admin/publishblog',
  },
  {
    id: 2,
    title: 'Pending Blog',
    icon: 'IconAdmin',
    url: '/admin/pendingblog',

  },
])
</script>

<template>
  <div class="flex flex-col items-start gap-5">
    <div class="bg-muted rounded-lg flex lg:flex-col items-start gap-2 w-72 p-2">
      <RouterLink to="/home?page=1" class="w-full hidden lg:flex">
        <Button variant="link" class="w-full">
          <ArrowLeft /> Back to Home
        </Button>
      </RouterLink>
      <Separator class="mb-2 hidden lg:flex" />
      <h1 class="text-lg lg:inline-block hidden text-center w-full font-semibold mb-2">
        Admin Management
      </h1>
      <AppSideBarItem
        v-for="item in items"
        :key="item.id"
        v-bind="item"
      />
    </div>
  </div>
</template>
