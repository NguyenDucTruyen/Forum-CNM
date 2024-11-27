<script setup>
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

function handleChange(value) {
  themeStore.setTheme(value ? 'dark' : 'light')
}
const nameDisplay = computed(() => {
  if (userStore.user?.firstName || userStore.user?.lastName) {
    return `${userStore.user?.firstName ?? ''} ${userStore.user?.lastName ?? ''}`
  }
  return userStore.user?.email
})
</script>

<template>
  <DropdownMenu v-if="userStore?.user">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative lg:px-6 py-6 lg:w-60">
        <img
          v-if="userStore.user"
          v-lazy="userStore.user.profileImage ?? 'https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small_2x/simple-user-default-icon-free-png.png'"
          alt=""
          class="h-8 w-8 rounded-full object-cover"
        >
        <div class="max-lg:hidden  grid flex-1 text-left text-sm leading-tight">
          <span class="truncate text-xs">{{ nameDisplay }}</span>
        </div>
        <Icon name="IconArrowDown" class="ml-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-52 rounded-lg" side="bottom" align="end" :side-offset="4">
      <DropdownMenuItem class="cursor-pointer">
        <div class="flex justify-between item-centers w-full items-center">
          <span>Color theme</span><ColorSelect custom-class="max-w-24" />
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer">
        <div class="flex justify-between item-centers w-full items-center">
          <span>Dark mode</span><Switch :checked="themeStore.theme === 'dark'" @update:checked="handleChange" />
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <RouterLink :to="`/profile/${userStore.user.id}`">
        <DropdownMenuItem class="cursor-pointer">
          Profile
        </DropdownMenuItem>
      </RouterLink>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="authStore.logout()">
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
