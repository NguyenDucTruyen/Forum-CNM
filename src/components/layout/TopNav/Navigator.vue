<script setup lang="ts">
const props = defineProps<{
  to: string
  icon?: string
}>()
const route = useRoute()
const isActive = computed(() => route.fullPath.includes(props.to))
</script>

<template>
  <RouterLink :to="props.to">
    <div :class="{ isActive }" class="flex items-center justify-center text-foreground  p-2 gap-2">
      <Icon :name="props.icon" class="w-6 h-6" />
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
    .isActive {
        @apply bg-primary text-white rounded-lg;
    }
</style>
