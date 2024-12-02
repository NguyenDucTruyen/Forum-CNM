<script setup lang="ts">
import { $post } from '@/api/axios'

async function test() {
  const response = await $post('/generate-text', {
    prompt: 'Viết 1 đoạn văn về chú mèo dễ thương',
  })
  console.log(response)
}
</script>

<template>
  <button @click="test">
    Click
  </button>
</template>
