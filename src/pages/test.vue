<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirm'

const confirmStore = useConfirmStore()
async function showMessage() {
  console.log('haha')
  const confirm = await confirmStore.showConfirmDialog({
    title: 'Test',
    message: 'This is a test message',
  })
  console.log(confirm)
}
</script>

<template>
  <Button @click="showMessage">
    Test
  </Button>
</template>
