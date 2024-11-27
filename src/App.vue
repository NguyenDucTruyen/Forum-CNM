<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

useThemeStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <ErrorBoundary>
      <component :is="Component" />
    </ErrorBoundary>
  </router-view>
  <Toaster />
  <DialogConfirm />
</template>
