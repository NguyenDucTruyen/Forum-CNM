<script setup lang="ts">
import { getDetailSession } from '@/api/stripe'

const route = useRoute()
const sessionId = route.query.sessionId as string
const data = await getDetailSession(sessionId)
console.log(data)
</script>

<template>
  <div>
    <h1>Success</h1>
    <p>Thank you for your purchase!</p>
  </div>
</template>
