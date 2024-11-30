<script setup>
import { toast } from '@/components/ui/toast'

onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    event.promise.catch((error) => {
      const data = error?.response?.data
      const errorMessage = data?.error || data?.message || 'Some thing went wrong'
      if (errorMessage) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        })
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('unhandledrejection', () => {})
})
</script>

<template>
  <slot />
</template>
