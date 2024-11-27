<script lang="ts" setup>
import { useConfirmStore } from '@/stores/confirm'

const confirmStore = useConfirmStore()
</script>

<template>
  <div
    v-if="confirmStore.visible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
      <div class="flex flex-col gap-y-2 text-center sm:text-left">
        <h2 class="text-lg font-semibold">
          {{ confirmStore.title }}
        </h2><p iclass="text-sm text-muted-foreground">
          {{ confirmStore.message }}
        </p>
      </div>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
        <Button variant="outline" @click="confirmStore.cancel">
          Cancel
        </Button>
        <Button @click="confirmStore.confirm">
          Continue
        </Button>
      </div>
    </div>
  </div>
</template>
