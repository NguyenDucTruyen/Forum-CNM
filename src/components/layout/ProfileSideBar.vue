<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ArrowLeft } from 'lucide-vue-next'

const userStore = useUserStore()
const route = useRoute()

const items = ref([
  {
    id: 0,
    title: 'General Information',
    icon: 'IconInfor',
    url: `/profile/${route.params.id}`,
    // name: 'ProfileGeneralInformation',
  },
  {
    id: 1,
    title: 'Blog',
    icon: 'IconDocument',
    url: `/profile/${route.params.id}/blogs`,
  },
  {
    id: 2,
    title: 'Change Password',
    icon: 'IconDoubleKey',
    url: `/profile/${route.params.id}/changepassword`,
    author: true,
  },
])
const accessibleItems = computed(() => {
  return items.value.filter((item) => {
    if (item.author) {
      return userStore.user?.id === route.params.id
    }
    return true
  })
})
</script>

<template>
  <div class="flex flex-col items-start gap-5">
    <div class="bg-muted rounded-lg flex lg:flex-col items-start gap-2 w-72 p-2">
      <div class="hidden lg:flex flex-col">
        <RouterLink to="/home?page=1" class="w-full">
          <Button variant="link" class="w-full">
            <ArrowLeft /> Back to Home
          </Button>
        </RouterLink>
        <Separator class="mb-2" />
      </div>
      <AppSideBarItem
        v-for="item in accessibleItems"
        :key="item.id"
        v-bind="item"
      />
    </div>
  </div>
</template>
