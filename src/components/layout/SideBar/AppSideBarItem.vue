<script setup>
import { useUserStore } from '@/stores/user'

const props = defineProps({
  icon: String,
  title: String,
  type: {
    type: String,
    default: 'router-link',
  },
  url: {
    type: String,
    default: '/home',
  },
  textStyle: {
    type: String,
    default: 'text-sm',
  },
})
const userStore = useUserStore()
const route = useRoute()
const isActive = computed(() => props.url === route.path)
const component = computed(() => {
  if (userStore.isAuthenticated)
    return props.type

  if (props.requiredAuthen)
    return 'button'
  else return 'RouterLink'
})
</script>

<template>
  <component
    :is="component"
    v-bind="props.type === 'router-link' ? { to: props.url } : {}"
    :class="{ isActive }"
    class="flex py-2 lg:pl-4 gap-4 w-full items-center cursor-pointer text-foreground max-lg:flex-col"
  >
    <Icon :name="props.icon" class="w-6 h-6" />
    <span class="font-bold hidden lg:flex" :class="props.textStyle">{{ props.title }}</span>
  </component>
</template>

<style lang="scss" scoped>
  .isActive {
    @apply bg-primary text-white rounded-lg;
  }
</style>
