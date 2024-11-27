<script setup>
import UserDropdown from '@/components/common/UserDropdown.vue'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { BookText, CloudUpload, X } from 'lucide-vue-next'

const categoryStore = useCategoryStore()
onMounted(async () => {
  await categoryStore.getCategories()
})
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
const isOpen = ref(false)
</script>

<template>
  <div class="flex items-center justify-between w-full bg-muted h-full gap-2 p-2 lg:pr-8">
    <RouterLink to="/home?page=1" class="lg:flex hidden p-4 pl-8 gap-2 cursor-pointer items-center">
      <Icon name="IconLogo" class="w-10 h-10" />
      <h1 class="max-lg:hidden text-3xl font-bold text-primary">
        S-Forum
      </h1>
    </RouterLink>
    <Icon name="IconMenuBar" class="lg:hidden w-6 h-6 cursor-pointer ml-4" @click="isOpen = true" />
    <Transition name="slide">
      <div v-show="isOpen" class="fixed inset-0 bg-background/60 z-50" @click="isOpen = false">
        <div class="h-full custom-scroll mb-5 bg-background pr-4 w-full max-w-72 p-4 relative" @click.stop>
          <X size="24" class="absolute top-4 right-4" @click="isOpen = false" />
          <h2 class="text-foreground font-medium text-2xl p-2 pb-4 leading-5">
            Categories
          </h2>
          <div
            v-if="categoryStore.categories"
            class="max-h-[calc(100%-3rem)] w-full overflow-auto custom-scroll mb-5 pr-4"
          >
            <template
              v-for="item in categoryStore.categories"
              :key="item._id"
            >
              <RouterLink
                :to="`/blogs/category/${item.slug}`"
                class="flex items-start gap-2 w-full rounded cursor-pointer hover:bg-secondary mb-3 p-2"
                @click="isOpen = false"
              >
                <Icon
                  name="IconTag"
                  class="object-contain h-8 w-8 flex justify-center items-center"
                />
                <div class="flex flex-col w-[calc(100%-2.5rem)] items-start gap-0.5">
                  <span class="text-foreground font-medium text-sm leading-4">{{ item.name }}</span>
                  <span class="text-foreground truncate font-normal w-full text-xs leading-[1.4]">{{ item.description }}</span>
                </div>
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
    <div class="flex gap-2">
      <template v-for="item in accessibleItems" :key="item.id">
        <Navigator :to="item.url" :icon="item.icon" />
      </template>
    </div>
    <div class="flex flex-2">
      <UserDropdown v-if="userStore?.user" />
      <template v-else>
        <router-link to="/auth/register">
          <Button class="rounded-full px-6" variant="ghost">
            Sign up
          </Button>
        </router-link>
        <router-link to="/auth/login">
          <Button class="rounded-full px-6 bg-foreground">
            Log in
          </Button>
        </router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Add these custom transition classes for slide with delay */
.slide-enter-active {
  @apply transition-transform duration-500 ease-in-out;
}
.slide-leave-active {
  @apply transition-transform duration-500 ease-in-out;
}
.slide-enter-from {
  @apply -translate-x-full;
}
.slide-enter-to {
  @apply translate-x-0;
}
.slide-leave-from {
  @apply translate-x-0;
}
.slide-leave-to {
  @apply -translate-x-full;
}
</style>
